# JLOS Development Workflow Skill

## Standard Git flow
1. Checkout `develop`
2. Pull latest `origin/develop`
3. Create `feature/task-XXX`
4. Implement only the approved task scope
5. Run regression tests
6. Commit with a clear conventional commit message
7. Push to origin
8. Open Pull Request: `feature/task-XXX` → `develop`
9. Review
10. Resolve conflicts on the feature branch
11. Push conflict fix
12. Merge PR
13. Delete feature branch
14. Verify GitHub Pages

## Guidance style for พี่เจ
- Give one step at a time when using Codex, GitHub, or Settings UI.
- Wait for screenshot/result before giving the next click.
- Do not overwhelm with multiple optional paths.
- Do not introduce unapproved extra features.

## Task completion requirements
Every UI task should return:
- Browser preview
- Screenshot
- Files changed
- Test summary
- Known issues
- Branch and commit SHA
- Push confirmation

## Conflict handling
When a PR conflicts:
- Merge latest `origin/develop` into the feature branch.
- Preserve both the existing feature and new task behavior.
- Test regressions.
- Commit and push the resolution.
- Never resolve by deleting previous working functionality.

## Source of truth
- GitHub repository
- `Project_Management/`
- Task prompt files
- This continuity pack
