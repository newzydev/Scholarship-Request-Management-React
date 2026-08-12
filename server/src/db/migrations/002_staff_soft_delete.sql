-- Add soft-delete support to staff, consistent with scholarship_requests.
-- Idempotent: safe to run multiple times.

ALTER TABLE staff ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_staff_deleted_at ON staff(deleted_at);
