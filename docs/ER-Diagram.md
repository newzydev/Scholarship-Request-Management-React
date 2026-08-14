# ER Diagram

```mermaid
erDiagram
    STAFF ||--o{ SCHOLARSHIP_REQUESTS : "เพิ่มคำขอแทนนักศึกษา (optional)"
    SCHOLARSHIP_TYPES ||--o{ SCHOLARSHIP_REQUESTS : "ประเภททุน"
    BANKS ||--o{ SCHOLARSHIP_REQUESTS : "ธนาคาร"

    STAFF {
        serial id PK
        varchar first_name
        varchar last_name
        varchar username UK
        varchar password_hash "bcrypt"
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at "soft delete"
    }

    SCHOLARSHIP_TYPES {
        serial id PK
        varchar code UK
        varchar name_th
    }

    BANKS {
        serial id PK
        varchar code UK
        varchar name_th
    }

    SCHOLARSHIP_REQUESTS {
        serial id PK
        varchar request_no UK "SRQ-YYYY-000001"
        varchar student_id
        varchar first_name
        varchar last_name
        varchar faculty
        smallint year_level
        numeric gpax
        varchar email
        int scholarship_type_id FK
        numeric amount_requested "> 0"
        int bank_id FK
        varchar bank_account_no "masked in list view"
        text reason
        boolean pdpa_consent
        request_status status "pending | approved | rejected"
        text status_note
        timestamptz submitted_at
        int created_by FK "NULL = ยื่นเองโดยนักศึกษา"
        timestamptz updated_at
        timestamptz deleted_at "soft delete"
    }
```

## หมายเหตุ

- `deleted_at IS NOT NULL` (ทั้งใน `scholarship_requests` และ `staff`) หมายถึงรายการถูกลบแบบ
  Soft Delete และจะถูกกรองออกจากทุก query ของรายการปกติ (`WHERE deleted_at IS NULL`)
- `status` เป็น PostgreSQL ENUM (`request_status`) จำกัดค่าได้เฉพาะ `pending`, `approved`, `rejected`
- Index ที่สร้างไว้: `scholarship_requests(status)`, `scholarship_requests(scholarship_type_id)`,
  `scholarship_requests(bank_id)`, `scholarship_requests(student_id)`,
  `scholarship_requests(deleted_at)`, `staff(deleted_at)` เพื่อรองรับการค้นหา/กรอง/แบ่งหน้า
  อย่างมีประสิทธิภาพ
- `banks` และ `scholarship_types` เป็นตาราง lookup ที่ seed ไว้ล่วงหน้า (20 ธนาคาร และ 5 ประเภททุน
  ตามลำดับ) ไม่มีหน้าจัดการ CRUD ให้เจ้าหน้าที่แก้ไขเอง
- ที่มา schema: [`server/src/db/migrations/`](../server/src/db/migrations) — ไฟล์ SQL เรียงลำดับ
  ตามเลข รันแบบ idempotent ได้ทั้งหมด (`001_init.sql` สร้างโครงสร้างเริ่มต้น, ไฟล์ถัดไปเป็นการ
  ปรับปรุงภายหลัง เช่น soft delete ของ `staff` และตาราง `banks`)
