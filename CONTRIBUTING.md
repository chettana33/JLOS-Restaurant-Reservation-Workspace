# Contributing to JLOS

Thank you for contributing to the JLOS Restaurant Reservation Workspace. Read the project rules and active task specification before changing the codebase.

## Branch Naming

Create task branches from `develop` and use lowercase kebab-case:

- `feature/task-006`
- `fix/timeline-selection`
- `docs/github-workflow`
- `chore/dependency-update`

Do not develop directly on `main`. Keep each branch focused on one approved task.

## Commit Convention

Use Conventional Commits with a concise imperative summary:

- `feat: add reservation details form`
- `fix: preserve timeline selection`
- `docs: update architecture guide`
- `chore: configure repository workflow`
- `test: cover reservation state guards`

Commit generated lockfiles when dependency definitions change. Do not commit secrets, `.env` files, build output, coverage output, or local editor settings.

## Review Process

1. Confirm the active task's Definition of Done.
2. Run relevant tests and responsive checks.
3. Update project documentation required by the task.
4. Push the task branch and open a Pull Request into `develop`.
5. Describe the scope, verification, known issues, and architecture impact.
6. Address review feedback in the same branch and request re-review.

## Merge Policy

- At least one approval is required before merge.
- Required checks must pass and review conversations must be resolved.
- The branch must be current with its target branch and free of unintended files.
- Prefer squash merge for a focused task history unless the reviewer approves another method.
- Merge `develop` into `main` only for an approved release or milestone.
- Delete merged feature branches when they are no longer needed.
