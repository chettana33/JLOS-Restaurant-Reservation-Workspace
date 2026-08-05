/**
 * Editable Reservation Details subscribed directly to central state.
 * The form never owns a private Reservation Item copy.
 */

import { getSelectedItem, subscribe, updateReservationItem } from "./state.js";

export const STATUS_OPTIONS = Object.freeze([
  ["draft", "Draft"],
  ["pending", "Pending"],
  ["requested", "Requested"],
  ["confirmed", "Confirmed"],
  ["reconfirm", "Reconfirm"],
  ["cancelled", "Cancelled"],
  ["completed", "Completed"],
  ["archived", "Archived"],
]);

export const MEAL_OPTIONS = Object.freeze([
  ["", "Select meal"],
  ["breakfast", "Breakfast"],
  ["lunch", "Lunch"],
  ["dinner", "Dinner"],
  ["other", "Other"],
]);

const FIELD_CONFIG = Object.freeze({
  dayNumber: {
    label: "Day Number",
    type: "number",
    inputMode: "numeric",
    min: "1",
    step: "1",
    placeholder: "Enter itinerary day",
    validate: validatePositiveIntegerOrEmpty,
    convert: (value) => (value === "" ? null : Number(value)),
  },
  date: {
    label: "Date",
    type: "date",
    validate: validateDateOrEmpty,
  },
  meal: {
    label: "Meal",
    type: "select",
    options: MEAL_OPTIONS,
  },
  time: {
    label: "Time",
    type: "time",
    validate: validateTimeOrEmpty,
  },
  status: {
    label: "Status",
    type: "select",
    options: STATUS_OPTIONS,
    validate: validateStatus,
  },
  confirmationNumber: {
    label: "Confirmation Number",
    type: "text",
    placeholder: "Enter booking reference",
  },
  restaurantName: {
    label: "Restaurant Name",
    type: "text",
    placeholder: "Enter restaurant name",
  },
  phone: {
    label: "Phone",
    type: "tel",
    placeholder: "Enter restaurant phone",
    convert: emptyStringToNull,
  },
  contact: {
    label: "Contact",
    type: "text",
    placeholder: "Enter contact person or team",
    convert: emptyStringToNull,
  },
  locationLink: {
    label: "Location Link",
    type: "url",
    placeholder: "Paste Google Maps or restaurant location link",
    validate: validateHttpUrlOrEmpty,
  },
  adults: {
    label: "Adults",
    type: "number",
    inputMode: "numeric",
    min: "0",
    step: "1",
    validate: validateNonNegativeInteger,
    convert: Number,
  },
  children: {
    label: "Children",
    type: "number",
    inputMode: "numeric",
    min: "0",
    step: "1",
    validate: validateNonNegativeInteger,
    convert: Number,
  },
  guides: {
    label: "Guides",
    type: "number",
    inputMode: "numeric",
    min: "0",
    step: "1",
    validate: validateNonNegativeInteger,
    convert: Number,
  },
  menu: {
    label: "Menu",
    type: "textarea",
    rows: "2",
    placeholder: "Enter menu or course name",
  },
  notes: {
    label: "Notes",
    type: "textarea",
    rows: "3",
    placeholder: "Add operational notes or dietary requirements",
  },
});

const SECTION_CONFIG = Object.freeze([
  {
    number: "01",
    title: "Reservation",
    description: "Schedule, meal period and workflow status",
    className: "reservation-form-grid--reservation",
    fields: ["dayNumber", "date", "meal", "time", "status", "confirmationNumber"],
  },
  {
    number: "02",
    title: "Restaurant",
    description: "Supplier contact and location reference",
    className: "reservation-form-grid--restaurant",
    fields: ["restaurantName", "phone", "contact", "locationLink"],
    wideFields: ["restaurantName", "locationLink"],
  },
  {
    number: "03",
    title: "Guests",
    description: "Current reservation headcount",
    className: "reservation-form-grid--guests",
    fields: ["adults", "children", "guides"],
  },
  {
    number: "04",
    title: "Menu & Notes",
    description: "Service details for the selected reservation",
    className: "reservation-form-grid--notes",
    fields: ["menu", "notes"],
  },
]);

function validatePositiveIntegerOrEmpty(value) {
  return value === "" || (/^\d+$/.test(value) && Number(value) > 0)
    ? ""
    : "Enter a positive whole number or leave this field empty.";
}

function validateNonNegativeInteger(value) {
  return /^\d+$/.test(value) && Number(value) >= 0
    ? ""
    : "Enter a whole number of 0 or more.";
}

function validateDateOrEmpty(value) {
  if (value === "") {
    return "";
  }

  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? ""
    : "Enter a valid date.";
}

function validateTimeOrEmpty(value) {
  return value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
    ? ""
    : "Enter a valid time in 24-hour format.";
}

function validateStatus(value) {
  return STATUS_OPTIONS.some(([status]) => status === value) ? "" : "Select an approved status.";
}

function validateHttpUrlOrEmpty(value) {
  if (value === "") {
    return "";
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? ""
      : "Use a link beginning with http:// or https://.";
  } catch {
    return "Enter a valid link beginning with http:// or https://.";
  }
}

function emptyStringToNull(value) {
  return value === "" ? null : value;
}

function createSectionHeader(section) {
  const header = document.createElement("header");
  const number = document.createElement("span");
  const copy = document.createElement("div");
  const heading = document.createElement("h3");
  const description = document.createElement("p");

  header.className = "reservation-form-section__header";
  number.className = "section-number";
  number.setAttribute("aria-hidden", "true");
  number.textContent = section.number;
  heading.textContent = section.title;
  description.textContent = section.description;
  copy.append(heading, description);
  header.append(number, copy);
  return header;
}

function createControl(fieldName, config) {
  let control;

  if (config.type === "select") {
    control = document.createElement("select");
    config.options.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      control.append(option);
    });
  } else if (config.type === "textarea") {
    control = document.createElement("textarea");
    control.rows = Number(config.rows);
  } else {
    control = document.createElement("input");
    control.type = config.type;
  }

  control.id = `reservation-${fieldName}`;
  control.name = fieldName;
  control.dataset.reservationField = fieldName;
  control.autocomplete = "off";

  ["placeholder", "inputMode", "min", "step"].forEach((attribute) => {
    if (config[attribute] !== undefined) {
      control[attribute] = config[attribute];
    }
  });

  return control;
}

function createFormField(fieldName, isWide = false) {
  const config = FIELD_CONFIG[fieldName];
  const wrapper = document.createElement("div");
  const label = document.createElement("label");
  const control = createControl(fieldName, config);
  const error = document.createElement("p");

  wrapper.className = `reservation-form-field${isWide ? " reservation-form-field--wide" : ""}`;
  label.htmlFor = control.id;
  label.textContent = config.label;
  error.id = `${control.id}-error`;
  error.className = "reservation-form-field__error";
  error.setAttribute("aria-live", "polite");
  control.setAttribute("aria-describedby", error.id);
  wrapper.append(label, control, error);
  return wrapper;
}

function createImageSection() {
  const section = document.createElement("section");
  const placeholder = document.createElement("div");
  const icon = document.createElement("span");
  const title = document.createElement("strong");
  const description = document.createElement("span");

  section.className = "reservation-form-section";
  section.append(createSectionHeader({
    number: "05",
    title: "Image",
    description: "Reference image placeholder",
  }));
  placeholder.className = "reservation-image-dropzone";
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute("aria-label", "Image upload will be available in a future task");
  icon.className = "reservation-image-dropzone__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "◇";
  title.textContent = "Image placeholder";
  description.textContent = "Image upload and persistence are not available yet.";
  placeholder.append(icon, title, description);
  section.append(placeholder);
  return section;
}

function buildForm(container) {
  const fragment = document.createDocumentFragment();

  SECTION_CONFIG.forEach((sectionConfig) => {
    const section = document.createElement("section");
    const grid = document.createElement("div");

    section.className = "reservation-form-section";
    grid.className = `reservation-form-grid ${sectionConfig.className}`;
    section.append(createSectionHeader(sectionConfig));
    sectionConfig.fields.forEach((fieldName) => {
      grid.append(createFormField(fieldName, sectionConfig.wideFields?.includes(fieldName)));
    });
    section.append(grid);
    fragment.append(section);
  });

  fragment.append(createImageSection());
  container.replaceChildren(fragment);
}

function getItemFieldValue(item, fieldName) {
  if (fieldName === "menu") {
    return item.menu?.name ?? "";
  }

  return item[fieldName] ?? "";
}

function setFieldError(control, message) {
  const error = document.querySelector(`#${control.id}-error`);
  control.setCustomValidity(message);
  control.setAttribute("aria-invalid", String(Boolean(message)));

  if (error) {
    error.textContent = message;
  }
}

function syncFormWithItem(container, item) {
  const controls = container.querySelectorAll("[data-reservation-field]");

  controls.forEach((control) => {
    control.disabled = !item;

    if (!item || document.activeElement === control) {
      return;
    }

    control.value = String(getItemFieldValue(item, control.dataset.reservationField));
    setFieldError(control, "");
  });

  container.classList.toggle("reservation-details-form--empty", !item);
}

function getChangesForField(item, fieldName, rawValue) {
  const config = FIELD_CONFIG[fieldName];
  const value = config.convert ? config.convert(rawValue) : rawValue;

  if (fieldName === "menu") {
    return {
      menu: {
        ...(item.menu ?? { pricePerGuest: null, currency: null, items: [] }),
        name: value === "" ? null : value,
      },
    };
  }

  return { [fieldName]: value };
}

function handleFieldInput(event) {
  const control = event.target.closest("[data-reservation-field]");

  if (!control) {
    return;
  }

  const item = getSelectedItem();
  if (!item) {
    return;
  }

  const fieldName = control.dataset.reservationField;
  const config = FIELD_CONFIG[fieldName];
  const message = config.validate?.(control.value) ?? "";

  setFieldError(control, message);
  if (message) {
    return;
  }

  updateReservationItem(item.id, getChangesForField(item, fieldName, control.value));
}

export function initializeReservationDetails(container) {
  buildForm(container);

  const renderFromState = () => syncFormWithItem(container, getSelectedItem());
  const unsubscribe = subscribe(renderFromState);
  const preventSubmit = (event) => event.preventDefault();

  container.addEventListener("input", handleFieldInput);
  container.addEventListener("submit", preventSubmit);
  renderFromState();

  return () => {
    unsubscribe();
    container.removeEventListener("input", handleFieldInput);
    container.removeEventListener("submit", preventSubmit);
  };
}
