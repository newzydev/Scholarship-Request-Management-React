# ระบบบริหารจัดการคำขอทุนการศึกษา (Scholarship Request Management)

เว็บแอปพลิเคชันสำหรับให้นักศึกษายื่นคำขอทุนการศึกษาออนไลน์ และให้เจ้าหน้าที่ทุนบันทึก ค้นหา
ปรับปรุง และพิจารณาสถานะคำขอทุนได้อย่างเป็นระบบ — พัฒนาเป็นระบบต้นแบบ (Prototype/POC)
สำหรับข้อสอบภาคปฏิบัติ ตำแหน่งนักวิชาการคอมพิวเตอร์
กองพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์ มหาวิทยาลัยสงขลานครินทร์

เอกสารการวิเคราะห์ความต้องการและออกแบบระบบแบบละเอียดอยู่ใน [`PROJECT-PLAN.md`](PROJECT-PLAN.md)
และเอกสารออกแบบเพิ่มเติม (ER Diagram, System Architecture) อยู่ในโฟลเดอร์ [`docs/`](docs)

> **🌐 ทดลองใช้งานออนไลน์ได้ที่:** https://scholarship-request-management-react.onrender.com
> (deploy จริงบน Render, auto-deploy ทุกครั้งที่ push ขึ้น branch `main` — ดูรายละเอียดในหัวข้อ
> [Deploy ขึ้นออนไลน์](#deploy-ขึ้นออนไลน์))

## เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | React 19 (Vite), React Router, AdminLTE 4 (Bootstrap 5), Chart.js / react-chartjs-2, Axios |
| Backend | Node.js, Express 5 (RESTful API) |
| Database | PostgreSQL (Aiven Cloud) |
| Auth | JWT (httpOnly cookie) + bcrypt |
| Container | Docker (Docker Compose + Nginx สำหรับ local, combined image เดียวสำหรับ Deploy) |
| Deploy | [Render](https://render.com) (auto-deploy จาก GitHub `main`) |

โครงสร้างโปรเจกต์แบ่งเป็น `client/` (React) และ `server/` (Express API) อยู่ใน Repository เดียวกัน

---

## เริ่มใช้งานแบบเร็วที่สุด (Windows)

ไม่ต้องพิมพ์คำสั่งใดๆ เลย — ดับเบิลคลิกไฟล์ได้ทันที (ต้องเปิด [Docker Desktop](https://www.docker.com/) ไว้ก่อน):

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| [`RUN.bat`](RUN.bat) | สร้างและรันระบบทั้งหมด รอจนพร้อมแล้วเปิดเบราว์เซอร์ให้อัตโนมัติ |
| [`STOP.bat`](STOP.bat) | หยุดระบบทั้งหมด (ข้อมูลในฐานข้อมูลไม่หาย เพราะอยู่บน Aiven Cloud) |

การรันครั้งแรกอาจใช้เวลาสักครู่ (ดาวน์โหลด/สร้าง image) ครั้งต่อไปจะเร็วขึ้นมาก

---

## วิธีรันระบบด้วย Docker (สำหรับ macOS/Linux หรือรันด้วยคำสั่งเอง)

ข้อกำหนด: ติดตั้ง [Docker](https://www.docker.com/) และ Docker Compose แล้ว

```bash
docker compose up --build
```

คำสั่งนี้จะรัน 2 services พร้อมกัน:

- **server** — Express API ที่พอร์ต `4000` เชื่อมต่อฐานข้อมูล PostgreSQL จริงบน Aiven Cloud
  โดยอ่านค่าการเชื่อมต่อจากไฟล์ `.env` ที่ root ของโปรเจกต์ (ผ่าน `env_file` ใน `docker-compose.yml`)
- **client** — เว็บแอป React (build แล้ว serve ผ่าน Nginx) ที่พอร์ต `8080`
  พร้อม reverse proxy เส้นทาง `/api` ไปยัง server ให้อัตโนมัติ

เมื่อรันสำเร็จ เปิดเบราว์เซอร์ไปที่:

- หน้ายื่นคำขอทุน (นักศึกษา): http://localhost:8080/ (หน้าแรกของระบบ)
- หน้าเข้าสู่ระบบเจ้าหน้าที่: http://localhost:8080/login

หยุดระบบด้วย `docker compose down`

> **หมายเหตุด้านความปลอดภัย:** ไฟล์ `.env` (มี connection string จริงของฐานข้อมูล) ถูก commit ไว้ใน
> repository นี้โดยตั้งใจ เพื่อให้ทั้ง Docker และการรันแบบ local development เชื่อมต่อฐานข้อมูลจริงได้
> ทันทีโดยไม่ต้องตั้งค่าเพิ่ม (เป็นฐานข้อมูลที่สร้างไว้เฉพาะสำหรับโปรเจกต์สอบนี้เท่านั้น)
> ระบบต้องมีการเชื่อมต่ออินเทอร์เน็ตขณะรัน

## วิธีรันระบบแบบ Local Development (ไม่ใช้ Docker)

ข้อกำหนด: Node.js 20+, npm

โปรเจกต์นี้มีไฟล์ `.env` พร้อมค่าเชื่อมต่อฐานข้อมูล Aiven จริงมาให้แล้ว จึงรันได้ทันทีโดยไม่ต้อง
ตั้งค่าอะไรเพิ่ม (หากต้องการใช้ฐานข้อมูลของตนเองแทน แก้ไขค่า `DATABASE_URL` ในไฟล์ `.env` ได้เลย
หรือดูตัวอย่างรูปแบบได้จาก `.env.example`)

1. ติดตั้งและรัน Backend

   ```bash
   cd server
   npm install
   npm run db:migrate   # สร้างตาราง (idempotent, รันซ้ำได้)
   npm run db:seed       # นำเข้าข้อมูลตัวอย่าง (บัญชีเจ้าหน้าที่ + คำขอทุนตัวอย่าง)
   npm run dev            # รันที่ http://localhost:4000
   ```

2. ติดตั้งและรัน Frontend (เปิดอีก terminal หนึ่ง)

   ```bash
   cd client
   npm install
   npm run dev   # รันที่ http://localhost:5173 (proxy /api ไปที่ server อัตโนมัติผ่าน vite.config.js)
   ```

3. เปิดเบราว์เซอร์ไปที่ http://localhost:5173/ (หน้านักศึกษา หน้าแรกของระบบ)
   หรือ http://localhost:5173/login (หน้าเจ้าหน้าที่)

## บัญชีทดสอบสำหรับเข้าสู่ระบบ (เจ้าหน้าที่)

| Username | Password |
|---|---|
| `staff01` | `Staff@1234` |

## ข้อมูลตัวอย่าง (Seed Data)

ฐานข้อมูลบน Aiven ที่ระบบเชื่อมต่ออยู่ (ทั้ง Docker และ local dev ใช้ฐานข้อมูลเดียวกัน) มีข้อมูล
ตัวอย่างนำเข้าไว้แล้วล่วงหน้า ผ่านสคริปต์ `server/src/db/migrations/001_init.sql` (สร้างตาราง) และ
`server/src/db/seeds/001_seed.sql` (นำเข้าข้อมูลตัวอย่าง) ได้แก่:

- บัญชีเจ้าหน้าที่ทดสอบ 1 บัญชี (`staff01`)
- ประเภททุนการศึกษา 5 ประเภทตามที่โจทย์กำหนด
- คำขอทุนตัวอย่างกว่า 30 รายการ กระจายครบทั้ง 5 ประเภททุน และ 3 สถานะ
  (รอพิจารณา / อนุมัติ / ไม่อนุมัติ) เพื่อสาธิตการแบ่งหน้า การค้นหา และการกรอง

หากต้องการรันสคริปต์เหล่านี้ซ้ำ (เช่น ย้ายไปใช้ฐานข้อมูลอื่น) ทั้งสองสคริปต์เขียนแบบ idempotent
สามารถรันซ้ำได้ปลอดภัยด้วย `npm run db:migrate` และ `npm run db:seed` ภายในโฟลเดอร์ `server/`

## Deploy ขึ้นออนไลน์

**สถานะปัจจุบัน:** ระบบ deploy จริงแล้วบน [Render](https://render.com) ที่
**https://scholarship-request-management-react.onrender.com** (แพลน **Starter** — รันตลอด
24 ชม. ไม่มี cold start/sleep) เชื่อมต่อฐานข้อมูลจริงตัวเดียวกับที่ใช้พัฒนา (Aiven) และตั้งค่า
**auto-deploy ทุกครั้งที่ `git push` ขึ้น branch `main`** ไว้แล้ว — ไม่ต้องทำอะไรเพิ่มเพื่ออัปเดตเว็บ
แค่ push โค้ดตามปกติ

โปรเจกต์นี้มี [`Dockerfile`](Dockerfile) แยกต่างหากที่ root ของ repo ซึ่งรวม frontend (React build)
เข้ากับ backend (Express) เป็น container เดียว serve ผ่านพอร์ตเดียวกัน (ไม่ต้องมี nginx แยก
ไม่มีปัญหา CORS/cookie ข้าม domain) — เป็นไฟล์ที่ใช้ deploy บน Render จริง (แยกจาก
`docker-compose.yml` ที่ใช้รัน local/สอบ ซึ่งไม่กระทบกัน)

<details>
<summary>ขั้นตอนตั้งค่าบน Render (สำหรับอ้างอิง/ทำซ้ำ เช่น ย้ายไป account อื่น)</summary>

1. สมัคร/ล็อกอิน Render ด้วยบัญชี GitHub
2. New + → **Web Service** → เลือก repo นี้
3. ตั้งค่า: Branch = `main`, Runtime = **Docker** (Render จะเจอ `Dockerfile` ที่ root เอง),
   เลือก Instance Type ตามต้องการ (**Free** สำหรับใช้ชั่วคราว หรือ **Starter** ขึ้นไปถ้าต้องการรัน
   ตลอดเวลาไม่มี sleep)
4. เพิ่ม Environment Variables (คัดลอกค่าจากไฟล์ `.env` ในเครื่อง): `DATABASE_URL`, `JWT_SECRET`,
   `JWT_EXPIRES_IN` (**ห้าม** เพิ่ม `PORT` เอง ปล่อยให้ Render จัดการอัตโนมัติ ส่วน `NODE_ENV=production`
   ตั้งไว้ใน `Dockerfile` แล้วไม่ต้องเพิ่มซ้ำ)
5. กด **Create Web Service** — build และ deploy ครั้งแรกเสร็จแล้วจะได้ลิงก์ทันที
   เช่น `https://ชื่อที่ตั้ง.onrender.com` (มี HTTPS ให้อัตโนมัติ)
6. ตั้งแต่นั้น **ทุกครั้งที่ `git push` ขึ้น branch `main` ระบบจะ deploy ให้อัตโนมัติ**

> หมายเหตุ: แพลน **Free** ของ Render จะ sleep เมื่อไม่มีคนใช้งานเกิน 15 นาที การเข้าใช้งานครั้งแรก
> หลังจากนั้นจะช้ากว่าปกติ (cold start ~30-60 วินาที) — สลับ Free ↔ Starter ทีหลังได้ตลอดผ่าน
> Settings → Instance Type ของ service (ไม่ใช่ข้อจำกัดถาวร)

</details>

## ฟีเจอร์หลักที่พัฒนา

- **หน้ายื่นคำขอทุน (สาธารณะ)** — นักศึกษายื่นคำขอได้โดยไม่ต้องเข้าสู่ระบบ พร้อมตรวจสอบข้อมูล
  (client-side + server-side validation) และต้องให้ความยินยอม PDPA ก่อนบันทึก
- **เข้าสู่ระบบ/ออกจากระบบ** สำหรับเจ้าหน้าที่ (JWT httpOnly cookie)
- **แสดงรายการคำขอทุน** แบบตาราง แบ่งหน้า 10 รายการ/หน้า
- **ค้นหา/กรอง** ตามชื่อ-รหัสนักศึกษา, สถานะ, และประเภททุน
- **เพิ่ม/แก้ไขคำขอทุน** โดยเจ้าหน้าที่ ด้วยฟอร์มและ validation ชุดเดียวกับหน้านักศึกษา
- **จัดการสถานะคำขอ** (รอพิจารณา → อนุมัติ / ไม่อนุมัติ) พร้อมบันทึกหมายเหตุประกอบ
- **ลบคำขอทุนแบบ Soft Delete** พร้อมหน้าต่างยืนยันก่อนลบ อนุญาตเฉพาะสถานะ "รอพิจารณา"
- **แดชบอร์ดสรุปภาพรวม** จำนวนคำขอรวม/แยกตามสถานะ, จำนวน/ยอดเงินรวมแยกตามประเภททุน,
  พร้อมกราฟหลายรูปแบบ (Doughnut, Bar, Polar Area) ด้วย Chart.js
- **จัดการบัญชีเจ้าหน้าที่ (CRUD)** — เพิ่ม/แก้ไข/ลบบัญชีเจ้าหน้าที่ (Soft Delete) เปลี่ยนรหัสผ่านได้
  ป้องกันการลบบัญชีของตนเองขณะใช้งานอยู่ และตรวจสอบชื่อผู้ใช้ซ้ำ

### ฟีเจอร์เสริม (Bonus)

- **Data Masking** — เลขที่บัญชีธนาคารจะถูกปิดบังบางส่วน (แสดงเฉพาะ 4 หลักท้าย) ในหน้ารายการคำขอทุน
- **การจัดเก็บรหัสผ่านอย่างปลอดภัย** — ใช้ bcrypt hash รหัสผ่านเจ้าหน้าที่ ไม่เก็บเป็น plain text
- **เอกสารออกแบบระบบ** — ดู [`docs/System-Architecture.md`](docs/System-Architecture.md)
  และ [`docs/ER-Diagram.md`](docs/ER-Diagram.md)

## การใช้เครื่องมือ AI ในการพัฒนา

โปรเจกต์นี้พัฒนาโดยใช้ **Claude Code** ช่วยในกระบวนการพัฒนา ได้แก่ การวิเคราะห์โจทย์และออกแบบ
สถาปัตยกรรมระบบ/ฐานข้อมูล (สรุปไว้ใน `PROJECT-PLAN.md`), การเขียนโค้ด Backend/Frontend ตาม
ข้อกำหนด, การเขียนสคริปต์ migration/seed ฐานข้อมูล, การตั้งค่า Docker/Docker Compose,
และการทดสอบการทำงานของระบบผ่านเบราว์เซอร์จริงก่อนส่งมอบงาน โดยผู้พัฒนาเป็นผู้ตรวจทาน
กำหนดข้อกำหนด และยืนยันผลลัพธ์ทุกขั้นตอน

## โครงสร้างโปรเจกต์

```
Scholarship-Request-Management-React/
├── client/            # React + Bootstrap 5 (frontend)
├── server/            # Express REST API (backend)
│   └── src/db/
│       ├── migrations/   # SQL schema (idempotent)
│       └── seeds/         # ข้อมูลตัวอย่าง
├── docs/              # เอกสารออกแบบระบบ (ER Diagram, Architecture)
├── docker-compose.yml # local dev/grading (nginx + server แยก container)
├── Dockerfile         # combined build สำหรับ deploy ฟรีบน Render (ดูหัวข้อด้านบน)
├── .env               # connection string จริง (commit ไว้โดยตั้งใจ ดูหัวข้อด้านบน)
├── .env.example
├── RUN.bat            # รันระบบด้วย Docker (Windows, ดับเบิลคลิกได้)
├── STOP.bat           # หยุดระบบ (Windows, ดับเบิลคลิกได้)
├── PROJECT-PLAN.md    # เอกสารวิเคราะห์ความต้องการและออกแบบระบบ
└── README.md
```
