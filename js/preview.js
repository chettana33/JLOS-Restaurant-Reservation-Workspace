/**
 * Output Preview summary subscribed directly to central state.
 */

import { getSelectedItem, subscribe } from "./state.js";

const PREVIEW_PLACEHOLDERS = Object.freeze({
  restaurantName: "Restaurant not set",
  day: "Unscheduled",
  date: "Date not set",
  meal: "Meal not set",
  time: "Time not set",
  status: "Pending",
  confirmationNumber: "Not set",
  contact: "Not set",
  phone: "Not set",
  menu: "Menu not set",
  notes: "No notes",
});

function formatValue(value) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createPreviewDetail(label, value) {
  const detail = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.textContent = label;
  description.textContent = value;
  detail.append(term, description);
  return detail;
}

function isSafeLocationLink(value) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function createLocationDetail(locationLink) {
  const detail = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.textContent = "Location";
  if (isSafeLocationLink(locationLink)) {
    const link = document.createElement("a");
    link.className = "preview-location-link";
    link.href = locationLink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open Location";
    description.append(link);
  } else {
    description.textContent = "Not set";
  }

  detail.append(term, description);
  return detail;
}

function getGuestSummary(item) {
  const adults = Number.isInteger(item.adults) ? item.adults : 0;
  const children = Number.isInteger(item.children) ? item.children : 0;
  const guides = Number.isInteger(item.guides) ? item.guides : 0;
  return `${adults} adults · ${children} children · ${guides} guides`;
}

export function renderOutputPreview(container, item) {
  container.replaceChildren();

  if (!item) {
    const emptyState = document.createElement("p");
    emptyState.className = "output-preview-paper__loading";
    emptyState.textContent = "No reservation selected.";
    container.append(emptyState);
    return;
  }

  const header = document.createElement("header");
  const brand = document.createElement("div");
  const brandName = document.createElement("span");
  const documentType = document.createElement("p");
  const status = document.createElement("span");
  const body = document.createElement("div");
  const dayAndMeal = document.createElement("p");
  const title = document.createElement("h3");
  const details = document.createElement("dl");
  const serviceGrid = document.createElement("div");
  const menuBlock = document.createElement("section");
  const menuHeading = document.createElement("h4");
  const menu = document.createElement("p");
  const notesBlock = document.createElement("section");
  const notesHeading = document.createElement("h4");
  const notes = document.createElement("p");
  const footer = document.createElement("footer");

  header.className = "output-preview-paper__header";
  brandName.className = "output-preview-paper__brand";
  brandName.textContent = "JLOS";
  documentType.textContent = "Reservation Summary";
  brand.append(brandName, documentType);
  status.className = `status-badge status-badge--${item.status}`;
  status.textContent = formatValue(item.status) || PREVIEW_PLACEHOLDERS.status;
  header.append(brand, status);

  body.className = "output-preview-paper__body";
  dayAndMeal.className = "output-preview-paper__context";
  dayAndMeal.textContent = `${
    Number.isInteger(item.dayNumber) ? `Day ${item.dayNumber}` : PREVIEW_PLACEHOLDERS.day
  } · ${formatValue(item.meal) || PREVIEW_PLACEHOLDERS.meal}`;
  title.textContent = item.restaurantName || PREVIEW_PLACEHOLDERS.restaurantName;

  details.className = "output-preview-paper__details";
  details.append(
    createPreviewDetail("Date", item.date || PREVIEW_PLACEHOLDERS.date),
    createPreviewDetail("Time", item.time || PREVIEW_PLACEHOLDERS.time),
    createPreviewDetail(
      "Confirmation",
      item.confirmationNumber || PREVIEW_PLACEHOLDERS.confirmationNumber,
    ),
    createPreviewDetail("Guests", getGuestSummary(item)),
    createPreviewDetail("Phone", item.phone || PREVIEW_PLACEHOLDERS.phone),
    createLocationDetail(item.locationLink),
  );

  serviceGrid.className = "output-preview-paper__service-grid";
  menuBlock.className = "output-preview-paper__service";
  menuHeading.textContent = "Menu";
  menu.textContent = item.menu?.name || PREVIEW_PLACEHOLDERS.menu;
  menuBlock.append(menuHeading, menu);
  notesBlock.className = "output-preview-paper__service";
  notesHeading.textContent = "Notes";
  notes.textContent = item.notes || PREVIEW_PLACEHOLDERS.notes;
  notesBlock.append(notesHeading, notes);
  serviceGrid.append(menuBlock, notesBlock);
  body.append(dayAndMeal, title, details, serviceGrid);

  footer.className = "output-preview-paper__footer";
  footer.textContent = `Contact: ${item.contact || PREVIEW_PLACEHOLDERS.contact} · Japan Land Operator Suite`;
  container.append(header, body, footer);
}

export function initializeOutputPreview(container) {
  const renderFromState = () => renderOutputPreview(container, getSelectedItem());
  const unsubscribe = subscribe(renderFromState);

  renderFromState();
  return unsubscribe;
}
