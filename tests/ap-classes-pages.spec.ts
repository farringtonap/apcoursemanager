import { test, expect } from '@playwright/test';

test.use({
  storageState: 'john-auth.json',
});

test('AP Classes page and cards are visible', async ({ page }) => {
  await page.goto('http://localhost:3000/apclasses');

  // Locate the cards
  const cards = page.locator('.card');

  // Counts how many cards elements are on the page
  const cardCount = await cards.count();
  // console.log('Number of cards:', cardCount); see how many cards counted via console

  // Checks visibility of all cards
  const visibilityPromises = [];
  for (let i = 0; i < cardCount; i++) {
    const card = cards.nth(i);
    visibilityPromises.push(expect(card).toBeVisible());
  }

  // Wait for all visibility checks to complete
  await Promise.all(visibilityPromises);

  // Checks visibility for subject, description, grade levels, and prerequisites text for all cards
  const promises = [];
  for (let i = 0; i < cardCount; i++) {
    const card = cards.nth(i); // Get each card by index

    // Push the checks for subject, description, grade levels, and prerequisites visibility into promises
    promises.push(
      expect(card.locator('text=Subject:')).toBeVisible(),
      expect(card.locator('text=Description:')).toBeVisible(),
      expect(card.locator('text=Grade Levels:')).toBeVisible(),
      expect(card.locator('text=Prerequisites:')).toBeVisible(),
    );
  }

  // Wait for all promises to resolve (i.e., all checks for subject, description, grade levels, and prerequisites)
  await Promise.all(promises);
});
