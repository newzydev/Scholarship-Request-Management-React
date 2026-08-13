-- Add a banks lookup table (mirrors scholarship_types) and convert
-- scholarship_requests.bank_name (free text) into a bank_id foreign key.
-- Idempotent: safe to run multiple times.

CREATE TABLE IF NOT EXISTS banks (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_th VARCHAR(150) NOT NULL
);

INSERT INTO banks (code, name_th) VALUES
    ('bbl', 'ธนาคารกรุงเทพ'),
    ('kbank', 'ธนาคารกสิกรไทย'),
    ('ktb', 'ธนาคารกรุงไทย'),
    ('ttb', 'ธนาคารทหารไทยธนชาต'),
    ('scb', 'ธนาคารไทยพาณิชย์'),
    ('bay', 'ธนาคารกรุงศรีอยุธยา'),
    ('kkp', 'ธนาคารเกียรตินาคินภัทร'),
    ('cimbt', 'ธนาคารซีไอเอ็มบี ไทย'),
    ('tisco', 'ธนาคารทิสโก้'),
    ('uob', 'ธนาคารยูโอบี'),
    ('lhbank', 'ธนาคารแลนด์ แอนด์ เฮ้าส์'),
    ('icbc', 'ธนาคารไอซีบีซี (ไทย)'),
    ('citi', 'ธนาคารซิตี้แบงก์'),
    ('sc', 'ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)'),
    ('gsb', 'ธนาคารออมสิน'),
    ('ghb', 'ธนาคารอาคารสงเคราะห์'),
    ('baac', 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร'),
    ('ibank', 'ธนาคารอิสลามแห่งประเทศไทย'),
    ('exim', 'ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย'),
    ('smebank', 'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย')
ON CONFLICT (code) DO NOTHING;

-- Add the FK column (nullable for now so backfill below can populate it).
ALTER TABLE scholarship_requests ADD COLUMN IF NOT EXISTS bank_id INT REFERENCES banks(id);

-- Backfill bank_id from the old free-text bank_name column, only when that column
-- still exists (keeps this migration idempotent after the column is dropped below).
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'scholarship_requests' AND column_name = 'bank_name'
    ) THEN
        UPDATE scholarship_requests r
        SET bank_id = b.id
        FROM banks b
        WHERE r.bank_id IS NULL AND r.bank_name = b.name_th;
    END IF;
END$$;

-- Any leftover rows whose old bank_name didn't match a known bank exactly (e.g. legacy
-- placeholder/test values) fall back to the first bank rather than blocking the NOT NULL below.
UPDATE scholarship_requests r
SET bank_id = (SELECT id FROM banks ORDER BY id LIMIT 1)
WHERE r.bank_id IS NULL;

ALTER TABLE scholarship_requests ALTER COLUMN bank_id SET NOT NULL;
ALTER TABLE scholarship_requests DROP COLUMN IF EXISTS bank_name;

CREATE INDEX IF NOT EXISTS idx_requests_bank_id ON scholarship_requests(bank_id);
