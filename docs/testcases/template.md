# [Test Case ID]: [ชื่อเคสทดสอบ]

## 1. ข้อมูลทั่วไป (General Information)
- **Module:** [ชื่อโมดูล เช่น Auth, Dashboard, Checkout, User Management]
- **Feature:** [ชื่อฟีเจอร์ย่อย]
- **Priority:** `High` / `Medium` / `Low`
- **Test Type:** `E2E` / `Integration` / `API` / `Regression`
- **Automation Status:** `Automated` / `Pending` / `Manual`
- **Author:** [ผู้เขียน]

---

## 2. วัตถุประสงค์ (Objective)
อธิบายสั้นๆ ว่าเคสทดสอบนี้ทำเพื่อตรวจสอบอะไร

---

## 3. เงื่อนไขเบื้องต้น (Pre-conditions)
1. ผู้ใช้เปิดบราวเซอร์และเชื่อมต่อเครือข่ายเรียบร้อย
2. มีข้อมูลผู้ใช้ในระบบ หรือ Database พร้อมใช้งาน

---

## 4. ข้อมูลทดสอบ (Test Data)
| Field | Value |
|---|---|
| Username / Email | `testuser@example.com` |
| Password | `Secret123!` |

---

## 5. ขั้นตอนการทดสอบและผลลัพธ์ที่คาดหวัง (Test Steps & Expected Results)

| Step | ขั้นตอนการดำเนินการ (Action) | ข้อมูลที่ใช้ (Data) | ผลลัพธ์ที่คาดหวัง (Expected Result) |
|---|---|---|---|
| 1 | เข้าไปยังหน้า URL ทดสอบ | `BASE_URL` | หน้าเว็บโหลดสมบูรณ์ แสดง Element สำคัญครบถ้วน |
| 2 | กรอกข้อมูลในช่อง Input | [ระบุข้อมูล] | ข้อมูลถูกกรอกลงในช่องอย่างถูกต้อง |
| 3 | คลิกปุ่มดำเนินการ | คลิกปุ่ม [ชื่อปุ่ม] | ระบบทำการประมวลผลและแสดงผลลัพธ์ |
| 4 | ตรวจสอบผลลัพธ์ | - | ข้อความหรือสถานะตรงตามเกณฑ์ที่กำหนด |

---

## 6. โค้ดทดสอบที่แมป (Mapped Test Script)
- **File:** `tests/e2e/[module]/[TC-ID]_[feature].spec.ts`
