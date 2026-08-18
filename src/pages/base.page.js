import { Logger } from '../utils/logger.js';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = '';
  }

  /**
   * Navigate to the page url
   * @param {string} [path]
   */
  async navigate(path) {
    let targetUrl;
    if (path !== undefined) {
      targetUrl = path;
    } else {
      targetUrl = this.url || '/';
    }
    Logger.info(`Navigating to ${targetUrl || 'baseURL'}`, this.constructor.name);
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Safe click on element with auto wait and visibility check
   * @param {import('@playwright/test').Locator} locator
   * @param {string} [description]
   */
  async safeClick(locator, description) {
    if (description) {
      Logger.info(`Clicking: ${description}`, this.constructor.name);
    }
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill input with text
   * @param {import('@playwright/test').Locator} locator
   * @param {string} text
   * @param {string} [description]
   */
  async fillText(locator, text, description) {
    if (description) {
      Logger.info(`Filling ${description}`, this.constructor.name);
    }
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  /**
   * Get text content from locator safely
   * @param {import('@playwright/test').Locator} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent())?.trim() || '';
  }

  /**
   * Take screenshot with custom name
   * @param {string} name
   * @returns {Promise<Buffer>}
   */
  async takeScreenshot(name) {
    Logger.info(`Taking screenshot: ${name}`, this.constructor.name);
    return await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Get current browser URL
   * @returns {string}
   */
  getCurrentUrl() {
    return this.page.url();
  }
}
