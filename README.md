# 🎭 Playwright Automation Framework (JavaScript ES Modules)

โปรเจกต์โครงสร้าง Playwright (JavaScript ES Modules) มาตรฐานระดับ Enterprise ที่ขับเคลื่อนด้วยเอกสาร Test Case ในรูปแบบ Markdown (`.md`) โดยใช้ตัวอย่างจริง **ระบบค้นหาและกรองโพสต์ (TC-SEARCH Series)**

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
playwright-project/
├── docs/
│   └── testcases/               # 📄 แหล่งรวมไฟล์เอกสาร Test Case (.md)
│       ├── template.md          # เทมเพลตมาตรฐานสำหรับนำไปสร้าง Test Case ใหม่
│       └── search/
│           └── TC-SEARCH_search_and_filter.md # เอกสาร Test Case ระบบค้นหา/กรอง
│
├── src/
│   ├── config/                  # ⚙️ การตั้งค่า Environment และ Constants
│   │   ├── env.js               # ตัวแปรระบบ / URLs
│   │   └── constants.js         # ค่าคงที่ เช่น Timeouts, Routes
│   ├── fixtures/                # 🧩 Custom Fixtures (Auto-inject Page Objects)
│   │   └── base.fixture.js      # Base Test Fixture (searchPage, logger)
│   ├── pages/                   # 🏛️ Page Object Model (POM)
│   │   ├── base.page.js         # Base Class รวม Safe Actions (safeClick, fillText, getText, screenshot)
│   │   └── search/
│   │       └── search.page.js   # Locators & Actions ของหน้าระบบค้นหาและตัวกรอง
│   └── utils/                   # 🛠️ Helpers & Logger
│       └── logger.js
│
├── tests/                       # 🧪 Test Scripts (แมปตรงกับ docs/testcases/ 1 ต่อ 1)
│   ├── e2e/                     # End-to-End Tests
│   │   └── search/
│   │       └── TC-SEARCH_search_and_filter.spec.js # สคริปต์ทดสอบ TC-SEARCH-01 ถึง TC-SEARCH-09
│   └── api/                     # API Tests
│       └── auth/
│           └── TC-003_api_auth.spec.js
├── robot-tests/                 # 🤖 Robot Framework + Browser Library
│   ├── resources/
│   │   └── search.resource      # Shared locators และ keywords
│   └── tests/
│       └── TC-SEARCH_search_and_filter.robot # Robot suite 9 test cases
│
├── test-data/                   # 📊 Mock Data & Datasets (JSON)
│   └── search.json              # ข้อมูลคำค้นหา, ระดับการศึกษา, หมวดวิชา, Mock Posts
│
├── .github/
│   └── workflows/
│       └── playwright.yml       # 🚀 CI/CD Pipeline (GitHub Actions)
│
├── .env.example                 # ตัวอย่าง Environment Config
├── .env                         # ค่า Config จริง
├── playwright.config.js         # การตั้งค่า Playwright (JavaScript ES Modules)
├── jsconfig.json                # JavaScript IntelliSense & Autocomplete Config
├── requirements-robot.txt       # Python dependencies สำหรับ Robot Framework
└── package.json                 # คำสั่งและ Dependencies
```

---

## 📑 Test Scenario: ระบบค้นหาและกรองโพสต์

### Test Cases (TC-SEARCH-01 ถึง TC-SEARCH-09)

| Test Case ID | Description (รายละเอียด) | Expected Result (ผลลัพธ์ที่คาดหวัง) |
| :--- | :--- | :--- |
| **TC-SEARCH-01** | ค้นหาด้วยคำค้นหาที่ถูกต้อง [Positive] | แสดงรายการโพสต์ที่ตรงกับคำค้นหา และช่องค้นหายังแสดงคำที่พิมพ์ |
| **TC-SEARCH-02** | กรองตามระดับการศึกษา [Positive] | แสดงเฉพาะโพสต์ที่มีระดับการศึกษาตรงกับตัวกรอง |
| **TC-SEARCH-03** | ตรวจรายการโพสต์ล่าสุด [Positive] | แสดงรายการโพสต์และหัวข้อโพสต์ได้ |
| **TC-SEARCH-04** | ค้นหาคำที่ไม่มีในระบบ [Negative] | แสดง Empty State และสามารถล้างตัวกรองได้ |
| **TC-SEARCH-05** | ค้นหาและกรองหลายเงื่อนไข [Positive] | แสดงโพสต์ที่ตรงทั้งคำค้นหาและระดับการศึกษา |
| **TC-SEARCH-06** | สลับ Grid/List View [Positive] | เปลี่ยนรูปแบบการแสดงผลโดยข้อมูลไม่หาย |
| **TC-SEARCH-07** | ยกเลิกตัวกรองบางรายการ [Negative] | เหลือผลลัพธ์ตามตัวกรองที่ยังเลือกอยู่ |
| **TC-SEARCH-08** | ยกเลิกตัวกรองทั้งหมด [Positive] | กลับมาแสดงโพสต์ทั้งหมด |
| **TC-SEARCH-09** | ล้างตัวกรองจาก Empty State [Negative] | ล้างคำค้นหาและตัวกรองทั้งหมด |

---

## 🧭 Workflow: วิธีนำไฟล์ `.md` มาสร้าง Test Script

```mermaid
graph LR
    A["1. วางไฟล์ .md ใน<br>docs/testcases/[module]/"] --> B["2. สร้าง/อัปเดต POM ใน<br>src/pages/[module]/"]
    B --> C["3. เขียน Test Spec ใน<br>tests/e2e/[module]/"]
    C --> D["4. รันคำสั่งทดสอบ<br>npm test"]
```

---

## 🚀 คำสั่งการรันแบบต่างๆ (NPM Commands)

| คำสั่ง | รายละเอียด |
|---|---|
| `npm test` | รันชุดทดสอบทั้งหมดแบบ Headless |
| `npm run test:search` | รันเฉพาะชุดทดสอบระบบค้นหาและกรองโพสต์ (TC-SEARCH) |
| `npm run test:tc -- TC-SEARCH-01` | รัน Playwright เฉพาะ TC ที่ระบุ |
| `npm run test:api` | รันเฉพาะ API Tests ทั้งหมด |
| `npm run test:headed` | รันแบบเปิดหน้าต่างบราวเซอร์จริงให้เห็นการทำงาน |
| `npm run test:ui` | เปิด **Playwright Interactive UI Mode** (Time Travel Debugging สะดวกมาก) |
| `npm run test:debug` | รันโหมด Debugging พร้อม Playwright Inspector |
| `npm run test:report` | เปิดดู HTML Report สรุปผลการทดสอบ พร้อมวิดีโอและ Screenshot |
| `npm run robot:install` | ติดตั้ง Robot Framework และ Chromium สำหรับ Browser Library |
| `npm run test:robot` | รัน Robot Framework suite และสร้างรายงานใน `robot-results/` |
| `npm run test:robot:tc -- TC-SEARCH-01` | รัน Robot Framework เฉพาะ TC ที่ระบุ |
| `npm run test:all` | รัน Playwright และ Robot Framework แบบเรียงลำดับเพื่อลดการแย่งทรัพยากร |
| `npm run test:chromium` | รันเฉพาะบนเบราว์เซอร์ Google Chrome / Chromium |
| `npm run test:firefox` | รันเฉพาะบน Firefox |
| `npm run test:webkit` | รันเฉพาะบน Safari WebKit |

---

## 🤖 การติดตั้งและรัน Robot Framework

Robot suite ใช้ Browser Library ซึ่งทำงานบน Playwright/Chromium และครอบคลุม TC-SEARCH-01 ถึง TC-SEARCH-09 ภายใต้ Test Scenario เดียวกัน เช่นเดียวกับชุด JavaScript

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
npm run robot:install
npm run test:robot
```

รายงานหลังรันอยู่ที่ `robot-results/report.html` และ log แบบละเอียดอยู่ที่ `robot-results/log.html` โดยสามารถกำหนด `BASE_URL` และ `HEADLESS` ผ่าน environment variables ได้
