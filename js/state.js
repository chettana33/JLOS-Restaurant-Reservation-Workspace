/**
 * Central application state for JLOS v4.0 Alpha.
 * selectedItem is always derived and is never stored as duplicated state.
 */

const DEFAULT_PROJECT = Object.freeze({
  tourCode: "",
  customer: "",
  guide: "",
  travelDate: "",
  projectStatus: "working",
});

const state = {
  project: { ...DEFAULT_PROJECT },
  reservationItems: [],
  selectedItemId: null,
};

const subscribers = new Set();

function clone(value) {
  return structuredClone(value);
}

function isValidItem(item) {
  return Boolean(item && typeof item === "object" && typeof item.id === "string" && item.id);
}

function prepareReservationItems(items) {
  if (!Array.isArray(items)) {
    console.warn("State initialization expected reservationItems to be an array.");
    return [];
  }

  const seenIds = new Set();
  const preparedItems = [];

  items.forEach((item, index) => {
    if (!isValidItem(item)) {
      console.warn(`Reservation Item at index ${index} is malformed and was ignored.`);
      return;
    }

    if (seenIds.has(item.id)) {
      console.warn(`Duplicate Reservation Item id "${item.id}" was ignored.`);
      return;
    }

    seenIds.add(item.id);
    preparedItems.push(clone(item));
  });

  return preparedItems;
}

export function initializeState(projectData = {}, reservationItems = []) {
  const safeProjectData = projectData && typeof projectData === "object" ? projectData : {};

  state.project = {
    ...DEFAULT_PROJECT,
    ...clone(safeProjectData),
  };
  state.reservationItems = prepareReservationItems(reservationItems);
  state.selectedItemId = state.reservationItems[0]?.id ?? null;
  notifySubscribers();
}

export function getState() {
  return {
    project: getProject(),
    reservationItems: getReservationItems(),
    selectedItemId: getSelectedItemId(),
  };
}

export function getProject() {
  return clone(state.project);
}

export function getReservationItems() {
  return clone(state.reservationItems);
}

export function getSelectedItemId() {
  return state.selectedItemId;
}

export function getSelectedItem() {
  const selectedItem = state.reservationItems.find((item) => item.id === state.selectedItemId);
  return selectedItem ? clone(selectedItem) : null;
}

export function setSelectedItemId(id) {
  if (id === null) {
    if (state.selectedItemId !== null) {
      state.selectedItemId = null;
      notifySubscribers();
    }

    return true;
  }

  if (!state.reservationItems.some((item) => item.id === id)) {
    console.warn(`Cannot select Reservation Item "${id}" because it does not exist.`);
    return false;
  }

  if (state.selectedItemId === id) {
    return true;
  }

  state.selectedItemId = id;
  notifySubscribers();
  return true;
}

export function addReservationItem(item) {
  if (!isValidItem(item)) {
    console.warn("Cannot add a malformed Reservation Item.");
    return false;
  }

  if (state.reservationItems.some((existingItem) => existingItem.id === item.id)) {
    console.warn(`Cannot add duplicate Reservation Item id "${item.id}".`);
    return false;
  }

  state.reservationItems.push(clone(item));
  notifySubscribers();
  return true;
}

export function updateReservationItem(id, changes) {
  const itemIndex = state.reservationItems.findIndex((item) => item.id === id);

  if (itemIndex < 0) {
    console.warn(`Cannot update Reservation Item "${id}" because it does not exist.`);
    return false;
  }

  if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
    console.warn(`Cannot update Reservation Item "${id}" with malformed changes.`);
    return false;
  }

  state.reservationItems[itemIndex] = {
    ...state.reservationItems[itemIndex],
    ...clone(changes),
    id,
  };
  notifySubscribers();
  return true;
}

export function subscribe(listener) {
  if (typeof listener !== "function") {
    throw new TypeError("State subscriber must be a function.");
  }

  subscribers.add(listener);
  return () => subscribers.delete(listener);
}

export function notifySubscribers() {
  subscribers.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error("A state subscriber failed.", error);
    }
  });
}
