# PROJECT_LOG

Daily engineering journal.

## 2026-07-12 — เริ่มต้นการทำงานร่วมกัน

- ผู้ใช้ต้องการให้สื่อสารเป็นภาษาไทย
- ชื่อที่ผู้ใช้ตั้งให้ผู้ช่วย: **พาเที่ยว**
- ผู้ช่วยต้องเรียกผู้ใช้ว่า: **พี่เจ**
- อ่านเอกสารเริ่มต้นตามลำดับที่ `START_CHAT.md` กำหนดแล้ว
- ผลิตภัณฑ์ปัจจุบัน: **Restaurant Reservation Workspace**
- เวอร์ชัน: **v4.0 Alpha**
- หลักการโครงการ: **Operator First**, วางสถาปัตยกรรมก่อนเขียนโค้ด และต้องจัดทำเอกสาร
- สถาปัตยกรรมปัจจุบัน: Workspace → Reservation Item → Editor → Preview → Export → AI Package
- แนวทาง UX: หนึ่งหน้าจอต่อหนึ่งงาน และ Preview เฉพาะรายการปัจจุบัน
- Roadmap: Restaurant → Hotel → Bus → Attraction → Quotation
- ข้อจำกัด: ห้ามออกแบบหรือเปลี่ยนสถาปัตยกรรมโดยไม่ได้รับอนุมัติจากพี่เจ
- สถานะล่าสุด: ยังไม่มีคำสั่งให้เริ่มพัฒนาหรือแก้ไขโค้ด รอพี่เจกลับมาระบุงานถัดไป

## 2026-07-13 — Sprint 1: v4.0 Alpha project skeleton

- เริ่มต้นโครงการ Generation 2 ใหม่โดยไม่ใช้ซอร์สโค้ด v3
- สร้างโครงสร้าง `src/`, `css/`, `js/`, `assets/` และใช้ `Project_Management/` เดิม
- สร้าง `index.html` พร้อมโครง Workspace สำหรับ Reservation Items, Editor และ Current Item Preview
- แยกไฟล์ CSS เป็น Layout, Theme และ Components ตามมาตรฐานโครงการ
- สร้างโมดูล JavaScript สำหรับ App, Table, Editor, Preview และ Storage เป็น Placeholder
- รองรับ Responsive Layout แบบ Desktop First
- ยังไม่เพิ่ม Business Logic หรือการเชื่อมต่อ Backend

## 2026-07-13 — TASK-001 completed

- สถานะ: **Completed**
- จัดทำ Project Skeleton สำหรับ JLOS v4.0 Alpha (Generation 2) เรียบร้อยแล้ว
- เพิ่ม `README.md` พร้อมข้อมูลโครงการ วิธีเริ่มใช้งาน และ Development Workflow
- เพิ่ม `docs/` สำหรับเอกสารทางเทคนิคใหม่ โดยแยกหมวด Architecture, Design, UX, Decisions และ Project Management
- เพิ่ม `components/`, `data/`, `utils/` และ `config/` เพื่อรองรับการขยายระบบในอนาคต
- ยืนยันว่าไม่มีการเพิ่ม Business Logic ใน TASK-001
- รอคำสั่ง TASK-002

## 2026-07-13 — TASK-002 completed

- สร้าง Restaurant Reservation Workspace Layout รุ่น Alpha
- เพิ่ม Header, Toolbar, โครงสาม Panel, Mock Reservation Items, Editor Cards และ A4 Landscape Preview
- ปรับ Preview เป็น Responsive Document Viewer และใช้ `locationLink` แทนข้อมูลที่อยู่
- ไม่มี Business Logic, Storage, PDF, Export หรือ Backend

## 2026-07-13 — TASK-003 completed

- สถานะ: **Completed**
- อนุมัติ Reservation Timeline ให้แทน Reservation Table เป็นโครงสร้าง Navigation หลักของ JLOS
- กำหนด Reservation Item Data Contract ด้วย JSON Schema Draft 2020-12
- กำหนดสถานะทางการ 8 ค่าและ Allowed Transition โดยสถานะเริ่มต้นคือ `pending`
- กำหนดกฎ Group by Day, Sort by Time และ Single Selection
- สร้าง Sample Timeline จำนวน 5 รายการ ครอบคลุม 3 วันและหลายสถานะ
- ใช้ `locationLink` เป็นข้อมูลตำแหน่งเพียงรูปแบบเดียวใน Model
- บันทึกแนวทางรองรับ Future Item Types โดยยังไม่เปิดใช้ใน Restaurant Workspace
- ไม่มีการแก้ UI, CSS Layout, JavaScript, Storage, PDF, Export, API หรือ Backend
- รอคำสั่ง TASK-004

## 2026-07-13 — TASK-004 completed

- สถานะ: **Completed**
- Implement Reservation Timeline Component จาก `data/sample-reservation-timeline.json`
- ตรวจ Sample Data กับ `data/reservation-item.schema.json` ก่อน Render
- Group Reservation Items ตามวันและ Sort ตามเวลา
- Auto-select รายการแรกและรองรับ Single Selection ด้วย `selectedItemId`
- เพิ่ม New Reservation แบบ In-memory โดยมีสถานะเริ่มต้น `pending`
- แสดง Placeholder สำหรับข้อมูลว่างโดยไม่ใช้ข้อมูลปลอม
- เพิ่ม Keyboard Focus, `aria-selected`, Semantic Day Headings และ Responsive Layout
- เปลี่ยนคำใน UI เป็น Reservation Timeline, Reservation Details และ Output Preview
- ไม่เชื่อม Reservation Details หรือ Output Preview และไม่มี Local Storage, PDF, AI Package, Backend หรือ API
- Workspace ไม่มี Git Repository จึงไม่สามารถสร้าง Branch `feature/reservation-timeline` ได้โดยไม่เริ่ม Git History ใหม่
- รอคำสั่ง TASK-005

## 2026-07-13 — TASK-004 Review Fix completed

- แยก Hover, Selected และ Keyboard Focus ให้เห็นความแตกต่างชัดเจน
- ใช้ `selectedItemId` ใน `app.js` เป็น Single Source of Truth
- Sync Selected Item Summary ไปยัง Reservation Details และ Output Preview เฉพาะ 6 ค่าที่อนุมัติ
- New Reservation ใช้วันของ Item ที่เลือก และรองรับกลุ่ม `UNSCHEDULED` เมื่อไม่มีวัน
- เพิ่ม `scrollIntoView({ block: "nearest", behavior: "smooth" })` สำหรับ Selected Item
- Disable ปุ่ม Duplicate, Delete, Save, AI Package, Export PDF และ Settings
- ไม่มี Local Storage, PDF, AI Package, Duplicate หรือ Delete Logic เพิ่มเติม
- รอ Review และ Approval ก่อนเริ่ม TASK-005

## 2026-07-13 — TASK-005 completed

- สถานะ: **Completed**
- เพิ่ม `js/state.js` เป็น Single Source of Truth สำหรับ Project, Reservation Items และ Selected Item ID
- Derive Selected Item จาก Selected Item ID และ Reservation Items โดยไม่เก็บข้อมูลซ้ำ
- เพิ่ม State API สำหรับ Initialize, Read, Select, Add, Update, Subscribe และ Notify
- Refactor `app.js` ให้รับผิดชอบเฉพาะ Startup และ Module Initialization
- ให้ Reservation Timeline, Reservation Details และ Output Preview Subscribe ต่อ Central State โดยตรง
- ย้าย Selection และ New Reservation Actions ให้ผ่าน State API
- เพิ่ม Guards สำหรับ Empty List, Invalid Selection, Malformed Item และ Duplicate ID
- ตรวจสอบว่า Timeline ไม่เรียก Reservation Details หรือ Output Preview โดยตรง
- คง Accessibility, Disabled Toolbar, Responsive Layout และ In-memory New Reservation เดิม
- Workspace ไม่มี Git Repository จึงไม่สามารถสร้าง Branch `feature/state-management` ได้โดยไม่เริ่ม Git History ใหม่
- ไม่มี Local Storage, Save, Duplicate, Delete, PDF, AI Package, Backend หรือ Cloud Sync
- รอ Approval ก่อนเริ่ม TASK-006

## 2026-07-13 — TASK-GITHUB-001 completed

- สถานะ: **Completed**
- เริ่มต้น Git Repository และกำหนด Default Branch เป็น `main`
- เชื่อมต่อ Public GitHub Repository `chettana33/JLOS-Restaurant-Reservation-Workspace`
- เพิ่ม `.gitignore`, `CONTRIBUTING.md` และเอกสาร `GITHUB_WORKFLOW.md`
- ปรับปรุง `README.md` ให้ครอบคลุมภาพรวม สถาปัตยกรรม การพัฒนา การ Build การ Run และ Git Workflow
- สร้าง Branch `develop` และ `feature/task-006` โดยไม่มีการแก้ Application Feature ใน Branch ใหม่
- Commit Workspace ปัจจุบันและ Push Branch ที่กำหนดขึ้น GitHub
- ไม่มีการแก้ UI, CSS, JavaScript หรือ Application Feature

## 2026-07-13 — TASK-006 completed

- สถานะ: **Completed**
- เพิ่ม Reservation Details Form แบบแก้ไขได้ครบตามฟิลด์ที่อนุมัติ
- อ่าน Selected Reservation Item และส่งการแก้ไขผ่าน Central State API เท่านั้น
- Sync การแก้ไขไป Reservation Timeline และ Output Preview ผ่าน State Subscriptions
- เพิ่ม Inline Validation สำหรับ Day, Date, Time, Status, Guest Counts และ Location Link
- เพิ่ม `confirmationNumber` เป็น Optional Data Contract และค่าเริ่มต้นว่างสำหรับ New Reservation
- เพิ่ม Image Placeholder โดยไม่มี Upload หรือ Persistence
- รองรับ Keyboard, Focus State และ Responsive Layout สำหรับ Desktop, Tablet และ Mobile
- ไม่มี Local Storage, Save Persistence, PDF, AI Package, Duplicate, Delete, Backend หรือ Cloud Sync

## 2026-07-13 — TASK-007 completed

- สถานะ: **Completed**
- ปรับ Output Preview เป็น Restaurant Reservation Summary สำหรับลูกค้าแบบ Live
- อ่าน Project และ Selected Reservation Item ผ่าน Central State API เท่านั้น
- Sync การเลือกและการแก้ Reservation Details ผ่าน State Subscription โดยตรง
- แสดงข้อมูลโครงการ การจอง Guest Total ผู้ติดต่อ Location Link เมนู หมายเหตุ และ Image Area
- เพิ่ม Customer-friendly Placeholders โดยไม่แสดง `undefined`, `null`, URL ว่าง หรือ Physical Address
- รักษา A4 Landscape Ratio และให้เนื้อหาพอดีหนึ่งหน้าใน Desktop, Tablet และ Mobile
- เพิ่ม Print CSS ให้พิมพ์เฉพาะ Output Preview Paper
- ไม่มี PDF Generation, Download, Local Storage, Toolbar Actions, Save, Duplicate, Delete, AI Package, Backend หรือ Cloud Sync
