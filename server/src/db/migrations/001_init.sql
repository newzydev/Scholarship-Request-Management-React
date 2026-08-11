-- Scholarship Request Management - initial schema
-- Idempotent: safe to run multiple times

-- --- ENUM: request_status ---
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
        CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END$$;

-- --- Helper: auto-update updated_at ---
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --- TABLE: staff ---
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_staff_updated_at ON staff;
CREATE TRIGGER trg_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- --- TABLE: scholarship_types (lookup) ---
CREATE TABLE IF NOT EXISTS scholarship_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_th VARCHAR(150) NOT NULL
);

-- --- TABLE: scholarship_requests ---
CREATE TABLE IF NOT EXISTS scholarship_requests (
    id SERIAL PRIMARY KEY,
    request_no VARCHAR(30) UNIQUE NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    faculty VARCHAR(150) NOT NULL,
    year_level SMALLINT NOT NULL CHECK (year_level BETWEEN 1 AND 8),
    gpax NUMERIC(3,2) NOT NULL CHECK (gpax >= 0 AND gpax <= 4),
    email VARCHAR(150) NOT NULL,
    scholarship_type_id INT NOT NULL REFERENCES scholarship_types(id),
    amount_requested NUMERIC(12,2) NOT NULL CHECK (amount_requested > 0),
    bank_account_no VARCHAR(30) NOT NULL,
    reason TEXT NOT NULL,
    pdpa_consent BOOLEAN NOT NULL DEFAULT false,
    status request_status NOT NULL DEFAULT 'pending',
    status_note TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by INT REFERENCES staff(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

DROP TRIGGER IF EXISTS trg_requests_updated_at ON scholarship_requests;
CREATE TRIGGER trg_requests_updated_at
    BEFORE UPDATE ON scholarship_requests
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_requests_status ON scholarship_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_type ON scholarship_requests(scholarship_type_id);
CREATE INDEX IF NOT EXISTS idx_requests_student_id ON scholarship_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_requests_deleted_at ON scholarship_requests(deleted_at);

-- Sequence used to generate human-friendly request_no (SRQ-YYYY-000001)
CREATE SEQUENCE IF NOT EXISTS scholarship_request_no_seq;
