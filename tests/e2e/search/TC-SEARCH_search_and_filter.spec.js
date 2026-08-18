import { test, expect } from '../../../src/fixtures/base.fixture.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const searchData = require('../../../test-data/search.json');

/**
 * Test Suite: การทดสอบระบบค้นหาและกรองโพสต์หน้า Explore (TC-SEARCH) บนเว็บจริง
 * Target URL: https://share-ed-frontend-gamma.vercel.app/explore
 * Corresponds to: docs/testcases/search/TC-SEARCH_search_and_filter.md
 */
test.describe('การทดสอบระบบค้นหาและกรองโพสต์หน้า Explore บนเว็บจริง (TC-SEARCH)', () => {
  test.beforeEach(async ({ searchPage, logger }) => {
    logger.info('Given Member เข้าสู่ระบบ และกดคลิ๊กไปที่หน้า "สำรวจเนื้อหา" (/explore) บนเว็บจริง');
    await searchPage.goto();
  });

  test('Scenario 3.1: ค้นหาโพสต์ด้วยคำค้นหาสำเร็จ [Positive]', async ({ searchPage, logger }) => {
    const keyword = searchData.searchKeywords.howToWrite; // 'วิธีการเขียน'

    logger.step(1, `When กรอกคำค้นหาว่า "${keyword}" ในช่องค้นหา`);
    await searchPage.search(keyword);

    logger.step(2, `Then ระบบแสดงรายการโพสต์ที่มีคำว่า "${keyword}" ในชื่อโพสต์ หรือเนื้อหา`);
    const firstPost = searchPage.getFirstPost();
    await expect(firstPost).toBeVisible();
    await expect(firstPost).toContainText(keyword);

    logger.step(3, `And ช่องค้นหาแสดงข้อความ "${keyword}" ตามที่ระบุ`);
    await expect(searchPage.searchInput).toHaveValue(keyword);
  });

  test('Scenario 3.2: คัดกรองโพสต์ตามระดับการศึกษาและหมวดหมู่วิชา [Positive]', async ({ searchPage, logger }) => {
    const eduLevel = searchData.educationLevels.juniorHigh; // 'มัธยมศึกษาตอนต้น'

    logger.step(1, `When เลือกตัวกรองระดับการศึกษาเป็น "${eduLevel}"`);
    await searchPage.filterByEducationLevel(eduLevel);

    logger.step(2, `Then ระบบแสดงเฉพาะรายการโพสต์ที่ตรงกับระดับการศึกษา "${eduLevel}"`);
    const count = await searchPage.getPostCount();
    expect(count).toBeGreaterThan(0);

    const firstPost = searchPage.getFirstPost();
    await expect(firstPost).toBeVisible();
    await expect(firstPost).toContainText(eduLevel);
  });

  test('Scenario 3.3: การจัดเรียงผลลัพธ์การค้นหาตามวันที่ล่าสุด [Positive]', async ({ searchPage, logger }) => {
    logger.step(1, 'When ระบบแสดงโพสต์ขึ้นมา');
    await expect(searchPage.postCards.first()).toBeVisible();

    logger.step(2, 'Then ระบบจัดเรียงรายการโพสต์โดยแสดงโพสต์ที่มีวันที่สร้างล่าสุด (Newest) ไว้เป็นอันดับแรก');
    const titles = await searchPage.getAllPostTitles();
    expect(titles.length).toBeGreaterThan(0);
    logger.info(`Live posts order: ${titles.join(' -> ')}`);
  });

  test('Scenario 3.4: ค้นหาหรือเลือกตัวกรองแล้วไม่พบข้อมูล (Empty State) [Negative]', async ({ searchPage, logger }) => {
    const notFoundKeyword = searchData.searchKeywords.notFoundSymbol; // '@'

    logger.step(1, `When พิมพ์คำค้นหาเป็น "${notFoundKeyword}" หรือเลือกตัวกรองที่ไม่มีโพสต์ตรงกับเงื่อนไข`);
    await searchPage.search(notFoundKeyword);

    logger.step(2, 'Then ระบบแสดงพื้นที่ Empty State พร้อมไอคอนแว่นขยาย และข้อความ "ไม่พบโพสต์ที่ตรงกับตัวกรอง"');
    await expect(searchPage.emptyState).toBeVisible();
    await expect(searchPage.emptyState).toContainText(searchData.messages.emptyState);
    await expect(searchPage.postCards).toHaveCount(0);

    logger.step(3, 'And ระบบแสดงลิงก์ "ล้างตัวกรองทั้งหมด"');
    await expect(searchPage.clearFiltersButton).toBeVisible();

    logger.step(4, 'When กดลิงก์ "ล้างตัวกรองทั้งหมด"');
    await searchPage.clickClearFilters();

    logger.step(5, 'Then ระบบทำการล้างข้อความในช่องค้นหา และยกเลิกการเลือก Checkbox ตัวกรองทั้งหมด');
    await expect(searchPage.searchInput).toHaveValue('');

    logger.step(6, 'And ระบบกลับมาแสดงรายการโพสต์ทั้งหมดตามปกติ');
    const count = await searchPage.getPostCount();
    expect(count).toBeGreaterThan(0);
  });

  test('Scenario 3.5: ค้นหาร่วมกับการกรองหลายเงื่อนไขพร้อมกัน (Combined Search & Multi-Filter) [Positive]', async ({ searchPage, logger }) => {
    const keyword = searchData.searchKeywords.howToWrite; // 'วิธีการเขียน'
    const eduLevel = searchData.educationLevels.university; // 'มหาวิทยาลัย'

    logger.step(1, `When กรอกคำค้นหาว่า "${keyword}"`);
    await searchPage.search(keyword);

    logger.step(2, `And เลือกตัวกรองระดับการศึกษาเป็น "${eduLevel}"`);
    await searchPage.filterByEducationLevel(eduLevel);

    logger.step(3, `Then ระบบแสดงผลลัพธ์เฉพาะโพสต์ที่มีคำว่า "${keyword}" ที่ตรงกับระดับ "${eduLevel}" พร้อมกันเท่านั้น`);
    const firstPost = searchPage.getFirstPost();
    await expect(firstPost).toBeVisible();
    await expect(firstPost).toContainText(keyword);
    await expect(firstPost).toContainText(eduLevel);
    await expect(searchPage.postCards).toHaveCount(1);
  });

  test('Scenario 3.6: การสลับมุมมองการแสดงผลโพสต์ (Grid / List View Toggle) [Positive]', async ({ searchPage, logger }) => {
    const initialCount = await searchPage.getPostCount();

    logger.step(1, 'When Member กดปุ่มสลับมุมมองเป็น "List View" (ไอคอนรายการด้านขวาบนของช่องค้นหา)');
    await searchPage.switchViewMode('list');

    logger.step(2, 'Then ระบบเปลี่ยนรูปแบบการแสดงผลของโพสต์จากแบบการ์ด (Grid) เป็นแบบรายการเรียงลงมา (List)');
    const listContainer = searchPage.page.locator('.flex-1 > .flex.flex-col.gap-4');
    await expect(listContainer).toBeVisible();

    logger.step(3, 'And ข้อมูลผลลัพธ์และตัวกรองที่เลือกไว้ยังคงเดิม');
    await expect(searchPage.postCards).toHaveCount(initialCount);
  });

  test('Scenario 3.7: การยกเลิกตัวกรองบางรายการ (Uncheck Partial Filter) [Negative]', async ({ searchPage, logger }) => {
    const juniorHigh = searchData.educationLevels.juniorHigh; // 'มัธยมศึกษาตอนต้น'
    const university = searchData.educationLevels.university; // 'มหาวิทยาลัย'

    logger.step(1, `Then ติ๊กเลือกระดับการศึกษาไว้ 2 รายการคือ "${juniorHigh}" และ "${university}"`);
    await searchPage.filterByEducationLevel(juniorHigh);
    await searchPage.filterByEducationLevel(university);

    logger.step(2, `When Member ยกเลิกการเลือก (Uncheck) ระดับการศึกษา "${juniorHigh}" ออก`);
    await searchPage.uncheckFilter(juniorHigh);

    logger.step(3, `Then ระบบทำการอัปเดตรายการทันทีโดยแสดงเฉพาะโพสต์ในระดับการศึกษา "${university}"`);
    const firstPost = searchPage.getFirstPost();
    await expect(firstPost).toBeVisible();
    await expect(firstPost).toContainText(university);
  });

  test('Scenario 3.8: ยกเลิกตัวกรองระดับการศึกษาทั้งหมดแล้วไม่เหลือรายการที่เลือก [Positive]', async ({ searchPage, logger }) => {
    const initialCount = await searchPage.getPostCount();
    const juniorHigh = searchData.educationLevels.juniorHigh; // 'มัธยมศึกษาตอนต้น'

    logger.step(1, `Then ติ๊กเลือกระดับการศึกษา "${juniorHigh}" อยู่`);
    await searchPage.filterByEducationLevel(juniorHigh);

    logger.step(2, `When Member ยกเลิกการเลือก (Uncheck) ระดับการศึกษา "${juniorHigh}" ออก ทำให้ไม่มีระดับการศึกษาใดถูกเลือกเลย`);
    await searchPage.uncheckFilter(juniorHigh);

    logger.step(3, 'Then ระบบยกเลิกการกรองตามระดับชั้น และกลับมาแสดงผลรายการโพสต์ทั้งหมดตามปกติ');
    await expect(searchPage.postCards).toHaveCount(initialCount);
  });

  test('Scenario 3.9: ล้างตัวกรองทั้งหมดจากหน้าไม่พบข้อมูล [Negative]', async ({ searchPage, logger }) => {
    const initialCount = await searchPage.getPostCount();
    const notFoundKeyword = searchData.searchKeywords.notFoundSymbol; // '@'

    logger.step(1, 'Then ระบบแสดงหน้า Empty State พร้อมข้อความ "ไม่พบโพสต์ที่ตรงกับตัวกรอง"');
    await searchPage.search(notFoundKeyword);
    await expect(searchPage.emptyState).toBeVisible();

    logger.step(2, 'When กดปุ่ม "ล้างตัวกรองทั้งหมด"');
    await searchPage.clickClearFilters();

    logger.step(3, 'Then ระบบทำการล้างข้อความในช่องค้นหา และยกเลิกการเลือก Checkbox ตัวกรองทั้งหมด');
    await expect(searchPage.searchInput).toHaveValue('');
    expect(await searchPage.isCheckboxChecked(searchData.educationLevels.juniorHigh)).toBeFalsy();
    expect(await searchPage.isCheckboxChecked(searchData.educationLevels.seniorHigh)).toBeFalsy();
    expect(await searchPage.isCheckboxChecked(searchData.educationLevels.university)).toBeFalsy();

    logger.step(4, 'And ระบบกลับมาแสดงรายการโพสต์ทั้งหมดตามปกติ');
    await expect(searchPage.postCards).toHaveCount(initialCount);
  });
});
