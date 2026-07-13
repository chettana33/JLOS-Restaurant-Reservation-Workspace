# DECISIONS

Major architecture and product decisions are recorded here. New decisions must preserve Operator First and require approval before implementation when they change architecture.

## DEC-001 — Generation 2 clean build

- Status: Accepted
- Product version: v4.0 Alpha
- Decision: Build the current product as a new modular project without reusing v3 source code.

## DEC-002 — Location Link replaces physical address

- Status: Accepted
- Decision: Reservation data uses `locationLink` for Google Maps or restaurant location URLs. Physical address is not part of the Reservation Item model or current workspace.
- Reason: Operators need a direct navigation target while avoiding duplicate location representations.

## DEC-003 — Reservation Timeline is the core workspace navigation

- Date: 2026-07-13
- Status: Accepted
- Supersedes: The legacy grid-based reservation navigation concept
- Decision: Use Reservation Timeline as the core navigation. Each timeline entry represents one Reservation Item and items are grouped by itinerary day.
- Reason: A timeline matches operator workflow and can extend across future land-operation modules while keeping the current Restaurant Workspace focused.

### Consequences

- Day groups are derived from `dayNumber` and `date` rather than stored as duplicate item containers.
- Items sort chronologically by `time` within each day.
- Only one Reservation Item may be selected at a time.
- Reservation Details and Output Preview use the same selected item.
- Timeline UI implementation is deferred beyond TASK-003.

## DEC-004 — Reservation Item Alpha contract

- Date: 2026-07-13
- Status: Accepted
- Decision: Adopt JSON Schema Draft 2020-12 in `data/reservation-item.schema.json` as the Alpha data contract.
- Default status: `pending`
- Current item type: `restaurant`
- Reserved future item types: `hotel`, `bus`, `attraction`, `guide`, `other`
- Unknown Reservation Item properties are rejected by the schema.

## DEC-005 — Official Reservation Item workflow

- Date: 2026-07-13
- Status: Accepted
- Statuses: `draft`, `pending`, `requested`, `confirmed`, `reconfirm`, `cancelled`, `completed`, `archived`
- Decision: Status meaning, color role, and allowed transitions are defined in `docs/architecture/RESERVATION_TIMELINE_MODEL.md` and must be treated as the official workflow for future implementation.

## DEC-006 — State Management is the Single Source of Truth

- Date: 2026-07-13
- Status: Accepted
- Sprint: Sprint 3
- Decision: `js/state.js` exclusively owns `project`, `reservationItems`, and `selectedItemId`.
- Derived value: `selectedItem` is resolved from `selectedItemId` and `reservationItems`; it is not stored.
- Coordination: Reservation Timeline, Reservation Details, and Output Preview subscribe independently to state notifications.
- Mutation boundary: Selection, item addition, and item updates must use the State API.
- Reason: Prevent duplicated selection/data state and eliminate manual synchronization chains between components.

### Consequences

- `app.js` is responsible only for startup, initial data loading, validation, state initialization, and module initialization.
- Timeline must not call Reservation Details or Output Preview directly.
- State getters return cloned snapshots to prevent external mutation.
- Duplicate IDs and malformed initial items are ignored with focused warnings.
- Local Storage, backend persistence, and two-way form binding are not introduced by this decision.
