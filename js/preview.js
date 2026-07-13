/**
 * Live customer-facing Output Preview subscribed directly to central state.
 */

import { getProject, getSelectedItem, subscribe } from "./state.js";

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

const PLACEHOLDERS = Object.freeze({
  tourCode: "Tour code pending",
  customer: "Customer not set",
  guide: "Guide not assigned",
  travelDate: "Travel date pending",
  restaurantName: "Restaurant not confirmed",
  day: "Day not set",
  date: "Date not set",
  meal: "Meal not set",
  time: "Time not set",
  status: "Pending",
  confirmationNumber: "Confirmation pending",
  contact: "Contact pending",
  phone: "Phone not set",
  menu: "Menu details pending",
  notes: "No additional notes",
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

function formatLabel(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value) {
  if (!value) {
    return PLACEHOLDERS.date;
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return PLACEHOLDERS.date;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function isSafeHttpUrl(value) {
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

function getGuestCounts(item) {
  const adults = Number.isInteger(item?.adults) && item.adults >= 0 ? item.adults : 0;
  const children = Number.isInteger(item?.children) && item.children >= 0 ? item.children : 0;
  const guides = Number.isInteger(item?.guides) && item.guides >= 0 ? item.guides : 0;

  return {
    adults,
    children,
    guides,
    total: adults + children + guides,
  };
}

function createDefinitionItem(label, value, modifier = "") {
  const item = createElement("div", `reservation-document__definition${modifier ? ` ${modifier}` : ""}`);
  const term = createElement("dt", "", label);
  const description = createElement("dd", "", value);

  item.append(term, description);
  return item;
}

function createProjectMeta(project) {
  const meta = createElement("dl", "reservation-document__project-meta");

  meta.append(
    createDefinitionItem("Tour Code", project.tourCode || PLACEHOLDERS.tourCode),
    createDefinitionItem("Customer", project.customer || PLACEHOLDERS.customer),
    createDefinitionItem("Guide", project.guide || PLACEHOLDERS.guide),
    createDefinitionItem("Travel Date", project.travelDate || PLACEHOLDERS.travelDate),
  );
  return meta;
}

function createStatusBadge(statusValue) {
  const approvedStatus = Object.hasOwn(STATUS_LABELS, statusValue) ? statusValue : "pending";
  const badge = createElement(
    "span",
    `status-badge status-badge--${approvedStatus} reservation-document__status`,
    STATUS_LABELS[approvedStatus] || PLACEHOLDERS.status,
  );

  badge.setAttribute("aria-label", `Reservation status: ${badge.textContent}`);
  return badge;
}

function createLocationControl(locationLink) {
  const wrapper = createElement("div", "reservation-document__location");

  if (!isSafeHttpUrl(locationLink)) {
    wrapper.append(createElement("span", "reservation-document__muted", "Location link not available"));
    return wrapper;
  }

  const link = createElement("a", "preview-location-link", "Open Location");
  link.href = locationLink;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", "Open restaurant location in a new tab");
  wrapper.append(link);
  return wrapper;
}

function createGuestSection(item) {
  const counts = getGuestCounts(item);
  const section = createElement("section", "reservation-document__card reservation-document__guest-card");
  const heading = createElement("h5", "", "Guest Details");
  const grid = createElement("dl", "reservation-document__guest-grid");

  grid.append(
    createDefinitionItem("Adults", String(counts.adults)),
    createDefinitionItem("Children", String(counts.children)),
    createDefinitionItem("Guides", String(counts.guides)),
    createDefinitionItem("Total Guests", String(counts.total), "reservation-document__definition--total"),
  );
  section.append(heading, grid);
  return section;
}

function createContactSection(item) {
  const section = createElement("section", "reservation-document__card");
  const heading = createElement("h5", "", "Restaurant Contact");
  const details = createElement("dl", "reservation-document__contact-list");

  details.append(
    createDefinitionItem("Contact", item.contact || PLACEHOLDERS.contact),
    createDefinitionItem("Phone", item.phone || PLACEHOLDERS.phone),
  );
  section.append(heading, details, createLocationControl(item.locationLink));
  return section;
}

function createMenuSummary(item) {
  const wrapper = createElement("div", "reservation-document__menu-copy");
  const menuName = createElement("p", "reservation-document__menu-name");
  const menuItems = Array.isArray(item.menu?.items) ? item.menu.items.filter(Boolean) : [];

  menuName.textContent = item.menu?.name || PLACEHOLDERS.menu;
  wrapper.append(menuName);

  if (menuItems.length > 0) {
    const list = createElement("ul", "reservation-document__menu-list");
    menuItems.slice(0, 4).forEach((menuItem) => list.append(createElement("li", "", menuItem)));
    wrapper.append(list);
  }

  return wrapper;
}

function createServiceSection(item) {
  const section = createElement("section", "reservation-document__service-card");
  const menu = createElement("div", "reservation-document__service-block");
  const notes = createElement("div", "reservation-document__service-block");

  menu.append(createElement("h5", "", "Menu"), createMenuSummary(item));
  notes.append(
    createElement("h5", "", "Notes"),
    createElement("p", "reservation-document__notes", item.notes || PLACEHOLDERS.notes),
  );
  section.append(menu, notes);
  return section;
}

function createImagePlaceholder() {
  const placeholder = createElement("div", "reservation-document__image-placeholder");
  const icon = createElement("span", "", "◇");

  icon.setAttribute("aria-hidden", "true");
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute("aria-label", "Restaurant image not available");
  placeholder.append(icon, createElement("strong", "", "Restaurant image"), createElement("span", "", "Image not available"));
  return placeholder;
}

function createImageArea(item) {
  const figure = createElement("figure", "reservation-document__image");

  if (!isSafeHttpUrl(item.image)) {
    figure.append(createImagePlaceholder());
    return figure;
  }

  const image = document.createElement("img");
  const restaurantName = item.restaurantName || "selected restaurant";

  image.src = item.image;
  image.alt = `Reference image for ${restaurantName}`;
  image.referrerPolicy = "no-referrer";
  image.addEventListener(
    "error",
    () => {
      figure.replaceChildren(createImagePlaceholder());
    },
    { once: true },
  );
  figure.append(image);
  return figure;
}

function createEmptyDocument(container, project) {
  const title = createElement("h3", "reservation-document__title", "Restaurant Reservation Summary");
  const message = createElement("p", "reservation-document__empty", "Select a reservation to preview its customer summary.");

  container.append(title, createProjectMeta(project), message);
}

export function renderOutputPreview(container, project, item) {
  container.replaceChildren();

  if (!item) {
    createEmptyDocument(container, project);
    return;
  }

  const header = createElement("header", "reservation-document__header");
  const brandRow = createElement("div", "reservation-document__brand-row");
  const brand = createElement("div", "reservation-document__brand");
  const title = createElement("h3", "reservation-document__title", "Restaurant Reservation Summary");
  const body = createElement("div", "reservation-document__body");
  const main = createElement("div", "reservation-document__main");
  const reservation = createElement("section", "reservation-document__reservation");
  const reservationHeading = createElement("div", "reservation-document__reservation-heading");
  const context = createElement("p", "reservation-document__context");
  const restaurantName = createElement("h4", "", item.restaurantName || PLACEHOLDERS.restaurantName);
  const details = createElement("dl", "reservation-document__reservation-grid");
  const operations = createElement("div", "reservation-document__operations");
  const footer = createElement("footer", "reservation-document__footer");

  brand.append(
    createElement("span", "reservation-document__brand-name", "JLOS"),
    createElement("span", "reservation-document__brand-copy", "Japan Land Operator Suite"),
  );
  brandRow.append(brand, createStatusBadge(item.status));
  header.append(brandRow, title, createProjectMeta(project));

  context.textContent = `${
    Number.isInteger(item.dayNumber) ? `Day ${item.dayNumber}` : PLACEHOLDERS.day
  } · ${formatLabel(item.meal) || PLACEHOLDERS.meal}`;
  reservationHeading.append(context, restaurantName);
  details.append(
    createDefinitionItem("Date", formatDate(item.date)),
    createDefinitionItem("Time", item.time || PLACEHOLDERS.time),
    createDefinitionItem(
      "Confirmation",
      item.confirmationNumber || PLACEHOLDERS.confirmationNumber,
    ),
  );
  reservation.append(reservationHeading, details);
  operations.append(createGuestSection(item), createContactSection(item));
  main.append(reservation, operations, createServiceSection(item));
  body.append(main, createImageArea(item));

  footer.append(
    createElement("span", "", "Prepared for customer reference"),
    createElement("span", "", "Selected reservation only"),
  );
  container.append(header, body, footer);
}

export function initializeOutputPreview(container) {
  const renderFromState = () => renderOutputPreview(container, getProject(), getSelectedItem());
  const unsubscribe = subscribe(renderFromState);

  renderFromState();
  return unsubscribe;
}
