/**
 * JLOS v4.0 Alpha application startup.
 */

import { initializeReservationDetails } from "./editor.js";
import { initializeOutputPreview } from "./preview.js";
import { initializeState } from "./state.js";
import { initializeReservationTimeline, validateTimelineData } from "./timeline.js";

const INITIAL_PROJECT = Object.freeze({
  tourCode: "JPN-2607-018",
  customer: "Siam Horizon Travel",
  guide: "Ms. Aiko Tanaka",
  travelDate: "18–24 Jul 2026",
  projectStatus: "working",
});

async function loadInitialReservationItems() {
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

    return timelineData.items;
  } catch (error) {
    console.warn("Starting JLOS with an empty Reservation Timeline.", error);
    return [];
  }
}

async function startApplication() {
  const loadedItems = await loadInitialReservationItems();

  initializeState(INITIAL_PROJECT, loadedItems);
  initializeReservationTimeline({
    container: document.querySelector("#reservation-timeline"),
    countElement: document.querySelector("#timeline-count"),
    newReservationButton: document.querySelector('[data-action="new-reservation"]'),
  });
  initializeReservationDetails(document.querySelector("#reservation-details"));
  initializeOutputPreview(document.querySelector("#output-preview-paper"));
}

startApplication();
