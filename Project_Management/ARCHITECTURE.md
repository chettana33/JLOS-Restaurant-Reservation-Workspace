# ARCHITECTURE

## Current Product

- Product: Restaurant Reservation Workspace
- Version: v4.0 Alpha
- Architecture generation: Generation 2
- Principle: Operator First

## Core Workspace Flow

```text
Workspace
└── Reservation Timeline
    └── Selected Reservation Item
        ├── Reservation Details
        └── Output Preview
```

The Reservation Timeline is the core navigation and operation structure. Each timeline entry is one Reservation Item. Reservation Details and Output Preview consume the same selected item and must not maintain duplicate reservation records.

Export and AI Package remain planned downstream capabilities. They are not implemented in Sprint 1.

## Central State Architecture

```text
Application Startup
└── Central State (js/state.js)
    ├── project
    ├── reservationItems
    └── selectedItemId
        └── derived selectedItem

Central State notifications
├── Reservation Timeline subscriber
├── Reservation Details subscriber
└── Output Preview subscriber
```

`js/state.js` is the single source of truth for project data, Reservation Items, and selection. `selectedItem` is derived from `selectedItemId` and `reservationItems`; it is never stored as duplicated state. Components subscribe to state notifications and pull their own current view data. Timeline does not call Reservation Details or Output Preview directly.

State is memory-only in TASK-005. Local Storage, backend synchronization, save, import, and export remain outside the current architecture scope.

## Data Architecture

- Timeline data is a flat Reservation Item collection.
- Day groups are derived from `dayNumber` and `date`.
- Items are sorted by `time` inside each day.
- Selection is transient workspace state and is not stored in Reservation Item data.
- The canonical Alpha schema is `data/reservation-item.schema.json`.
- Physical address data is excluded; use `locationLink` only.
- Central state rejects malformed items and duplicate Reservation Item IDs.
- State snapshots are cloned so consumers cannot mutate the central collection directly.

## Module Boundary

The Alpha product implements restaurant data only with `itemType: "restaurant"`. The model uses `itemType` as an extension point for future Hotel, Bus, Attraction, Guide, and Other modules. Those future modules require separately approved schemas and UI specifications before implementation.

## Detailed Specifications

- Data model: `docs/architecture/RESERVATION_TIMELINE_MODEL.md`
- Timeline UX: `docs/ux/RESERVATION_TIMELINE_UX.md`

No backend, API, storage, event handling, PDF, export, or AI Package logic is part of TASK-003.
