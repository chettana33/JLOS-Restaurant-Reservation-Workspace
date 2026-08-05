# CURRENT_STATE — JLOS Restaurant Reservation Workspace

อัปเดตล่าสุด: 2026-08-05 (Asia/Bangkok)

## Branch & PR Status

- `main`: protected, review-ready
- `develop`: integration baseline = `a615b3b` (TASK-001 ถึง TASK-012 ทั้งหมด merge แล้ว)
- PR #6 (feature/task-010): merged เข้า develop
- PR #7 (docs/handoff-checkpoint): merged เข้า develop
- PR #8 (feature/task-011): merged เข้า develop
- PR #9 (feature/task-012): merged เข้า develop

## Completed (ใน develop)

- TASK-001 Project Skeleton
- TASK-002 Workspace Layout
- TASK-003 Reservation Timeline Architecture
- TASK-004 Reservation Timeline Component
- TASK-005 Single Source of Truth State Management
- TASK-006 Editable Reservation Details
- TASK-007 Live Output Preview
- TASK-008 Save and Load Project
- TASK-009 Export PDF (PR #4 merged)
- TASK-010 Duplicate + Delete Reservation (PR #6 merged)
- TASK-011 AI Package Export (PR #8 merged)
- TASK-012 Workspace Settings (PR #9 merged)

## Pending Merge (feature branch, รอ review)

- (none)

## Next Tasks (ตาม ROADMAP)

Sprint 6 (Restaurant module) เสร็จสมบูรณ์ 100% — ROADMAP ต่อไปคือ Hotel → Bus → Attraction → Quotation (รออนุมัติ spec ก่อนเริ่ม)

## Architecture Snapshot

- Static browser app, Semantic HTML + CSS + vanilla JS, ไม่มี backend
- Single Source of Truth: `js/state.js` (central in-memory state, mutation API)
- Modules: `app.js` (startup), `timeline.js`, `editor.js`, `preview.js`, `pdf-export.js`, `ai-package.js`, `storage.js`, `settings.js`, `state.js`
- `settings` ใน Central State: `newReservation` defaults, `projectDefaults`, `exportFilenamePrefix` (DEC-009)
- หลักฐานเอกสาร: `Project_Management/ARCHITECTURE.md`, `DECISIONS.md` (ถึง DEC-009), `MASTER_INDEX.md`, `SPRINT_DASHBOARD.md`

## Guardrails

- ห้ามใช้ numbering จาก Dashboard เก่าเป็นหลัก — ยึด Git history + `Prompts/` เป็นจริง
- ห้ามปะปน module อื่น (KIMONO / Ichinotour / SENEI KOTSU)
- ไม่ redesign architecture โดยไม่ได้รับอนุมัติ
- ทุกงานต้องมี spec ใน `Prompts/Sprint_XX/`, test evidence, docs update, PR review

## Known Items

- `artifacts/` ใน working copy เป็นหลักฐานการทดสอบ (screenshot/PDF) ไม่ควร commit
- PR #5 (docs reconcile task-009) ถูกปิดเป็น superseded ตามคำสั่งพี่เจ
- feature branches ของ PR ที่ merge แล้วถูกลบอัตโนมัติ (gitHub auto-delete)
