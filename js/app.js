/**
 * JLOS v4.0 Alpha application startup.
 */

import { initializeReservationDetails } from "./editor.js";
import { initializeOutputPreview } from "./preview.js";
import { initializePdfExport } from "./pdf-export.js";
import { initializeProjectFileControls } from "./storage.js";
import { initializeAiPackageExport } from "./ai-package.js";
import { initializeSettings } from "./settings.js";
import { getProject, getProjectDefaults, initializeState, subscribe } from "./state.js";
import { initializeReservationTimeline, validateTimelineData } from "./timeline.js";

const PROJECT_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  working: "Working",
  completed: "Completed",
});

async function loadInitialData() {
  try {
    const [timelineResponse, schemaResponse] = await Promise.all([
      fetch("data/sample-reservation-timeline.json"),
      fetch("data/reservation-item.schema.json"),
    ]);

    if (!timelineResponse.ok || !schemaResponse.ok) {
      throw new Error("Reservation Timeline data or schema could not be loaded.");
    }

    const [timelineData, reservationItemSchema] = await Promise.all([
      timelineResponse.json(),
      schemaResponse.json(),
    ]);
    const validationErrors = validateTimelineData(timelineData, reservationItemSchema);

    if (validationErrors.length > 0) {
      throw new Error(`Reservation Timeline validation failed: ${validationErrors.join(" ")}`);
    }

    return { reservationItems: timelineData.items, reservationItemSchema };
  } catch (error) {
    console.warn("Starting JLOS with an empty Reservation Timeline.", error);
    return { reservationItems: [], reservationItemSchema: null };
  }
}

function initializeProjectSummary(container) {
  const renderProject = () => {
    const project = getProject();

    ["tourCode", "customer", "guide", "travelDate"].forEach((fieldName) => {
      const field = container.querySelector(`[data-project-field="${fieldName}"]`);
      field.textContent = project[fieldName] || "Not set";
    });

    const status = container.querySelector('[data-project-field="projectStatus"]');
    const statusValue = PROJECT_STATUS_LABELS[project.projectStatus] ? project.projectStatus : "working";
    status.className = `status-badge status-badge--${statusValue}`;
    status.textContent = PROJECT_STATUS_LABELS[statusValue];
  };
  const unsubscribe = subscribe(renderProject);

  renderProject();
  return unsubscribe;
}

async function startApplication() {
  const { reservationItems, reservationItemSchema } = await loadInitialData();
  const initialProject = { ...getProjectDefaults(), projectStatus: "working" };

  initializeState(initialProject, reservationItems);
  initializeProjectSummary(document.querySelector("[data-project-summary]"));
  initializeReservationTimeline({
    container: document.querySelector("#reservation-timeline"),
    countElement: document.querySelector("#timeline-count"),
    newReservationButton: document.querySelector('[data-action="new-reservation"]'),
    duplicateButton: document.querySelector('[data-action="duplicate-reservation"]'),
    deleteButton: document.querySelector('[data-action="delete-reservation"]'),
    deleteConfirmDialog: document.querySelector("#delete-confirm-dialog"),
  });
  initializeReservationDetails(document.querySelector("#reservation-details"));
  initializeOutputPreview(document.querySelector("#output-preview-paper"));
  initializeProjectFileControls({
    saveButton: document.querySelector('[data-action="save-project"]'),
    openButton: document.querySelector('[data-action="open-project"]'),
    fileInput: document.querySelector("#project-file-input"),
    statusElement: document.querySelector("#project-file-status"),
    reservationItemSchema,
  });
  initializePdfExport({
    button: document.querySelector('[data-action="export-pdf"]'),
    previewElement: document.querySelector("#output-preview-paper"),
  });
  initializeAiPackageExport({
    button: document.querySelector('[data-action="export-ai-package"]'),
    reservationItemSchema,
  });
  initializeSettings({
    button: document.querySelector('[data-action="open-settings"]'),
    dialog: document.querySelector("#settings-dialog"),
    form: document.querySelector("#settings-form"),
    statusElement: document.querySelector("#settings-status"),
  });
}

startApplication();
