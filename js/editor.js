/**
 * Reservation Details selected-item summary subscribed to central state.
 */

import { getSelectedItem, subscribe } from "./state.js";

const DETAIL_PLACEHOLDERS = Object.freeze({
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

function createSummaryField(label, value, modifier = "") {
  const field = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  field.className = `selected-summary-field${modifier ? ` ${modifier}` : ""}`;
  term.textContent = label;
  description.textContent = value;
  field.append(term, description);
  return field;
}

export function renderReservationDetails(container, item) {
  container.replaceChildren();

  if (!item) {
    const emptyState = document.createElement("p");
    emptyState.className = "selected-item-summary__loading";
    emptyState.textContent = "No reservation selected.";
    container.append(emptyState);
    return;
  }

  const heading = document.createElement("div");
  const eyebrow = document.createElement("span");
  const title = document.createElement("h3");
  const fields = document.createElement("dl");
  const statusField = createSummaryField("Status", formatValue(item.status) || DETAIL_PLACEHOLDERS.status);
  const statusValue = statusField.querySelector("dd");

  heading.className = "selected-item-summary__heading";
  eyebrow.className = "selected-item-summary__eyebrow";
  eyebrow.textContent = "Current selection";
  title.textContent = item.title || DETAIL_PLACEHOLDERS.title;
  heading.append(eyebrow, title);

  fields.className = "selected-item-summary__grid";
  fields.append(
    createSummaryField(
      "Day",
      Number.isInteger(item.dayNumber) ? `Day ${item.dayNumber}` : DETAIL_PLACEHOLDERS.day,
    ),
    createSummaryField("Date", item.date || DETAIL_PLACEHOLDERS.date),
    createSummaryField("Meal", formatValue(item.meal) || DETAIL_PLACEHOLDERS.meal),
    createSummaryField("Time", item.time || DETAIL_PLACEHOLDERS.time),
    statusField,
  );

  statusValue.className = `status-badge status-badge--${item.status}`;
  container.append(heading, fields);
}

export function initializeReservationDetails(container) {
  const renderFromState = () => renderReservationDetails(container, getSelectedItem());
  const unsubscribe = subscribe(renderFromState);

  renderFromState();
  return unsubscribe;
}
