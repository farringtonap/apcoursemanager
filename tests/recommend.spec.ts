import { test, expect } from '@playwright/test';

test.describe('AP Recommendation Page', () => {
  test.beforeEach(async ({ page }) => {
    // maybe reset your test DB here, e.g. via API call
    await page.goto('http://localhost:3000/recommendation');
  });

  test('submitting interests yields recommendations', async ({ page }) => {
    // Fill out interests
    await page.fill('input[placeholder="e.g. calculus, robotics, AI"]', 'calculus, limits');
    // Fill out previous courses
    await page.fill('input[placeholder="e.g. Algebra II, Biology"]', 'Algebra II');
    // Fill out GPA
    await page.fill('input[id="GPA"]', '3.8');
    // Select grade level
    await page.selectOption('select[id="gradeLevel"]', '11');

    // Submit
    await page.click('button:has-text("Submit")');

    // Wait for success message
    await expect(page.locator('.alert-success')).toContainText('Profile saved');

    // Then recommendations list should appear
    // This can only work when the python server is running
    const items = await page.locator('.list-group-item').allTextContents();
    expect(items.length).toBeGreaterThan(0);
    // Optionally verify one expected class name:
    expect(items).toContain('AP Calculus AB');
  });
});
