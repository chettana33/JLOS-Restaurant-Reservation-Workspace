# JLOS Portable Context

## How to address the user
Always call the user **พี่เจ**.

## Product goal
Build a practical Japan Land Operator workspace that can help sell and deliver real work, beginning with Restaurant Reservation management.

## Frozen terminology
- Reservation Timeline
- Reservation Details
- Output Preview

Do not use:
- Reservation Table
- Reservation Editor
- Inspector
- Live Document

## Frozen architecture
Reservation Timeline → Reservation Details → Output Preview

`js/state.js` is the Single Source of Truth.

Rules:
- `reservationItems` and `selectedItemId` live only in central state.
- `selectedItem` is derived, not duplicated.
- Timeline must not directly call Details or Preview.
- Modules subscribe to state changes.
- Approved location field is `locationLink`.
- Do not restore an `address` field.

## Approved status workflow
- draft
- pending
- requested
- confirmed
- reconfirm
- cancelled
- completed
- archived

New Reservation default status: `pending`.

## UX principles
- Clean, compact, professional
- Desktop first, responsive
- No horizontal scrolling
- A4 landscape Output Preview
- Customer-friendly placeholders
- No fake data in newly created items
- Clear disabled states for unavailable controls

## Development principle
Do not redesign architecture, add frameworks, add modules, or change roadmap unless พี่เจ explicitly approves.
