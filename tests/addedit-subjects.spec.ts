import { test, expect } from '@playwright/test';

test.use({ storageState: 'admin-auth.json' });

test.describe('CRUD-subjects Page Acceptance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/CRUD-Subjects');
  });

  test('should load the subjects page', async ({ page }) => {
    await expect(page.getByRole('heading', {
      name: 'Add/Edit Subjects',
      level: 2,
    })).toBeVisible();
  });

  test('should show the add subject form', async ({ page }) => {
    await expect(page.getByTestId('add-subject-heading')).toBeVisible();
  });
});
