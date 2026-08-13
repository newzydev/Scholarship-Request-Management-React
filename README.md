# ระบบบริหารจัดการคำขอทุนการศึกษา (Scholarship Request Management)

เว็บแอปพลิเคชันสำหรับให้นักศึกษายื่นคำขอทุนการศึกษาออนไลน์ และให้เจ้าหน้าที่ทุนบันทึก ค้นหา
ปรับปรุง และพิจารณาสถานะคำขอทุนได้อย่างเป็นระบบ — พัฒนาเป็นระบบต้นแบบ (Prototype/POC)
สำหรับข้อสอบภาคปฏิบัติ ตำแหน่งนักวิชาการคอมพิวเตอร์ กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์
มหาวิทยาลัยสงขลานครินทร์

เอกสารออกแบบระบบ (ER Diagram, System Architecture) อยู่ในโฟลเดอร์ [`docs/`](docs)

---

## เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | React 19 (Vite), React Router, AdminLTE 4 (Bootstrap 5), Chart.js / react-chartjs-2, Axios |
| Backend | Node.js, Express 5 (RESTful API), ExcelJS (Export รายงานเป็น Excel) |
| Database | PostgreSQL (Aiven Cloud) |
| Auth | JWT (httpOnly cookie) + bcrypt |
| Container | Docker (Docker Compose + Nginx สำหรับรัน local, combined image เดียวสำหรับ Deploy) |
| Deploy | [Render](https://render.com) (Docker runtime, auto-deploy จาก GitHub `main`) |

โครงสร้างโปรเจกต์แบ่งเป็น `client/` (React) และ `server/` (Express API) อยู่ใน repository เดียวกัน

---

## ทดลองใช้งานที่ดำเนินการ Deploy ขึ้นออนไลน์แล้ว

**🌐 https://scholarship-request-management-react.onrender.com**

ระบบ deploy จริงแล้วบน [Render](https://render.com) แพลน **Starter** (รันตลอด 24 ชม. ไม่มี
cold start) เชื่อมต่อฐานข้อมูล PostgreSQL จริงตัวเดียวกับที่ใช้พัฒนา (Aiven) และตั้งค่า
**auto-deploy ทุกครั้งที่ `git push` ขึ้น branch `main`** ไว้แล้ว — ทดลองยื่นคำขอทุน หรือเข้าสู่
ระบบเจ้าหน้าที่ด้วยบัญชีทดสอบด้านล่างได้ทันที

---

## เริ่มใช้งานแบบเร็วที่สุด (สำหรับทดสอบภายในเครื่อง)

โปรเจกต์นี้มีไฟล์ `.env` พร้อมค่าเชื่อมต่อฐานข้อมูล Aiven จริงมาให้แล้ว (commit ไว้ตั้งใจ เพราะเป็น
ฐานข้อมูลที่สร้างไว้เฉพาะสำหรับโปรเจกต์สอบนี้) จึงรันได้ทันทีโดยไม่ต้องตั้งค่าอะไรเพิ่ม
**ต้องมีการเชื่อมต่ออินเทอร์เน็ตขณะรัน**

### Windows — ดับเบิลคลิกได้เลย

ต้องเปิด [Docker Desktop](https://www.docker.com/) ไว้ก่อน

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| [`RUN.bat`](RUN.bat) | สร้างและรันระบบทั้งหมด รอจนพร้อมแล้วเปิดเบราว์เซอร์ให้อัตโนมัติ |
| [`STOP.bat`](STOP.bat) | หยุดระบบทั้งหมด (ข้อมูลไม่หาย เพราะฐานข้อมูลอยู่บน Aiven Cloud) |

### macOS / Linux หรือรันด้วยคำสั่งเอง

```bash
docker compose up --build
```

รัน 2 services: **server** (Express API พอร์ต `4000`) และ **client** (React build serve ผ่าน
Nginx พอร์ต `8080`, proxy เส้นทาง `/api` ไปยัง server ให้อัตโนมัติ) หยุดระบบด้วย
`docker compose down`

เปิดเบราว์เซอร์ไปที่ http://localhost:8080/ (หน้ายื่นคำขอทุน) หรือ http://localhost:8080/login
(หน้าเจ้าหน้าที่)

---

## บัญชีทดสอบสำหรับเข้าสู่ระบบ (เจ้าหน้าที่)

| Username | Password |
|---|---|
| `staff01` | `Staff@1234` |

---

## ข้อมูลตัวอย่าง (Seed Data)

ฐานข้อมูลบน Aiven มีข้อมูลตัวอย่างนำเข้าไว้แล้วล่วงหน้า ผ่านสคริปต์
[`server/src/db/migrations/`](server/src/db/migrations) (สร้างตาราง) และ
[`server/src/db/seeds/`](server/src/db/seeds) (นำเข้าข้อมูล):

- บัญชีเจ้าหน้าที่ทดสอบ 1 บัญชี (`staff01`)
- ประเภททุนการศึกษา 5 ประเภทตามที่โจทย์กำหนด
- คำขอทุนตัวอย่างกว่า 30 รายการ กระจายครบทั้ง 5 ประเภททุน และ 3 สถานะ (รอพิจารณา / อนุมัติ /
  ไม่อนุมัติ) เพื่อสาธิตการแบ่งหน้า การค้นหา และการกรอง

ทั้งสองสคริปต์เขียนแบบ idempotent รันซ้ำได้ปลอดภัยด้วย `npm run db:migrate` และ `npm run db:seed`
ภายในโฟลเดอร์ `server/`

---

## ฟีเจอร์ที่พัฒนาทั้งหมด

- **หน้ายื่นคำขอทุน (สาธารณะ)** — นักศึกษายื่นคำขอได้โดยไม่ต้องเข้าสู่ระบบ พร้อม validation ทั้ง
  client-side และ server-side และต้องให้ความยินยอม PDPA ก่อนบันทึก
- **เข้าสู่ระบบ/ออกจากระบบ** สำหรับเจ้าหน้าที่ (JWT httpOnly cookie)
- **แสดงรายการคำขอทุน** แบบตาราง แบ่งหน้า 10 รายการ/หน้า
- **ค้นหา/กรอง** ตามชื่อ-รหัสนักศึกษา, สถานะ, และประเภททุน
- **ดู/เพิ่ม/แก้ไขคำขอทุน** โดยเจ้าหน้าที่ — หน้าดูรายละเอียดแสดงข้อมูลแบบอ่านอย่างเดียวและ mask
  เลขบัญชีธนาคาร ส่วนหน้าเพิ่ม/แก้ไขใช้ฟอร์มและ validation ชุดเดียวกับหน้านักศึกษา เข้าถึงได้จาก
  ปุ่มไอคอนในตารางรายการ (ดู/แก้ไข/ลบ พร้อม tooltip)
- **จัดการสถานะคำขอ** (รอพิจารณา → อนุมัติ / ไม่อนุมัติ) พร้อมบันทึกหมายเหตุประกอบ
- **ลบคำขอทุนแบบ Soft Delete** ผ่านปุ่มไอคอนในตารางรายการ พร้อมหน้าต่างยืนยันก่อนลบ
  อนุญาตเฉพาะสถานะ "รอพิจารณา"
- **แดชบอร์ดสรุปภาพรวม** จำนวนคำขอรวม/แยกตามสถานะ, จำนวน/ยอดเงินรวมแยกตามประเภททุน พร้อมกราฟ
  หลายรูปแบบ (Doughnut, Bar, Polar Area) ด้วย Chart.js
- **จัดการบัญชีเจ้าหน้าที่ (CRUD)** — ดู/เพิ่ม/แก้ไข/ลบบัญชี (Soft Delete) ผ่านปุ่มไอคอนในตาราง
  รายการ เปลี่ยนรหัสผ่านได้ ป้องกันการลบบัญชีของตนเองขณะใช้งานอยู่ และตรวจสอบชื่อผู้ใช้ซ้ำ
- **รายงานสรุป (Report)** — หน้ารายงานแยกจากแดชบอร์ด กรองข้อมูลตามช่วงวันที่ยื่น สถานะ และ
  ประเภททุน แสดงการ์ดสรุปยอด ตารางสรุปจำนวน/ยอดเงินแยกตามประเภททุน และตารางรายการละเอียดแบบ
  แบ่งหน้าตามเงื่อนไขที่กรอง พิมพ์รายงานผ่านเบราว์เซอร์ได้ทันที และ Export เป็นไฟล์ Excel (.xlsx)
  ที่สร้างฝั่ง Server ด้วย ExcelJS (แยกชีทสรุปตามประเภททุน และชีทรายการละเอียด)

### ฟีเจอร์เสริม

- **Data Masking** — เลขที่บัญชีธนาคารถูกปิดบังบางส่วน (แสดงเฉพาะ 4 หลักท้าย) ในหน้ารายการคำขอทุน
- **การจัดเก็บรหัสผ่านอย่างปลอดภัย** — ใช้ bcrypt hash รหัสผ่านเจ้าหน้าที่ ไม่เก็บเป็น plain text
- **Security Headers ระดับ A+** — ตั้งค่า Content-Security-Policy, Permissions-Policy และ header
  ความปลอดภัยอื่นๆ ผ่าน Helmet/Nginx (ตรวจสอบได้ที่ [securityheaders.com](https://securityheaders.com))
- **เอกสารออกแบบระบบ** — ดู [`docs/System-Architecture.md`](docs/System-Architecture.md) และ
  [`docs/ER-Diagram.md`](docs/ER-Diagram.md)

---

## โครงสร้างโปรเจกต์

```
Scholarship-Request-Management-React/
├── client/            # React + Bootstrap 5 (frontend)
├── server/            # Express REST API (backend)
│   └── src/db/
│       ├── migrations/   # SQL schema (idempotent)
│       └── seeds/         # ข้อมูลตัวอย่าง
├── docs/              # เอกสารออกแบบระบบ (ER Diagram, Architecture)
├── docker-compose.yml # รัน local dev/สอบ (nginx + server แยก container)
├── Dockerfile         # combined build สำหรับ deploy บน Render (frontend+backend container เดียว)
├── .env               # connection string จริง (commit ไว้โดยตั้งใจ)
├── .env.example
├── RUN.bat            # รันระบบด้วย Docker (Windows, ดับเบิลคลิกได้)
├── STOP.bat           # หยุดระบบ (Windows, ดับเบิลคลิกได้)
└── README.md
```

---

## การใช้เครื่องมือ AI ในการพัฒนา

โปรเจกต์นี้พัฒนาโดยใช้ **Claude Code** เป็นผู้ช่วยตลอดกระบวนการพัฒนา ทั้งการเขียนโค้ด
Backend/Frontend, สคริปต์ migration/seed ฐานข้อมูล, และการตั้งค่า Docker/Docker Compose/Deploy
ภายใต้การกำหนดขอบเขตงาน ตัดสินใจเชิงสถาปัตยกรรม ตรวจทานโค้ด และทดสอบยืนยันผลลัพธ์ผ่าน
เบราว์เซอร์จริงทุกขั้นตอนโดยผู้พัฒนา
