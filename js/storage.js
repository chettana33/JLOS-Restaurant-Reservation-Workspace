/**
 * Local JSON project file import/export for JLOS v4.0 Alpha.
 * This module does not use Local Storage or keep a second state copy.
 */

import { getState, replaceState } from "./state.js";

export const PROJECT_FILE_VERSION = "4.0-alpha";

const TOP_LEVEL_KEYS = Object.freeze([
  "version",
  "savedAt",
  "project",
  "reservationItems",
  "selectedItemId",
]);
const PROJECT_KEYS = Object.freeze([
  "tourCode",
  "customer",
  "guide",
  "travelDate",
  "projectStatus",
]);
const PROJECT_STATUSES = new Set(["draft", "working", "completed"]);
const EDITABLE_BLANK_FIELDS = new Set([
  "dayNumber",
  "date",
  "meal",
  "time",
  "title",
  "restaurantName",
  "locationLink",
]);

export class ProjectFileError extends Error {
  constructor(message, code = "invalid") {
    super(message);
    this.name = "ProjectFileError";
    this.code = code;
  }
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function matchesType(value, type) {
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "object") return isPlainObject(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  return typeof value === type;
}

function matchesFormat(value, format) {
  if (format === "uuid") {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  if (format === "date") {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  }

  if (format === "date-time") {
    return typeof value === "string" && !Number.isNaN(Date.parse(value));
  }

  if (format === "uri") {
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }

  return true;
}

function isAllowedEditableBlank(value, fieldName) {
  if (!EDITABLE_BLANK_FIELDS.has(fieldName)) return false;
  if (fieldName === "dayNumber") return value === null;
  return value === "";
}

function validateSchemaValue(value, schema, path, errors, fieldName = "") {
  if (isAllowedEditableBlank(value, fieldName)) return;

  const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (!expectedTypes.some((type) => matchesType(value, type))) {
    errors.push(`${path} has an invalid type.`);
    return;
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path} has an unknown value.`);
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
    value.forEach((entry, index) => {
      validateSchemaValue(entry, schema.items, `${path}[${index}]`, errors);
    });
  }

  if (isPlainObject(value)) {
    const properties = schema.properties ?? {};

    (schema.required ?? []).forEach((key) => {
      if (!Object.hasOwn(value, key)) errors.push(`${path}.${key} is required.`);
    });

    if (schema.additionalProperties === false) {
      Object.keys(value).forEach((key) => {
        if (!Object.hasOwn(properties, key)) errors.push(`${path}.${key} is not allowed.`);
      });
    }

    Object.entries(properties).forEach(([key, propertySchema]) => {
      if (Object.hasOwn(value, key)) {
        validateSchemaValue(value[key], propertySchema, `${path}.${key}`, errors, key);
      }
    });
  }
}

function validateExactKeys(value, allowedKeys, path, errors) {
  Object.keys(value).forEach((key) => {
    if (!allowedKeys.includes(key)) errors.push(`${path}.${key} is not allowed.`);
  });
}

export function validateProjectDocument(documentData, reservationItemSchema) {
  if (!isPlainObject(documentData)) {
    throw new ProjectFileError("Invalid project file: the document must be a JSON object.");
  }

  if (documentData.version !== PROJECT_FILE_VERSION) {
    throw new ProjectFileError("Unsupported project version.", "unsupported-version");
  }

  const errors = [];
  validateExactKeys(documentData, TOP_LEVEL_KEYS, "projectFile", errors);

  TOP_LEVEL_KEYS.forEach((key) => {
    if (!Object.hasOwn(documentData, key)) errors.push(`projectFile.${key} is required.`);
  });

  if (!matchesFormat(documentData.savedAt, "date-time")) {
    errors.push("projectFile.savedAt must be a valid ISO date-time.");
  }

  if (!isPlainObject(documentData.project)) {
    errors.push("projectFile.project must be an object.");
  } else {
    validateExactKeys(documentData.project, PROJECT_KEYS, "projectFile.project", errors);
    PROJECT_KEYS.forEach((key) => {
      if (!Object.hasOwn(documentData.project, key)) {
        errors.push(`projectFile.project.${key} is required.`);
      } else if (typeof documentData.project[key] !== "string") {
        errors.push(`projectFile.project.${key} must be a string.`);
      }
    });

    if (
      typeof documentData.project.projectStatus === "string" &&
      !PROJECT_STATUSES.has(documentData.project.projectStatus)
    ) {
      errors.push("projectFile.project.projectStatus has an unknown value.");
    }
  }

  if (!Array.isArray(documentData.reservationItems)) {
    errors.push("projectFile.reservationItems must be an array.");
  } else if (!isPlainObject(reservationItemSchema)) {
    errors.push("Reservation Item validation schema is unavailable.");
  } else {
    const seenIds = new Set();
    documentData.reservationItems.forEach((item, index) => {
      validateSchemaValue(item, reservationItemSchema, `projectFile.reservationItems[${index}]`, errors);

      if (isPlainObject(item) && typeof item.id === "string") {
        if (seenIds.has(item.id)) errors.push(`Duplicate Reservation Item id "${item.id}".`);
        seenIds.add(item.id);
      }
    });
  }

  const requestedSelectedItemId =
    documentData.selectedItemId === null || typeof documentData.selectedItemId === "string"
      ? documentData.selectedItemId
      : null;

  if (errors.length > 0) {
    throw new ProjectFileError(`Invalid project file: ${errors[0]}`);
  }

  const selectedItemId = documentData.reservationItems.some(
    (item) => item.id === requestedSelectedItemId,
  )
    ? requestedSelectedItemId
    : (documentData.reservationItems[0]?.id ?? null);

  return {
    project: structuredClone(documentData.project),
    reservationItems: structuredClone(documentData.reservationItems),
    selectedItemId,
  };
}

export function parseProjectDocument(text, reservationItemSchema) {
  let documentData;

  try {
    documentData = JSON.parse(text);
  } catch {
    throw new ProjectFileError("Invalid project file: JSON could not be parsed.");
  }

  return validateProjectDocument(documentData, reservationItemSchema);
}

export function restoreProjectText(text, reservationItemSchema) {
  const nextState = parseProjectDocument(text, reservationItemSchema);
  return replaceState(nextState);
}

export function sanitizeValue(value, schema) {
  if (Array.isArray(value)) {
    return schema.items ? value.map((entry) => sanitizeValue(entry, schema.items)) : [];
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(schema.properties ?? {})
        .filter(([key]) => Object.hasOwn(value, key))
        .map(([key, childSchema]) => [key, sanitizeValue(value[key], childSchema)]),
    );
  }

  return value;
}

export function createProjectDocument(stateSnapshot, reservationItemSchema, now = new Date()) {
  if (!isPlainObject(stateSnapshot) || !isPlainObject(reservationItemSchema)) {
    throw new ProjectFileError("Invalid project data or Reservation Item schema.");
  }

  const documentData = {
    version: PROJECT_FILE_VERSION,
    savedAt: now.toISOString(),
    project: Object.fromEntries(
      PROJECT_KEYS.map((key) => [key, stateSnapshot.project?.[key] ?? (key === "projectStatus" ? "working" : "")]),
    ),
    reservationItems: Array.isArray(stateSnapshot.reservationItems)
      ? stateSnapshot.reservationItems.map((item) => sanitizeValue(item, reservationItemSchema))
      : [],
    selectedItemId: stateSnapshot.selectedItemId ?? null,
  };

  validateProjectDocument(documentData, reservationItemSchema);
  return documentData;
}

export function createProjectFilename(tourCode, now = new Date()) {
  const safeTourCode = String(tourCode ?? "")
    .trim()
    .replace(/[^a-z0-9_-]+/gi, "_")
    .replace(/^_+|_+$/g, "");
  const date = now.toISOString().slice(0, 10);

  return `JLOS_${safeTourCode || "Project"}_${date}.json`;
}

export function downloadProjectDocument(documentData, filename) {
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

function setFeedback(statusElement, message, type = "") {
  statusElement.textContent = message;
  statusElement.className = `toolbar-status${type ? ` toolbar-status--${type}` : ""}`;
}

export function initializeProjectFileControls({
  saveButton,
  openButton,
  fileInput,
  statusElement,
  reservationItemSchema,
}) {
  if (!saveButton || !openButton || !fileInput || !statusElement) {
    throw new Error("Project file controls are incomplete.");
  }

  const handleSave = () => {
    try {
      const snapshot = getState();
      const now = new Date();
      const projectDocument = createProjectDocument(snapshot, reservationItemSchema, now);
      const filename = createProjectFilename(snapshot.project.tourCode, now);

      downloadProjectDocument(projectDocument, filename);
      setFeedback(statusElement, "Project saved.", "success");
    } catch (error) {
      console.error("Project save failed.", error);
      setFeedback(statusElement, "Invalid project data. Project was not saved.", "error");
    }
  };

  const handleOpen = () => {
    fileInput.click();
  };

  const handleFileSelection = async () => {
    const [file] = fileInput.files;

    if (!file) {
      openButton.focus();
      return;
    }

    try {
      const text = await file.text();
      restoreProjectText(text, reservationItemSchema);
      setFeedback(statusElement, "Project loaded.", "success");
    } catch (error) {
      const unsupportedVersion = error instanceof ProjectFileError && error.code === "unsupported-version";
      setFeedback(
        statusElement,
        unsupportedVersion ? "Unsupported project version." : "Invalid project file. Current project was not changed.",
        "error",
      );
    } finally {
      fileInput.value = "";
      openButton.focus();
    }
  };

  saveButton.addEventListener("click", handleSave);
  openButton.addEventListener("click", handleOpen);
  fileInput.addEventListener("change", handleFileSelection);

  return () => {
    saveButton.removeEventListener("click", handleSave);
    openButton.removeEventListener("click", handleOpen);
    fileInput.removeEventListener("change", handleFileSelection);
  };
}
