// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* Executar sem paralelismo para facilitar o diagnóstico */
  fullyParallel: false,

  /* Força apenas um worker */
  workers: 1,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: false }],
    ['junit', { outputFile: 'results.xml' }]
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like await page.goto('/') */
    baseURL: 'https://pgats-ci-example.netlify.app',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});