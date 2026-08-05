# START HERE — JLOS Restaurant Reservation Workspace

เอกสารนี้เป็นจุดเริ่มต้นสำหรับ AI, Codex และผู้รับช่วงงาน JLOS ทุกตัว อ่านตามลำดับ เพื่อให้ทุกตัวเข้าใจบริบทเดียวกัน

## Scope Boundary

- Repository นี้ใช้เฉพาะ JLOS Restaurant Reservation Workspace
- ห้ามปะปนกับ KIMONO Land Operation, Ichinotour Quotation หรือ SENEI KOTSU
- Pha Tiao Core: `chettana33/phathiao-work-system`

## Read Order (สำคัญ: ทุก AI ต้องอ่านให้ครบ)

1. Pha Tiao Core `START_HERE.md`
2. Project `START_HERE.md` (ไฟล์นี้)
3. `Project_Management/PROJECT_RULES.md`
4. `Project_Management/MASTER_INDEX.md`
5. `CURRENT_STATE.md`
6. `checkpoints/CHECKPOINT_LATEST.md`
7. Active task specification (`Prompts/Sprint_XX/TASK-XXX.md`), architecture, tests และ source files ที่เกี่ยวข้อง

## Current Handoff

- วันที่: 2026-08-05 (Asia/Bangkok)
- Current branch: `feature/task-010` (PR #6 open, รอ review) และ `docs/handoff-checkpoint` (PR #7 open)
- Base integration branch: `develop`
- Completed tasks: TASK-001 ถึง TASK-010
- งานล่าสุด: TASK-010 Duplicate + Delete Reservation (PR #6)
- งานถัดไป: TASK-011 AI Package Export, TASK-012 Settings
- PR ที่เปิดค้าง: #6 (feature/task-010) — รอ merge

## Start Rule

ก่อนแก้โค้ดหรือเอกสาร:

1. Confirm current branch และ clean working tree (`git status`).
2. Read `CURRENT_STATE.md` และ `checkpoints/CHECKPOINT_LATEST.md`.
3. Confirm Scope และ Acceptance Criteria กับ พี่เจ.
4. ห้ามแก้ approved/merged baseline โดยตรง — ใช้ task branch เสมอ.
5. จบงานทุกงานด้วยการอัปเดตเอกสาร และ GitHub checkpoint.
