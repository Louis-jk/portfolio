import path from 'path';
import { defineConfig, devices } from '@playwright/test';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: path.join(__dirname, '.env.local') });
loadEnv({ path: path.join(__dirname, '.env') });

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

// Reference: https://playwright.dev/docs/test-configuration
// Next.js guide: https://nextjs.org/docs/app/guides/testing/playwright
export default defineConfig({
  // Timeout per test
  timeout: 30 * 1000,
  // Test directory (matches next.js/examples/with-playwright layout)
  testDir: path.join(__dirname, 'e2e'),
  // If a test fails, retry it additional 2 times
  retries: 2,
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: 'test-results/',
  forbidOnly: !!process.env.CI,

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    // Use baseURL so navigations can be relative (e.g. page.goto('/en')).
    baseURL,
    // Retry a test if it's failing with enabled tracing.
    trace: 'retry-with-trace',
  },

  projects: process.env.CI
    ? [
        {
          name: 'Desktop Chrome',
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        {
          name: 'Desktop Chrome',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'Mobile Chrome',
          use: { ...devices['Pixel 5'] },
        },
        {
          name: 'Mobile Safari',
          use: devices['iPhone 12'],
        },
      ],
});
