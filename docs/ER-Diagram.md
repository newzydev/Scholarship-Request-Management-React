# ER Diagram

```mermaid
erDiagram
    STAFF ||--o{ SCHOLARSHIP_REQUESTS : "เพิ่มคำขอแทนนักศึกษา (optional)"
    SCHOLARSHIP_TYPES ||--o{ SCHOLARSHIP_REQUESTS : "ประเภททุน"

    STAFF {
        serial id PK
        varchar first_name
        varchar last_name
        varchar username UK
        varchar password_hash "bcrypt"
        timestamptz created_at
        timestamptz updated_at
    }

    SCHOLARSHIP_TYPES {
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

- `scholarship_requests.deleted_at IS NOT NULL` หมายถึงรายการถูกลบแบบ Soft Delete
  และจะถูกกรองออกจากทุก query ของรายการปกติ (`WHERE deleted_at IS NULL`)
- `status` เป็น PostgreSQL ENUM (`request_status`) จำกัดค่าได้เฉพาะ `pending`, `approved`, `rejected`
- Index ที่สร้างไว้: `status`, `scholarship_type_id`, `student_id`, `deleted_at`
  เพื่อรองรับการค้นหา/กรอง/แบ่งหน้าอย่างมีประสิทธิภาพ
- ที่มา schema แบบเต็ม: [`server/src/db/migrations/001_init.sql`](../server/src/db/migrations/001_init.sql)
