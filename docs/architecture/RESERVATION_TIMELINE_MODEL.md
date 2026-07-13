# Reservation Timeline Model

## Purpose

The Reservation Timeline is the core navigation and operation structure of JLOS. Each timeline entry represents exactly one Reservation Item, and the selected item supplies the context for Reservation Details and Output Preview.

This specification defines the v4.0 Alpha data model only. It does not implement UI behavior, persistence, exports, APIs, or backend services.

## Architecture Position

```text
Workspace
└── Reservation Timeline
    └── Selected Reservation Item
        ├── Reservation Details
        └── Output Preview
```

The Timeline owns navigation context. The Reservation Item owns reservation data. Details and Preview are consumers of the currently selected item; they do not maintain independent copies of that item.

## Timeline Container

Timeline data is stored as a flat `items` array. Day groups are derived from `dayNumber` and `date` at presentation time.

```json
{
  "schemaVersion": "1.0.0-alpha",
  "timelineId": "timeline-jpn-2607-018",
  "tourCode": "JPN-2607-018",
  "items": []
}
```

This avoids duplicated group metadata and allows an item to move to a different itinerary day by changing its own `dayNumber` and `date`.

## Reservation Item Contract

The canonical machine-readable contract is `data/reservation-item.schema.json`.

| Field | Type | Purpose |
| --- | --- | --- |
| `id` | UUID string | Stable identity |
| `dayNumber` | Integer | One-based itinerary grouping key |
| `date` | ISO date string | Reservation calendar date |
| `itemType` | Enum | Module discriminator; `restaurant` in Alpha |
| `meal` | Enum | `breakfast`, `lunch`, `dinner`, or `other` |
| `time` | HH:mm string | Local service time and within-day sort key |
| `title` | String | Compact timeline label |
| `status` | Enum | Official workflow state |
| `restaurantName` | String | Restaurant identity |
| `phone` | String or null | Restaurant telephone contact |
| `contact` | String or null | Restaurant contact person or team |
| `locationLink` | URI string or null | Google Maps or restaurant location link |
| `adults` | Integer | Adult guest count |
| `children` | Integer | Child guest count |
| `guides` | Integer | Guide count |
| `menu` | Object | Course name, price, currency, and menu items |
| `notes` | String | Operator and service notes |
| `image` | URI string or null | Primary reference image |
| `createdAt` | ISO date-time string | Creation audit timestamp |
| `updatedAt` | ISO date-time string | Last-update audit timestamp |

Physical address data is intentionally excluded. `locationLink` is the only location field.

## Required and Empty Values

Every listed Reservation Item property is present in the Alpha contract so consumers receive a predictable shape. Unknown properties are rejected. An unavailable optional value uses `null`; an intentionally empty list uses `[]`; and no operator notes use an empty string. The UI must render a neutral placeholder for null or empty values and must not invent content.

## Item Type Strategy

`itemType` is the extension point for future modules. The Alpha schema permits only:

- `restaurant`

Reserved future values are:

- `hotel`
- `bus`
- `attraction`
- `guide`
- `other`

These future values are documentation only. Before a future module is implemented, its domain fields and schema rules must be approved and versioned. The Restaurant Workspace UI must not render future item types during v4.0 Alpha.

## Grouping and Ordering

1. Group items by ascending `dayNumber`.
2. Use `date` as a consistency check and display value, not as a duplicate grouping object.
3. Sort items inside a day by ascending 24-hour `time`.
4. If times are equal, use `createdAt` ascending, then `id` ascending for deterministic ordering.
5. A new or updated item is placed in its derived group and order without duplicating it.

## Selection Contract

Selection is transient workspace state and is not stored inside Reservation Item data. The workspace holds one `selectedItemId`. At most one ID may be active. Reservation Details and Output Preview will resolve their content from that ID and the canonical `items` collection in a future task.

## Official Status Workflow

New Reservation Items default to `pending`.

| Status | Meaning | Operator changes to this status when | Color role |
| --- | --- | --- | --- |
| `draft` | Intentionally incomplete planning record | The item is being outlined but is not ready for action | Neutral soft gray |
| `pending` | Ready for operator preparation or next action | A new item is created or more internal work is required | Amber |
| `requested` | Request sent to the supplier; response outstanding | The restaurant has received the reservation request | Blue |
| `confirmed` | Supplier has confirmed the reservation | Confirmation details have been received and checked | Green |
| `reconfirm` | Confirmed item requires a scheduled final check | Guest count, timing, menu, or service needs reconfirmation | Amber outlined |
| `cancelled` | Reservation will not proceed | Cancellation is agreed or the itinerary changes | Red |
| `completed` | Service has taken place and operational work is finished | Post-service completion is verified | Dark navy |
| `archived` | Closed historical record hidden from active work | No further active operation is expected | Muted gray |

### Allowed Transitions

| From | Allowed next statuses |
| --- | --- |
| `draft` | `pending`, `archived` |
| `pending` | `draft`, `requested`, `cancelled`, `archived` |
| `requested` | `pending`, `confirmed`, `cancelled` |
| `confirmed` | `reconfirm`, `cancelled`, `completed` |
| `reconfirm` | `confirmed`, `cancelled`, `completed` |
| `cancelled` | `pending`, `archived` |
| `completed` | `archived` |
| `archived` | None; restoration requires a future explicit policy |

Transitions describe approved workflow behavior for future implementation. TASK-003 does not implement transition enforcement.

## Schema Versioning

Breaking field or enum changes require a new schema version and a recorded architecture decision. Additive changes must still update the schema, model specification, sample data, and changelog together.
