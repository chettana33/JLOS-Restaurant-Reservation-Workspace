/**
 * Workspace Settings dialog.
 * Reads and writes settings through the central state API only.
 */

import { MEAL_OPTIONS, STATUS_OPTIONS } from "./editor.js";
import { getSettings, updateSettings } from "./state.js";

function populateSelect(selectElement, options, selectedValue) {
  selectElement.replaceChildren();
  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    if (value === selectedValue) {
      option.selected = true;
    }
    selectElement.append(option);
  });
}

function applySettingsToForm(form) {
  const settings = getSettings();
  const { newReservation, projectDefaults, exportFilenamePrefix } = settings;

  populateSelect(form.elements["newReservation-meal"], MEAL_OPTIONS, newReservation.meal);
  populateSelect(form.elements["newReservation-status"], STATUS_OPTIONS, newReservation.status);
  form.elements["newReservation-adults"].value = String(newReservation.adults);
  form.elements["newReservation-children"].value = String(newReservation.children);
  form.elements["newReservation-guides"].value = String(newReservation.guides);
  form.elements["newReservation-currency"].value = newReservation.currency;
  form.elements["projectDefaults-tourCode"].value = projectDefaults.tourCode;
  form.elements["projectDefaults-customer"].value = projectDefaults.customer;
  form.elements["projectDefaults-guide"].value = projectDefaults.guide;
  form.elements["projectDefaults-travelDate"].value = projectDefaults.travelDate;
  form.elements["exportFilenamePrefix"].value = exportFilenamePrefix;
}

function collectSettingsFromForm(form) {
  const formData = new FormData(form);

  return {
    newReservation: {
      meal: formData.get("newReservation-meal") ?? "",
      status: formData.get("newReservation-status") ?? "",
      adults: Number(formData.get("newReservation-adults") ?? 0),
      children: Number(formData.get("newReservation-children") ?? 0),
      guides: Number(formData.get("newReservation-guides") ?? 0),
      currency: String(formData.get("newReservation-currency") ?? "").toUpperCase(),
    },
    projectDefaults: {
      tourCode: String(formData.get("projectDefaults-tourCode") ?? ""),
      customer: String(formData.get("projectDefaults-customer") ?? ""),
      guide: String(formData.get("projectDefaults-guide") ?? ""),
      travelDate: String(formData.get("projectDefaults-travelDate") ?? ""),
    },
    exportFilenamePrefix: String(formData.get("exportFilenamePrefix") ?? "").trim(),
  };
}

export function initializeSettings({ button, dialog, form, statusElement }) {
  if (!button || !dialog || !form || !statusElement) {
    throw new Error("Settings controls are incomplete.");
  }

  const handleOpen = () => {
    applySettingsToForm(form);
    statusElement.textContent = "";
    dialog.showModal();
  };

  const handleClose = () => {
    dialog.close();
    button.focus();
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const settings = collectSettingsFromForm(form);

    if (updateSettings(settings)) {
      statusElement.textContent = "Workspace settings saved.";
      dialog.close();
      button.focus();
    } else {
      statusElement.textContent = "Settings could not be saved.";
    }
  };

  button.addEventListener("click", handleOpen);
  form.addEventListener("submit", handleSubmit);
  form.querySelector('[data-action="cancel-settings"]').addEventListener("click", handleCancel);

  return () => {
    button.removeEventListener("click", handleOpen);
    form.removeEventListener("submit", handleSubmit);
    form.querySelector('[data-action="cancel-settings"]').removeEventListener("click", handleCancel);
  };
}
