# GitHub Workflow

GitHub is the single source of truth for JLOS source code and reviewed development history.

## Workflow

```text
ChatGPT
   ↓
Task Design
   ↓
Codex
   ↓
Commit
   ↓
Push
   ↓
Pull Request
   ↓
Review
   ↓
Merge
```

1. **ChatGPT** helps define product intent and acceptance criteria.
2. **Task Design** records the bounded task, dependencies, exclusions, and Definition of Done.
3. **Codex** implements only the approved task scope on its assigned branch.
4. **Commit** captures a coherent, verified change using the repository commit convention.
5. **Push** publishes the task branch to GitHub.
6. **Pull Request** explains the scope, tests, architecture impact, and known issues.
7. **Review** validates implementation quality and task compliance.
8. **Merge** integrates approved work according to the merge policy.

## Branch Model

- `main`: stable, review-approved source of truth.
- `develop`: integration branch for ongoing approved work.
- `feature/<task>`: feature implementation branched from `develop`.
- `fix/<description>`: focused correction branched from the appropriate integration branch.
- `docs/<description>` and `chore/<description>`: documentation and infrastructure work.

## GitHub Labels

Use labels consistently to support planning and review:

- Priority: `priority: critical`, `priority: high`, `priority: medium`, `priority: low`
- Type: `type: feature`, `type: bug`, `type: documentation`, `type: infrastructure`
- Status: `status: needs review`, `status: changes requested`, `status: blocked`
- Area: `area: timeline`, `area: details`, `area: preview`, `area: architecture`
- Sprint labels use the format `sprint: <name-or-number>`.

Labels document coordination state only; the task specification and repository history remain authoritative.

## Pull Request Requirements

- Link the approved task or issue.
- State files changed and architecture impact.
- Include testing evidence and known issues.
- Keep unrelated changes out of the Pull Request.
- Obtain approval and pass required checks before merge.
