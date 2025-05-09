import { test, expect } from '@playwright/test';

test.use({ storageState: 'admin-auth.json' });

test.describe('Prerequisites Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/CRUD-PreReqs');
  });

  test('should load the prerequisites page', async ({ page }) => {
    await expect(page.getByText('Add/Edit Prerequisites')).toBeVisible();
  });

  test('should show the add prerequisite form', async ({ page }) => {
    await expect(page.getByLabel('Name')).toBeVisible();
  });
});
