/**
 * Reservation Timeline rendering and Alpha data-contract validation.
 * The component reads and changes selection only through the central state API.
 */

import {
  addReservationItem,
  deleteReservationItem,
  duplicateReservationItem,
  getNewReservationDefaults,
  getReservationItems,
  getSelectedItem,
  getSelectedItemId,
  setSelectedItemId,
  subscribe,
} from "./state.js";

const PLACEHOLDERS = Object.freeze({
  title: "Untitled Reservation",
  restaurantName: "Restaurant not set",
  time: "Time not set",
  meal: "Meal not set",
});

const STATUS_LABELS = Object.freeze({
  draft: "Draft",
  pending: "Pending",
  requested: "Requested",
  confirmed: "Confirmed",
  reconfirm: "Reconfirm",
  cancelled: "Cancelled",
  completed: "Completed",
  archived: "Archived",
});

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return element;
}

function matchesType(value, expectedType) {
  if (expectedType === "null") {
    return value === null;
  }

  if (expectedType === "array") {
    return Array.isArray(value);
  }

  if (expectedType === "object") {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  if (expectedType === "integer") {
    return Number.isInteger(value);
  }

  if (expectedType === "number") {
    return typeof value === "number" && Number.isFinite(value);
  }

  return typeof value === expectedType;
}

function matchesFormat(value, format) {
  if (format === "uuid") {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  if (format === "date") {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  }

  if (format === "date-time") {
    return !Number.isNaN(Date.parse(value));
  }

  if (format === "uri") {
    try {
      return Boolean(new URL(value).protocol);
    } catch {
      return false;
    }
  }

  return true;
}

function validateValue(value, schema, path, errors) {
  const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
  const hasExpectedType = expectedTypes.some((type) => matchesType(value, type));

  if (!hasExpectedType) {
    errors.push(`${path} has an invalid type.`);
    return;
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path} is not an allowed value.`);
  }

  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${path} is shorter than allowed.`);
    }

    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${path} does not match the required pattern.`);
    }

    if (schema.format && !matchesFormat(value, schema.format)) {
      errors.push(`${path} does not match the ${schema.format} format.`);
    }
  }

  if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) {
    errors.push(`${path} is below the minimum value.`);
  }

  if (Array.isArray(value) && schema.items) {
    value.forEach((entry, index) => validateValue(entry, schema.items, `${path}[${index}]`, errors));
  }

  if (matchesType(value, "object")) {
    const properties = schema.properties ?? {};

    (schema.required ?? []).forEach((requiredKey) => {
      if (!Object.hasOwn(value, requiredKey)) {
        errors.push(`${path}.${requiredKey} is required.`);
      }
    });

    if (schema.additionalProperties === false) {
      Object.keys(value).forEach((key) => {
        if (!Object.hasOwn(properties, key)) {
          errors.push(`${path}.${key} is not allowed.`);
        }
      });
    }

    Object.entries(properties).forEach(([key, propertySchema]) => {
      if (Object.hasOwn(value, key)) {
        validateValue(value[key], propertySchema, `${path}.${key}`, errors);
      }
    });
  }
}

export function validateTimelineData(data, reservationItemSchema) {
  if (!data || !Array.isArray(data.items)) {
    return ["Timeline data must contain an items array."];
  }

  const errors = [];
  data.items.forEach((item, index) => {
    validateValue(item, reservationItemSchema, `items[${index}]`, errors);
  });

  return errors;
}

function compareTimelineItems(firstItem, secondItem) {
  const firstIsScheduled = Number.isInteger(firstItem.dayNumber);
  const secondIsScheduled = Number.isInteger(secondItem.dayNumber);

  if (firstIsScheduled !== secondIsScheduled) {
    return firstIsScheduled ? -1 : 1;
  }

  if (firstIsScheduled && firstItem.dayNumber !== secondItem.dayNumber) {
    return firstItem.dayNumber - secondItem.dayNumber;
  }

  if (!firstItem.time && secondItem.time) {
    return 1;
  }

  if (firstItem.time && !secondItem.time) {
    return -1;
  }

  return (
    firstItem.time.localeCompare(secondItem.time) ||
    firstItem.createdAt.localeCompare(secondItem.createdAt) ||
    firstItem.id.localeCompare(secondItem.id)
  );
}

export function getSortedTimelineItems(items) {
  return [...items].sort(compareTimelineItems);
}

function groupItemsByDay(items) {
  return getSortedTimelineItems(items).reduce((groups, item) => {
    const dayKey = Number.isInteger(item.dayNumber) ? String(item.dayNumber) : "unscheduled";

    if (!groups.has(dayKey)) {
      groups.set(dayKey, []);
    }

    groups.get(dayKey).push(item);
    return groups;
  }, new Map());
}

function formatDayDate(dateValue) {
  if (!dateValue) {
    return "Date not set";
  }

  const date = new Date(`${dateValue}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function createTimelineCard(item, activeItemId) {
  const isSelected = item.id === activeItemId;
  const card = createElement(
    "button",
    `timeline-item${isSelected ? " timeline-item--selected" : ""}`,
  );
  const primary = createElement("span", "timeline-item__primary");
  const time = createElement("span", "timeline-item__time", item.time || PLACEHOLDERS.time);
  const meal = createElement("span", "timeline-item__meal", item.meal || PLACEHOLDERS.meal);
  const content = createElement("span", "timeline-item__content");
  const title = createElement("strong", "timeline-item__title", item.title || PLACEHOLDERS.title);
  const restaurant = createElement(
    "span",
    "timeline-item__restaurant",
    item.restaurantName || PLACEHOLDERS.restaurantName,
  );
  const status = createElement(
    "span",
    `status-badge status-badge--${item.status}`,
    STATUS_LABELS[item.status] ?? item.status,
  );
  const meta = createElement("span", "timeline-item__meta");
  const guestCount = item.adults + item.children + item.guides;

  card.type = "button";
  card.dataset.reservationId = item.id;
  card.setAttribute("role", "option");
  card.setAttribute("aria-selected", String(isSelected));
  card.setAttribute(
    "aria-label",
    `${item.time || PLACEHOLDERS.time}, ${item.meal || PLACEHOLDERS.meal}, ${
      item.restaurantName || PLACEHOLDERS.restaurantName
    }, ${STATUS_LABELS[item.status] ?? item.status}`,
  );

  primary.append(time, meal);
  content.append(title, restaurant);

  if (guestCount > 0) {
    content.append(createElement("span", "timeline-item__guests", `${guestCount} guests`));
  }

  meta.append(status);

  if (isSelected) {
    const selectedIndicator = createElement("span", "timeline-item__selected-indicator");
    const selectedIcon = createElement("span", "", "✓");
    const selectedText = createElement("span", "visually-hidden", "Selected");

    selectedIcon.setAttribute("aria-hidden", "true");
    selectedIndicator.append(selectedIcon, selectedText);
    meta.append(selectedIndicator);
  }

  card.append(primary, content, meta);
  return card;
}

export function renderReservationTimeline(container, items, activeItemId) {
  container.replaceChildren();
  container.setAttribute("aria-busy", "false");

  if (items.length === 0) {
    container.append(createElement("p", "timeline-state", "No reservations yet."));
    return;
  }

  groupItemsByDay(items).forEach((dayItems, dayNumber) => {
    const isUnscheduled = dayNumber === "unscheduled";
    const dayGroup = createElement("section", "timeline-day");
    const heading = createElement("h3", "timeline-day__heading");
    const headingLabel = createElement(
      "span",
      "timeline-day__label",
      isUnscheduled ? "Unscheduled" : `Day ${dayNumber}`,
    );
    const headingDate = createElement(
      "span",
      "timeline-day__date",
      isUnscheduled ? "Date not set" : formatDayDate(dayItems[0]?.date),
    );
    const itemList = createElement("div", "timeline-day__items");

    itemList.setAttribute("role", "listbox");
    itemList.setAttribute(
      "aria-label",
      isUnscheduled ? "Unscheduled reservations" : `Day ${dayNumber} reservations`,
    );
    heading.append(headingLabel, headingDate);
    dayItems.forEach((item) => itemList.append(createTimelineCard(item, activeItemId)));
    dayGroup.append(heading, itemList);
    container.append(dayGroup);
  });
}

export function renderTimelineError(container, message) {
  container.setAttribute("aria-busy", "false");
  container.replaceChildren(createElement("p", "timeline-state timeline-state--error", message));
}

export function createBlankReservationItem(referenceItem) {
  const timestamp = new Date().toISOString();
  const defaults = getNewReservationDefaults();

  return {
    id: crypto.randomUUID(),
    dayNumber: Number.isInteger(referenceItem?.dayNumber) ? referenceItem.dayNumber : null,
    date: referenceItem?.date ?? "",
    itemType: "restaurant",
    meal: defaults.meal,
    time: "",
    title: "",
    status: defaults.status,
    confirmationNumber: "",
    restaurantName: "",
    phone: null,
    contact: null,
    locationLink: "",
    adults: defaults.adults,
    children: defaults.children,
    guides: defaults.guides,
    menu: {
      name: null,
      pricePerGuest: null,
      currency: defaults.currency,
      items: [],
    },
    notes: "",
    image: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function initializeReservationTimeline({
  container,
  countElement,
  newReservationButton,
  duplicateButton,
  deleteButton,
  deleteConfirmDialog,
}) {
  function syncItemActionButtons() {
    const hasSelectedItem = Boolean(getSelectedItem());

    if (duplicateButton) {
      duplicateButton.disabled = !hasSelectedItem;
    }

    if (deleteButton) {
      deleteButton.disabled = !hasSelectedItem;
    }
  }

  function renderFromState() {
    const items = getReservationItems();

    renderReservationTimeline(container, items, getSelectedItemId());
    countElement.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;
    syncItemActionButtons();
  }

  function revealSelectedItem(shouldFocus = false) {
    requestAnimationFrame(() => {
      const selectedElement = container.querySelector('[aria-selected="true"]');

      selectedElement?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });

      if (shouldFocus) {
        selectedElement?.focus({ preventScroll: true });
      }
    });
  }

  function selectItemFromElement(timelineItem) {
    if (setSelectedItemId(timelineItem.dataset.reservationId)) {
      revealSelectedItem(true);
    }
  }

  function handleTimelineClick(event) {
    const timelineItem = event.target.closest("[data-reservation-id]");

    if (timelineItem && container.contains(timelineItem)) {
      selectItemFromElement(timelineItem);
    }
  }

  function handleTimelineKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const timelineItem = event.target.closest("[data-reservation-id]");

    if (!timelineItem || !container.contains(timelineItem)) {
      return;
    }

    event.preventDefault();
    selectItemFromElement(timelineItem);
  }

  function handleNewReservation() {
    const newReservationItem = createBlankReservationItem(getSelectedItem());

    if (addReservationItem(newReservationItem)) {
      setSelectedItemId(newReservationItem.id);
      revealSelectedItem(true);
    }
  }

  function handleDuplicate() {
    const selectedItem = getSelectedItem();

    if (!selectedItem) {
      return;
    }

    const duplicatedItemId = duplicateReservationItem(selectedItem.id);

    if (duplicatedItemId) {
      setSelectedItemId(duplicatedItemId);
      revealSelectedItem(true);
    }
  }

  function handleDelete() {
    const selectedItem = getSelectedItem();

    if (!selectedItem || !deleteConfirmDialog) {
      return;
    }

    const message = deleteConfirmDialog.querySelector("[data-delete-confirm-name]");

    if (message) {
      message.textContent = `Delete "${selectedItem.restaurantName || selectedItem.title || "Untitled Reservation"}" from the project?`;
    }

    deleteConfirmDialog.showModal();
  }

  function handleCancelDelete() {
    deleteConfirmDialog?.close();
    deleteButton?.focus();
  }

  function handleConfirmDelete() {
    const selectedItem = getSelectedItem();

    deleteConfirmDialog?.close();

    if (selectedItem && deleteReservationItem(selectedItem.id)) {
      revealSelectedItem(true);
    }
  }

  const unsubscribe = subscribe(renderFromState);

  container.addEventListener("click", handleTimelineClick);
  container.addEventListener("keydown", handleTimelineKeydown);
  newReservationButton.addEventListener("click", handleNewReservation);
  duplicateButton?.addEventListener("click", handleDuplicate);
  deleteButton?.addEventListener("click", handleDelete);
  deleteConfirmDialog?.querySelector('[data-action="cancel-delete"]')?.addEventListener("click", handleCancelDelete);
  deleteConfirmDialog?.querySelector('[data-action="confirm-delete"]')?.addEventListener("click", handleConfirmDelete);
  renderFromState();
  revealSelectedItem();

  return () => {
    unsubscribe();
    container.removeEventListener("click", handleTimelineClick);
    container.removeEventListener("keydown", handleTimelineKeydown);
    newReservationButton.removeEventListener("click", handleNewReservation);
    duplicateButton?.removeEventListener("click", handleDuplicate);
    deleteButton?.removeEventListener("click", handleDelete);
    deleteConfirmDialog?.querySelector('[data-action="cancel-delete"]')?.removeEventListener("click", handleCancelDelete);
    deleteConfirmDialog?.querySelector('[data-action="confirm-delete"]')?.removeEventListener("click", handleConfirmDelete);
  };
}
