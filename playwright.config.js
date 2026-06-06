// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 15000,
  expect: {
    timeout: 5000,
  },

  /* Run independent tests in parallel. */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Keep CI fast and expose failures immediately. */
  retries: 0,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: false }],
    ['junit', { outputFile: 'results.xml' }],
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like await page.goto('/') */
    baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'node scripts/static-server.js',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
