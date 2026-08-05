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

function prepareReplacementItems(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("Replacement state requires reservationItems to be an array.");
  }

  const seenIds = new Set();

  return items.map((item, index) => {
    if (!isValidItem(item)) {
      throw new TypeError(`Reservation Item at index ${index} is malformed.`);
    }

    if (seenIds.has(item.id)) {
      throw new TypeError(`Duplicate Reservation Item id "${item.id}" is not allowed.`);
    }

    seenIds.add(item.id);
    return clone(item);
  });
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

/**
 * Atomically replaces all persisted application state after file validation.
 * Invalid selection is normalized to the first available Reservation Item.
 */
export function replaceState(nextState) {
  if (!nextState || typeof nextState !== "object" || Array.isArray(nextState)) {
    throw new TypeError("Replacement state must be an object.");
  }

  if (!nextState.project || typeof nextState.project !== "object" || Array.isArray(nextState.project)) {
    throw new TypeError("Replacement state requires a project object.");
  }

  const nextProject = {
    ...DEFAULT_PROJECT,
    ...clone(nextState.project),
  };
  const nextItems = prepareReplacementItems(nextState.reservationItems);
  const requestedSelection = nextState.selectedItemId;
  const nextSelectedItemId = nextItems.some((item) => item.id === requestedSelection)
    ? requestedSelection
    : (nextItems[0]?.id ?? null);

  state.project = nextProject;
  state.reservationItems = nextItems;
  state.selectedItemId = nextSelectedItemId;
  notifySubscribers();

  return nextSelectedItemId;
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
    updatedAt: new Date().toISOString(),
  };
  notifySubscribers();
  return true;
}

export function duplicateReservationItem(id) {
  const itemIndex = state.reservationItems.findIndex((item) => item.id === id);

  if (itemIndex < 0) {
    console.warn(`Cannot duplicate Reservation Item "${id}" because it does not exist.`);
    return null;
  }

  if (!isValidItem(state.reservationItems[itemIndex])) {
    console.warn(`Cannot duplicate Reservation Item "${id}" because it is malformed.`);
    return null;
  }

  const timestamp = new Date().toISOString();
  const duplicateItem = {
    ...clone(state.reservationItems[itemIndex]),
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  state.reservationItems.splice(itemIndex + 1, 0, duplicateItem);
  notifySubscribers();
  return duplicateItem.id;
}

export function deleteReservationItem(id) {
  const itemIndex = state.reservationItems.findIndex((item) => item.id === id);

  if (itemIndex < 0) {
    console.warn(`Cannot delete Reservation Item "${id}" because it does not exist.`);
    return false;
  }

  const wasSelected = state.selectedItemId === id;

  state.reservationItems.splice(itemIndex, 1);

  if (wasSelected) {
    const replacement =
      state.reservationItems[itemIndex]?.id ??
      state.reservationItems[itemIndex - 1]?.id ??
      null;
    state.selectedItemId = replacement;
  }

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
