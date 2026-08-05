/**
 * AI Package export for JLOS v4.0 Alpha.
 *
 * Downloads the current project as an AI-ready JSON document containing only
 * real project data from the Central State API plus a derived context summary.
 * No data is fabricated; empty or null values stay empty or null.
 */

import { getState } from "./state.js";
import { getSortedTimelineItems } from "./timeline.js";
import { sanitizeValue } from "./storage.js";

const PROJECT_KEYS = Object.freeze([
  "tourCode",
  "customer",
  "guide",
  "travelDate",
  "projectStatus",
]);

const STATUS_LABELS = Object.freeze([
  "draft",
  "pending",
  "requested",
  "confirmed",
  "reconfirm",
  "cancelled",
  "completed",
  "archived",
]);

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function buildProject(stateSnapshot) {
  return Object.fromEntries(
    PROJECT_KEYS.map((key) => [
      key,
      stateSnapshot.project?.[key] ?? (key === "projectStatus" ? "working" : ""),
    ]),
  );
}

function buildDayGroups(items) {
  const sortedItems = getSortedTimelineItems(items);
  const groups = new Map();

  sortedItems.forEach((item) => {
    const dayKey = Number.isInteger(item.dayNumber) ? String(item.dayNumber) : "unscheduled";

    if (!groups.has(dayKey)) {
      groups.set(dayKey, {
        dayNumber: Number.isInteger(item.dayNumber) ? item.dayNumber : null,
        date: item.date ?? null,
        reservationCount: 0,
        items: [],
      });
    }

    const group = groups.get(dayKey);
    group.reservationCount += 1;
    group.items.push({
      id: item.id,
      time: item.time ?? null,
      meal: item.meal ?? null,
      restaurantName: item.restaurantName ?? null,
      status: item.status ?? null,
      adults: Number.isInteger(item.adults) ? item.adults : 0,
      children: Number.isInteger(item.children) ? item.children : 0,
      guides: Number.isInteger(item.guides) ? item.guides : 0,
    });
  });

  return Array.from(groups.values());
}

function buildTotals(items) {
  return items.reduce(
    (totals, item) => {
      const adults = Number.isInteger(item.adults) && item.adults >= 0 ? item.adults : 0;
      const children = Number.isInteger(item.children) && item.children >= 0 ? item.children : 0;
      const guides = Number.isInteger(item.guides) && item.guides >= 0 ? item.guides : 0;

      totals.reservations += 1;
      totals.adults += adults;
      totals.children += children;
      totals.guides += guides;
      totals.guests += adults + children + guides;
      return totals;
    },
    { reservations: 0, adults: 0, children: 0, guides: 0, guests: 0 },
  );
}

function buildStatusCounts(items) {
  const counts = Object.fromEntries(STATUS_LABELS.map((status) => [status, 0]));

  items.forEach((item) => {
    const status = Object.hasOwn(counts, item.status) ? item.status : "pending";
    counts[status] += 1;
  });

  return counts;
}

function buildSummary(project, reservationCount) {
  const parts = [];

  if (project.tourCode) {
    parts.push(`Tour ${project.tourCode}`);
  }

  if (project.customer) {
    parts.push(`for ${project.customer}`);
  }

  if (project.travelDate) {
    parts.push(`on ${project.travelDate}`);
  }

  const reservationPhrase =
    reservationCount === 1
      ? "1 restaurant reservation"
      : `${reservationCount} restaurant reservations`;

  if (parts.length > 0) {
    return `${parts.join(" ")}: ${reservationPhrase}.`;
  }

  return `A JLOS project with ${reservationPhrase}.`;
}

export function createAiPackageDocument(stateSnapshot, reservationItemSchema, now = new Date()) {
  if (!isPlainObject(stateSnapshot)) {
    throw new TypeError("AI package export requires a state snapshot object.");
  }

  const rawItems = Array.isArray(stateSnapshot.reservationItems)
    ? stateSnapshot.reservationItems
    : [];
  const sanitizedItems = isPlainObject(reservationItemSchema)
    ? rawItems.map((item) => sanitizeValue(item, reservationItemSchema))
    : rawItems;

  if (!isPlainObject(reservationItemSchema) && rawItems.length > 0) {
    console.warn("AI package export: Reservation Item schema is unavailable; exporting items as-is.");
  }

  const project = buildProject(stateSnapshot);
  const context = {
    purpose: "AI-ready export of the current JLOS project for machine assistance.",
    summary: buildSummary(project, sanitizedItems.length),
    dayGroups: buildDayGroups(sanitizedItems),
    totals: buildTotals(sanitizedItems),
    statusCounts: buildStatusCounts(sanitizedItems),
  };

  return {
    format: "jlos-ai-package",
    formatVersion: "1.0",
    product: "JLOS Restaurant Reservation Workspace",
    productVersion: "4.0-alpha",
    exportedAt: now.toISOString(),
    project,
    reservationItems: sanitizedItems,
    context,
  };
}

export function createAiPackageFilename(tourCode, now = new Date()) {
  const safeTourCode = String(tourCode ?? "")
    .trim()
    .replace(/[^a-z0-9_-]+/gi, "_")
    .replace(/^_+|_+$/g, "");
  const date = now.toISOString().slice(0, 10);

  return `JLOS_${safeTourCode || "Project"}_AI_${date}.json`;
}

export function downloadAiPackage(documentData, filename) {
  const blob = new Blob([`${JSON.stringify(documentData, null, 2)}\n`], {
    type: "application/json;charset=utf-8",
  });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
}

function showExportMessage(button, message, isError = false) {
  const id = "ai-package-status";
  let status = document.querySelector(`#${id}`);

  if (!status) {
    status = document.createElement("span");
    status.id = id;
    status.className = "ai-package-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    button.insertAdjacentElement("afterend", status);
  }

  status.textContent = message;
  status.classList.toggle("ai-package-status--error", isError);
}

export function initializeAiPackageExport({ button, reservationItemSchema }) {
  if (!button) {
    return () => {};
  }

  const handleExport = () => {
    try {
      const snapshot = getState();
      const now = new Date();
      const documentData = createAiPackageDocument(snapshot, reservationItemSchema, now);
      const filename = createAiPackageFilename(snapshot.project.tourCode, now);

      downloadAiPackage(documentData, filename);
      showExportMessage(button, `AI package exported ${filename}`);
    } catch (error) {
      console.error("AI package export failed.", error);
      showExportMessage(button, "AI package export failed. Please try again.", true);
    }
  };

  button.addEventListener("click", handleExport);

  return () => button.removeEventListener("click", handleExport);
}
