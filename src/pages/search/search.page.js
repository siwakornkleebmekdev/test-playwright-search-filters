import { BasePage } from '../base.page.js';

export class SearchPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.url = '/explore';

    // Core Locators matching real live https://share-ed-frontend-gamma.vercel.app/explore
    // Match the stable part of the placeholder. The production copy has changed
    // from "ค้นหาสรุปวิชาอะไรดี?" to "ค้นหาชื่อ เนื้อหา ผู้เขียน หรือ #แท็ก".
    this.searchInput = page.getByPlaceholder(/^ค้นหา/);
    this.postCards = page.locator('div.group.cursor-pointer, .grid > div.group, .flex.flex-col > div.group');
    this.emptyState = page.locator('text=ไม่พบโพสต์ที่ตรงกับตัวกรอง');
    this.clearFiltersButton = page.getByRole('button', { name: 'ล้างตัวกรองทั้งหมด' });
    this.gridViewBtn = page.locator('button[title="Grid View"]');
    this.listViewBtn = page.locator('button[title="List View"]');
    this.filterSection = page.locator('.sticky.top-24');
  }

  /**
   * นำทางไปยังหน้าสำรวจเนื้อหาจริง (/explore) และรอให้ข้อมูลจากเซิร์ฟเวอร์โหลดเสร็จสิ้น
   */
  async goto() {
    await this.navigate();
    await this.searchInput.waitFor({ state: 'visible' });
    // Wait for the rendered result instead of subscribing to the API response
    // after navigation, when the response may already have completed.
    await Promise.race([
      this.postCards.first().waitFor({ state: 'visible', timeout: 15000 }),
      this.emptyState.waitFor({ state: 'visible', timeout: 15000 }),
    ]);
  }

  /**
   * ค้นหา Checkbox ตามป้ายข้อความกำกับ (เช่น 'มัธยมศึกษาตอนต้น', 'ภาษาอังกฤษ')
   * @param {string} labelText
   * @returns {import('@playwright/test').Locator}
   */
  getFilterCheckbox(labelText) {
    return this.page.locator('label').filter({ hasText: labelText }).locator('input[type="checkbox"]');
  }

  /**
   * ตรวจสอบว่า Checkbox นั้นถูกเลือกอยู่หรือไม่
   * @param {string} labelText
   * @returns {Promise<boolean>}
   */
  async isCheckboxChecked(labelText) {
    const checkbox = this.getFilterCheckbox(labelText);
    return await checkbox.isChecked();
  }

  /**
   * ค้นหาโพสต์ด้วยคำค้นหา
   * @param {string} keyword
   */
  async search(keyword) {
    await this.fillText(this.searchInput, keyword, `Search keyword: "${keyword}"`);
    await this.page.waitForTimeout(500);
  }

  /**
   * ล้างคำในช่องค้นหา
   */
  async clearSearch() {
    await this.searchInput.fill('');
    await this.page.waitForTimeout(500);
  }

  /**
   * กรองระดับชั้นการศึกษา
   * @param {string} levelName
   */
  async filterByEducationLevel(levelName) {
    const checkbox = this.getFilterCheckbox(levelName);
    await checkbox.check();
    await this.page.waitForTimeout(500);
  }

  /**
   * กรองหมวดหมู่วิชา
   * @param {string} subjectName
   */
  async filterBySubject(subjectName) {
    const checkbox = this.getFilterCheckbox(subjectName);
    await checkbox.check();
    await this.page.waitForTimeout(500);
  }

  /**
   * ยกเลิกการเลือกตัวกรอง
   * @param {string} filterName
   */
  async uncheckFilter(filterName) {
    const checkbox = this.getFilterCheckbox(filterName);
    await checkbox.uncheck();
    await this.page.waitForTimeout(500);
  }

  /**
   * สลับมุมมองการแสดงผลโพสต์ ('grid' หรือ 'list')
   * @param {'grid' | 'list'} mode
   */
  async switchViewMode(mode) {
    if (mode === 'list') {
      await this.safeClick(this.listViewBtn, 'Switch to List View');
    } else {
      await this.safeClick(this.gridViewBtn, 'Switch to Grid View');
    }
    await this.page.waitForTimeout(500);
  }

  /**
   * คลิกปุ่ม "ล้างตัวกรองทั้งหมด" ใน Empty State
   */
  async clickClearFilters() {
    await this.safeClick(this.clearFiltersButton, 'Click "ล้างตัวกรองทั้งหมด"');
    await this.page.waitForTimeout(500);
  }

  /**
   * ดึงค่าที่อยู่ในช่องค้นหาปัจจุบัน
   * @returns {Promise<string>}
   */
  async getSearchValue() {
    return await this.searchInput.inputValue();
  }

  /**
   * ดึงจำนวนการ์ดโพสต์ที่แสดงอยู่ทั้งหมด
   * @returns {Promise<number>}
   */
  async getPostCount() {
    return await this.postCards.count();
  }

  /**
   * ดึงชื่อหัวข้อของการ์ดแรก
   * @returns {import('@playwright/test').Locator}
   */
  getFirstPostTitle() {
    return this.postCards.first().locator('h3');
  }

  /**
   * ดึงองค์ประกอบการ์ดโพสต์แรก
   * @returns {import('@playwright/test').Locator}
   */
  getFirstPost() {
    return this.postCards.first();
  }

  /**
   * ดึงรายการชื่อโพสต์ทั้งหมดตามลำดับที่แสดงผลใน UI
   * @returns {Promise<string[]>}
   */
  async getAllPostTitles() {
    const titlesLocator = this.postCards.locator('h3');
    return await titlesLocator.allInnerTexts();
  }

  /**
   * ดึงข้อความ Empty State
   * @returns {Promise<string>}
   */
  async getEmptyStateText() {
    await this.emptyState.waitFor({ state: 'visible' });
    return await this.getText(this.emptyState);
  }
}
