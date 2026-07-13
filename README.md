# JLOS Restaurant Reservation Workspace

Japan Land Operator Suite (JLOS) — Restaurant Reservation Workspace is a desktop-first workspace for organizing restaurant reservations across a Japan land-operation itinerary. This repository contains the v4.0 Alpha, Generation 2 codebase.

## Project Overview

- **Version:** v4.0 Alpha
- **Architecture:** Generation 2
- **Current sprint:** Infrastructure
- **Stack:** Semantic HTML, CSS, and vanilla JavaScript
- **Runtime:** Static browser application with no backend

The workspace currently provides a Reservation Timeline, Reservation Details, and Output Preview backed by a centralized in-memory application state. Deferred capabilities are tracked in the project roadmap.

## Architecture

JLOS uses modular, framework-free frontend architecture:

- `index.html` defines the semantic application shell.
- `css/` separates layout, theme tokens, and reusable component styles.
- `js/` contains startup, state, Timeline, Details, Preview, and storage modules.
- `data/` contains sample data and JSON schemas.
- `components/` is reserved for reusable UI components and must not contain business logic.
- `utils/` is reserved for helpers, formatters, validators, and shared functions.
- `config/` is reserved for theme, version, constants, and future configuration.
- `Project_Management/` remains the project source of truth.
- `docs/` contains future technical documentation grouped by discipline.

## Folder Structure

```text
JLOS-Restaurant-Reservation-Workspace/
├── assets/                 Static assets
├── components/             Reusable UI components
├── config/                 Future configuration
├── css/                    Layout, theme, and component styles
├── data/                   Sample data and JSON schemas
├── docs/                   Technical documentation
├── js/                     Application modules
├── Module_Specifications/  Module specifications
├── Project_Management/     Source-of-truth project documents
├── Prompts/                Project prompts
├── Sample_Data/            Reference sample data
├── src/                    Future source structure
├── Templates/              Project templates
├── UI_Kit/                 UI reference material
├── utils/                  Shared utilities
└── index.html              Application entry point
```

## Development

1. Read the source-of-truth documents in `Project_Management/` before starting work.
2. Create or switch to the task branch described in the active task.
3. Keep changes within the approved task scope and preserve the modular architecture.
4. Test the affected desktop, tablet, and mobile layouts.
5. Update the project log and changelog when the task is complete.
6. Open a Pull Request for review before merging.

No package manager is required for the current static Alpha. If package files are added later, commit the lockfile with dependency changes.

## Build

There is currently no compile or bundle step. The source files in the repository are browser-ready. Future build instructions will be added here when a build tool is introduced.

## Run

Serve the repository root with a static HTTP server, then open the URL it reports. For example:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173/` in a modern browser. Opening `index.html` directly may prevent browser loading of local JSON data, so an HTTP server is recommended.

## Git Workflow

- `main` is the protected, review-ready source of truth.
- `develop` is the integration branch for approved development work.
- Feature branches use `feature/<task-or-description>` and branch from `develop`.
- Commits follow the Conventional Commits style, such as `feat:`, `fix:`, `docs:`, `chore:`, and `test:`.
- Changes flow through a Pull Request, review, and merge; do not commit task work directly to `main`.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [Project_Management/GITHUB_WORKFLOW.md](Project_Management/GITHUB_WORKFLOW.md) for the complete contribution workflow.
