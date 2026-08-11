-- Scholarship Request Management - seed data
-- Idempotent-ish: uses ON CONFLICT to avoid duplicate errors on re-run

-- --- Staff test account ---
-- username: staff01 / password: Staff@1234 (documented in README)
INSERT INTO staff (first_name, last_name, username, password_hash)
VALUES ('สมชาย', 'ใจดี', 'staff01', '$2b$10$7nsOViDF.KGaY4m0lgwrQO8eRy1OfUSO6lmI7wCLA/IEMXKZlcCxG')
ON CONFLICT (username) DO NOTHING;

-- --- Scholarship types ---
INSERT INTO scholarship_types (code, name_th) VALUES
    ('need', 'ทุนขาดแคลนทุนทรัพย์'),
    ('merit', 'ทุนส่งเสริมการศึกษา (เรียนดี)'),
    ('work_study', 'ทุนทำงานพิเศษ (นักศึกษาช่วยงาน)'),
    ('emergency', 'ทุนฉุกเฉิน/ช่วยเหลือกรณีพิเศษ'),
    ('activity', 'ทุนกิจกรรมนักศึกษา')
ON CONFLICT (code) DO NOTHING;

-- --- Sample scholarship requests (30 rows, mixed types/statuses) ---
INSERT INTO scholarship_requests
    (request_no, student_id, first_name, last_name, faculty, year_level, gpax, email,
     scholarship_type_id, amount_requested, bank_account_no, reason, pdpa_consent,
     status, status_note, submitted_at, created_by)
SELECT
    'SRQ-2026-' || lpad(nextval('scholarship_request_no_seq')::text, 6, '0'),
    v.student_id, v.first_name, v.last_name, v.faculty, v.year_level, v.gpax, v.email,
    t.id, v.amount_requested, v.bank_account_no, v.reason, true,
    v.status::request_status, v.status_note, v.submitted_at, v.created_by
FROM (VALUES
    ('6410110001','กมลชนก','แสงทอง','คณะวิศวกรรมศาสตร์',3,3.45,'kamonchanok.s@psu.ac.th','need',15000,'1234567801','ครอบครัวมีรายได้น้อย ต้องการทุนเพื่อใช้จ่ายค่าเทอม','pending',NULL,now() - interval '2 days',NULL),
    ('6410110002','ธนวัฒน์','ศรีสุข','คณะวิทยาศาสตร์',2,3.78,'thanawat.s@psu.ac.th','merit',10000,'1234567802','ผลการเรียนดีต่อเนื่อง ต้องการทุนสนับสนุนการศึกษา','approved','อนุมัติตามเกณฑ์คุณสมบัติครบถ้วน',now() - interval '20 days',NULL),
    ('6410110003','ปิยะดา','รักเรียน','คณะพยาบาลศาสตร์',4,3.20,'piyada.r@psu.ac.th','emergency',8000,'1234567803','ผู้ปกครองประสบอุบัติเหตุ ต้องการความช่วยเหลือเร่งด่วน','approved','กรณีฉุกเฉิน อนุมัติเร่งด่วน',now() - interval '5 days',1),
    ('6410110004','ณัฐพล','ดวงแก้ว','คณะเศรษฐศาสตร์',1,2.95,'nattapon.d@psu.ac.th','need',12000,'1234567804','ครอบครัวมีรายได้น้อย','pending',NULL,now() - interval '1 days',NULL),
    ('6410110005','ศิริพร','มณีวรรณ','คณะศึกษาศาสตร์',3,3.60,'siriporn.m@psu.ac.th','activity',5000,'1234567805','เข้าร่วมกิจกรรมชมรมดนตรีของมหาวิทยาลัย','pending',NULL,now() - interval '3 days',NULL),
    ('6410110006','วรากร','ทองสุข','คณะวิศวกรรมศาสตร์',2,3.10,'warakorn.t@psu.ac.th','work_study',6000,'1234567806','ต้องการทำงานพิเศษเพื่อหารายได้เสริมระหว่างเรียน','approved','ผ่านการสัมภาษณ์เรียบร้อย',now() - interval '30 days',NULL),
    ('6410110007','อรวรรณ','ใจงาม','คณะเภสัชศาสตร์',4,3.85,'orawan.j@psu.ac.th','merit',15000,'1234567807','ผลการเรียนอยู่ในเกณฑ์ดีเยี่ยม','pending',NULL,now() - interval '4 days',NULL),
    ('6410110008','ภาณุพงศ์','แก้วมณี','คณะนิติศาสตร์',1,2.80,'phanupong.k@psu.ac.th','need',10000,'1234567808','รายได้ครอบครัวไม่เพียงพอต่อค่าใช้จ่าย','rejected','เอกสารรับรองรายได้ไม่ครบถ้วน',now() - interval '25 days',NULL),
    ('6410110009','จิรัชญา','พลอยงาม','คณะรัฐศาสตร์',3,3.50,'jiratchaya.p@psu.ac.th','activity',4000,'1234567809','ร่วมกิจกรรมค่ายอาสาพัฒนาชุมชน','approved','อนุมัติเรียบร้อย',now() - interval '15 days',NULL),
    ('6410110010','กิตติศักดิ์','บุญมี','คณะวิทยาศาสตร์',2,3.30,'kittisak.b@psu.ac.th','emergency',9000,'1234567810','ประสบภัยน้ำท่วมบ้านพักอาศัย','pending',NULL,now() - interval '6 days',1),
    ('6410110011','สุพัตรา','แสนดี','คณะพยาบาลศาสตร์',4,3.65,'supattra.s@psu.ac.th','merit',12000,'1234567811','ผลการเรียนดีต่อเนื่อง 3 ปีการศึกษา','pending',NULL,now() - interval '7 days',NULL),
    ('6410110012','ธีรภัทร์','ศรีวิไล','คณะวิศวกรรมศาสตร์',1,2.75,'teerapat.s@psu.ac.th','need',13000,'1234567812','ครอบครัวมีภาระค่าใช้จ่ายสูง','pending',NULL,now() - interval '2 days',NULL),
    ('6410110013','นภัสสร','ทิพย์วงศ์','คณะศิลปศาสตร์',3,3.15,'napassorn.t@psu.ac.th','work_study',5500,'1234567813','ต้องการทำงานพิเศษช่วยงานธุรการคณะ','approved','เริ่มปฏิบัติงานได้ทันที',now() - interval '18 days',NULL),
    ('6410110014','ปรัชญา','สว่างวงศ์','คณะเศรษฐศาสตร์',2,3.40,'pratya.s@psu.ac.th','activity',3500,'1234567814','เป็นตัวแทนนักศึกษาร่วมแข่งขันกีฬามหาวิทยาลัย','pending',NULL,now() - interval '3 days',NULL),
    ('6410110015','วิภาวี','เพชรรัตน์','คณะแพทยศาสตร์',5,3.90,'wipawee.p@psu.ac.th','merit',20000,'1234567815','ผลการเรียนดีเยี่ยมระดับคณะ','approved','อนุมัติเต็มจำนวน',now() - interval '28 days',NULL),
    ('6410110016','อดิศร','มั่นคง','คณะนิติศาสตร์',1,2.60,'adisorn.m@psu.ac.th','need',11000,'1234567816','บิดามารดาว่างงาน ไม่มีรายได้ประจำ','rejected','ไม่ผ่านเกณฑ์รายได้ครัวเรือนตามระเบียบ',now() - interval '22 days',NULL),
    ('6410110017','ชนิกานต์','รุ่งเรือง','คณะวิทยาการจัดการ',4,3.55,'chanikan.r@psu.ac.th','emergency',7000,'1234567817','อุบัติเหตุทางรถยนต์ระหว่างเดินทางกลับภูมิลำเนา','approved','อนุมัติกรณีฉุกเฉิน',now() - interval '9 days',1),
    ('6410110018','ศุภกิจ','ทองแท้','คณะวิศวกรรมศาสตร์',3,3.25,'supakit.t@psu.ac.th','work_study',6500,'1234567818','สมัครเป็นผู้ช่วยสอนในห้องปฏิบัติการ','pending',NULL,now() - interval '1 days',NULL),
    ('6410110019','พิมพ์ชนก','แก้วใส','คณะพยาบาลศาสตร์',2,3.70,'pimchanok.k@psu.ac.th','merit',10000,'1234567819','เกรดเฉลี่ยสะสมอยู่ในลำดับต้นของคณะ','pending',NULL,now() - interval '5 days',NULL),
    ('6410110020','ธนกร','ศรีสมบัติ','คณะเกษตรศาสตร์',1,2.90,'thanakorn.s@psu.ac.th','need',9500,'1234567820','ครอบครัวประกอบอาชีพเกษตรกร รายได้ไม่แน่นอน','pending',NULL,now() - interval '2 days',NULL),
    ('6410110021','กัญญารัตน์','บัวขาว','คณะศึกษาศาสตร์',4,3.35,'kanyarat.b@psu.ac.th','activity',4500,'1234567821','ร่วมเป็นคณะกรรมการจัดกิจกรรมรับน้องใหม่','approved','อนุมัติเรียบร้อย',now() - interval '12 days',NULL),
    ('6410110022','ปกรณ์เกียรติ','วงศ์สวัสดิ์','คณะวิทยาศาสตร์',3,3.05,'pakornkiat.w@psu.ac.th','work_study',6000,'1234567822','ต้องการช่วยงานในห้องสมุดคณะระหว่างภาคเรียน','rejected','ตำแหน่งงานเต็มแล้วในรอบนี้',now() - interval '19 days',NULL),
    ('6410110023','ดวงกมล','สายทอง','คณะเภสัชศาสตร์',5,3.80,'duangkamol.s@psu.ac.th','merit',18000,'1234567823','เกรดเฉลี่ยสูงต่อเนื่องทุกภาคการศึกษา','pending',NULL,now() - interval '4 days',NULL),
    ('6410110024','เอกภพ','ชัยมงคล','คณะรัฐศาสตร์',2,2.85,'ekkapop.c@psu.ac.th','need',10500,'1234567824','รายได้ครอบครัวลดลงจากสถานการณ์เศรษฐกิจ','pending',NULL,now() - interval '3 days',1),
    ('6410110025','รัตนาภรณ์','ใสสะอาด','คณะนิติศาสตร์',1,3.15,'rattanaporn.s@psu.ac.th','emergency',8500,'1234567825','ที่พักอาศัยประสบเหตุเพลิงไหม้','approved','อนุมัติกรณีฉุกเฉินเร่งด่วน',now() - interval '10 days',NULL),
    ('6410110026','ชยพล','เดชะ','คณะวิศวกรรมศาสตร์',4,3.42,'chayapol.d@psu.ac.th','activity',4000,'1234567826','ตัวแทนนักศึกษาร่วมประกวดสิ่งประดิษฐ์ระดับชาติ','pending',NULL,now() - interval '6 days',NULL),
    ('6410110027','ภัทรวดี','แสงจันทร์','คณะวิทยาการจัดการ',3,3.22,'phattarawadee.s@psu.ac.th','work_study',5800,'1234567827','สมัครช่วยงานประชาสัมพันธ์คณะ','approved','ผ่านการพิจารณาเรียบร้อย',now() - interval '14 days',NULL),
    ('6410110028','กฤษณะ','พูลสวัสดิ์','คณะเศรษฐศาสตร์',2,2.70,'kritsana.p@psu.ac.th','need',12500,'1234567828','ครอบครัวมีภาระหนี้สินจากการรักษาพยาบาล','rejected','เอกสารประกอบไม่ครบตามระเบียบ',now() - interval '27 days',NULL),
    ('6410110029','สิริยากร','มีทรัพย์','คณะพยาบาลศาสตร์',1,3.05,'siriyakorn.m@psu.ac.th','merit',9000,'1234567829','ผลการเรียนภาคแรกอยู่ในเกณฑ์ดี','pending',NULL,now() - interval '1 days',NULL),
    ('6410110030','อภิสิทธิ์','รุ่งโรจน์','คณะแพทยศาสตร์',6,3.95,'apisit.r@psu.ac.th','activity',5000,'1234567830','ร่วมออกหน่วยแพทย์เคลื่อนที่ให้บริการชุมชน','approved','อนุมัติเรียบร้อย',now() - interval '8 days',NULL)
) AS v(student_id, first_name, last_name, faculty, year_level, gpax, email, type_code, amount_requested, bank_account_no, reason, status, status_note, submitted_at, created_by)
JOIN scholarship_types t ON t.code = v.type_code
WHERE NOT EXISTS (
    SELECT 1 FROM scholarship_requests sr WHERE sr.student_id = v.student_id AND sr.faculty = v.faculty
);
