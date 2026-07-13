# Reservation Timeline UX

## Purpose

The Reservation Timeline is the compact, operator-first navigation surface for the Restaurant Reservation Workspace. It will eventually control which Reservation Item appears in Reservation Details and Output Preview.

TASK-003 documents behavior only. It does not implement or modify the timeline UI.

## Core Rules

1. Group Reservation Items by itinerary day.
2. Display day groups in ascending `dayNumber` order.
3. Sort items by `time` within each day.
4. Visually highlight the selected item using a clear indicator that does not rely on color alone.
5. Permit only one selected item at a time.
6. Selecting an item will eventually update both Reservation Details and Output Preview from the same canonical item.
7. Place new and updated items in the correct derived day group and chronological position.
8. Show neutral placeholders for null or empty values; never substitute fake data.
9. Keep the timeline compact and easy to scan.
10. Keep status visible on every item without requiring the item to open.
11. Support desktop, tablet, and mobile layouts.
12. Keep the Output Preview limited to the current selected item.

## Information Hierarchy

Each compact timeline row should prioritize:

1. Time
2. Meal
3. Title or restaurant name
4. Status
5. Day and date context from its group heading

Secondary contact, menu, guest, image, and note details belong in Reservation Details, not in the compact timeline row.

## Day Groups

- Use a visible heading such as `Day 1` with its date.
- Keep all items for a day together.
- Preserve chronological order even when status changes.
- Do not create empty day groups unless the itinerary explicitly needs an empty-state message.
- When a day has no items, use a neutral empty state rather than sample rows.

## Selection

- Exactly zero or one item may be selected; multiple selection is not permitted.
- A selected state must combine at least two cues, such as accent border plus background or marker plus weight.
- Selection must remain identifiable for keyboard and touch users in future implementation.
- If the selected item is removed or filtered out, future logic must choose a documented fallback or clear selection; no fallback is implemented in TASK-003.

## Status Presentation

- Show one official status badge per Reservation Item.
- Use the semantic color roles defined in the model specification.
- Always display the text label; color alone must not communicate status.
- Use lowercase values in data and human-readable title case in the UI.
- The operator changes status only after the corresponding real-world action or supplier response occurs.
- Disallowed transitions should be unavailable or explained in future interaction design.

## Empty and Incomplete Data

- Use `—` for short missing values where context is already clear.
- Use descriptive placeholders such as `Contact not supplied` when ambiguity would affect operator action.
- Do not display fabricated restaurant, contact, menu, phone, image, or location data.
- If `locationLink` is null, do not render an active `Open Location` action.
- Empty menu items must show a neutral menu-pending state.

## Responsive Behavior

### Desktop

- Show the Timeline beside Reservation Details and Output Preview.
- Keep day headings and item statuses visible during normal scanning.
- Use compact row density without reducing legibility.

### Tablet

- Permit the Timeline to occupy a full row or dedicated column based on available width.
- Preserve day grouping and single selection.
- Do not hide status to save space.

### Mobile

- Stack workspace regions vertically.
- Keep timeline rows touch-friendly and avoid horizontal scrolling.
- Preserve the same day, time, title, and status hierarchy.

## Accessibility Requirements for Future UI

- Use semantic headings for day groups and a semantic list for Reservation Items.
- Expose selected state programmatically, such as `aria-current` or `aria-selected` when appropriate to the final interaction pattern.
- Maintain visible focus styles.
- Provide status text in addition to color.
- Ensure compact content can reflow without truncating critical time or status information.

## Out of Scope

- Timeline UI implementation
- Click, keyboard, drag, or reorder event handling
- Storage or persistence
- PDF and export behavior
- AI Package behavior
- Backend or API integration
