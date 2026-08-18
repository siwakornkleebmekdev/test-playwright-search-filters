import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://demo.playwright.dev/todomvc/',
  API_BASE_URL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  TEST_USER_EMAIL: process.env.TEST_USER_EMAIL || 'testuser@example.com',
  TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD || 'SecretPassword123!',
  IS_CI: !!process.env.CI,
};
