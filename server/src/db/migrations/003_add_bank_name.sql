-- Add bank_name to scholarship_requests, alongside the existing bank_account_no.
-- Backfilled via a temporary default so the NOT NULL constraint applies cleanly to existing
-- rows; the default is then dropped so the application must always supply a real value.
-- Idempotent: safe to run multiple times.

ALTER TABLE scholarship_requests ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100) NOT NULL DEFAULT 'ไม่ระบุ';
ALTER TABLE scholarship_requests ALTER COLUMN bank_name DROP DEFAULT;
