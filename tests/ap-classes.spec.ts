import { test, expect } from '@playwright/test';

test.use({ storageState: 'admin-auth.json' });

test.describe('AP Classes Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/CRUD-Classes');
  });

  test('should load the AP Classes page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Add AP Class' })).toBeVisible();
  });

  test('should display the Add form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Add AP Class' })).toBeVisible();
  
    const textInputs = page.locator('input[type="text"]');
    await expect(textInputs.first()).toBeVisible();
  
    await expect(page.locator('input[type="email"]')).toBeVisible();
  
    await expect(page.locator('label').filter({ hasText: 'Offered' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Subject Type' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Description' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Pre-Requisites' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Grade Levels' })).toBeVisible();
  
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});
