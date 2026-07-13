/**
 * Output Preview selected-item summary subscribed to central state.
 */

import { getSelectedItem, subscribe } from "./state.js";

const PREVIEW_PLACEHOLDERS = Object.freeze({
  title: "Untitled Reservation",
  day: "Unscheduled",
  date: "Date not set",
  meal: "Meal not set",
  time: "Time not set",
  status: "Pending",
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
  title.textContent = item.title || PREVIEW_PLACEHOLDERS.title;

  details.className = "output-preview-paper__details";
  details.append(
    createPreviewDetail("Date", item.date || PREVIEW_PLACEHOLDERS.date),
    createPreviewDetail("Time", item.time || PREVIEW_PLACEHOLDERS.time),
    createPreviewDetail("Status", formatValue(item.status) || PREVIEW_PLACEHOLDERS.status),
  );
  body.append(dayAndMeal, title, details);

  footer.className = "output-preview-paper__footer";
  footer.textContent = "Japan Land Operator Suite · Selected reservation only";
  container.append(header, body, footer);
}

export function initializeOutputPreview(container) {
  const renderFromState = () => renderOutputPreview(container, getSelectedItem());
  const unsubscribe = subscribe(renderFromState);

  renderFromState();
  return unsubscribe;
}
