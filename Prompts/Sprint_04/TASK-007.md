# TASK-007 — Implement Live Output Preview

## Repository and Branch

- Repository: `chettana33/JLOS-Restaurant-Reservation-Workspace`
- Base branch: `develop`
- Feature branch: `feature/task-007`
- Depends on: TASK-006 merged into `develop`

## Objective

Upgrade Output Preview into a real-time customer-facing Restaurant Reservation Summary. The preview reads Project data and the selected Reservation Item through the central State API and updates through the existing state subscription whenever selection or Reservation Details changes.

This task does not implement PDF generation, downloads, Local Storage, Toolbar Actions, Save persistence, Duplicate, Delete, AI Package, backend, cloud sync, or multi-reservation output.

## Document Format

- Preserve the A4 landscape ratio `297 / 210`.
- Keep the paper centered and use most of the available Preview panel.
- Scale proportionally without stretching, cropping, or horizontal scrolling.
- Keep the existing three-panel workspace architecture.
- Fit all document content within one A4 landscape page.

## Information Displayed

### Document Header

- JLOS company branding placeholder
- Restaurant Reservation Summary title
- Tour Code
- Customer
- Guide
- Travel Date

### Selected Reservation

- Day number
- Date
- Meal
- Time
- Restaurant name
- Status
- Confirmation number

### Guest Details

- Adults
- Children
- Guides
- Calculated total guests

### Restaurant Contact

- Contact person
- Phone
- Open Location action for valid HTTP/HTTPS `locationLink` values

### Menu, Notes, and Image

- Menu name and available menu summary
- Notes
- Selected item image when a valid image URL is available
- Accessible placeholder when the image is empty or cannot load

## State and Safety Rules

- Subscribe to central state.
- Read the selected item through `getSelectedItem()` and project data through `getProject()`.
- Do not receive values directly from `editor.js`.
- Do not store a private selected-item copy.
- Do not display `undefined`, `null`, empty URLs, technical field names, or physical address data.
- Use customer-friendly placeholders for missing values.
- Render Location Link only for HTTP/HTTPS URLs with `target="_blank"` and `rel="noopener noreferrer"`.
- Support all eight approved status values and pair status color with text.

## Responsive and Print Preparation

- Desktop: paper uses most of the right panel and remains readable.
- Tablet: paper scales proportionally without horizontal scrolling.
- Mobile: paper uses available width, preserves landscape ratio, and allows vertical page scrolling.
- Add `@page { size: A4 landscape; margin: 0; }`.
- Print mode hides Header, Toolbar, Reservation Timeline, Reservation Details, and the Output Preview panel header.
- Print mode displays only the 297mm × 210mm preview paper.
- Do not implement Export PDF behavior.

## Required Testing

Verify initial rendering, selection changes, live Reservation Details synchronization, guest total, contact data, valid and invalid Location Links, customer-safe placeholders, all status styles, A4 ratio, desktop/tablet/mobile layouts, print-only CSS, no address display, and no console errors.

## Git Delivery

- Commit: `feat: implement live output preview`
- Push: `origin/feature/task-007`
- Do not merge.
- Pull Request creation is handled separately.
