import { defineConfig } from '@playwright/test';

const INLINE_EDIT_ENV_KEY = 'NEXT_PUBLIC_FEATURE_TASK_INLINE_EDIT';
const INLINE_EDIT_HEADER = 'x-taskly-inline-edit';

const inlineEditEnabled = resolveInlineEditToggle(
  process.env.PLAYWRIGHT_INLINE_EDIT || process.env.TASK_INLINE_EDIT || 'auto'
);

process.env[INLINE_EDIT_ENV_KEY] = inlineEditEnabled ? 'true' : 'false';

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4200',
    headless: !!process.env.CI,
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    extraHTTPHeaders: {
      [INLINE_EDIT_HEADER]: inlineEditEnabled ? 'enabled' : 'disabled',
    },
  },
  metadata: {
    inlineEditEnabled,
  },
  projects: [
    {
      name: inlineEditEnabled ? 'chromium-inline-edit' : 'chromium-readonly',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});

function resolveInlineEditToggle(rawValue: string | undefined): boolean {
  if (!rawValue || rawValue === 'auto') {
    return !process.env.CI;
  }

  const normalized = rawValue.trim().toLowerCase();
  if (['1', 'true', 'on', 'enabled', 'enable', 'yes'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'off', 'disabled', 'disable', 'no'].includes(normalized)) {
    return false;
  }

  return !process.env.CI;
}
