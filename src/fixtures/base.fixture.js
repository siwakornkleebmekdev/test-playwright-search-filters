import { test as baseTest, expect } from '@playwright/test';
import { SearchPage } from '../pages/search/search.page.js';
import { Logger } from '../utils/logger.js';

export const test = baseTest.extend({
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },

  logger: async ({}, use) => {
    await use(Logger);
  },
});

export { expect };
