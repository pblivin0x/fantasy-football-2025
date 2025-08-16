import { test, expect } from '@playwright/test';

test.describe('Visual Appearance', () => {
  test('hero section is full screen', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const hero = page.locator('.relative.h-screen.w-full');
    await expect(hero).toBeVisible();
    
    const viewportSize = page.viewportSize();
    const heroBox = await hero.boundingBox();
    
    expect(heroBox?.height).toBe(viewportSize?.height);
    expect(heroBox?.width).toBe(viewportSize?.width);
  });

  test('text has proper contrast', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('table');
    
    // Check header text contrast
    const headerColor = await page.locator('h2').first().evaluate(el => 
      window.getComputedStyle(el).color
    );
    expect(headerColor).toBe('rgb(17, 24, 39)'); // text-gray-900
    
    // Check table text contrast
    const tableText = await page.locator('td').first().evaluate(el => 
      window.getComputedStyle(el).color
    );
    expect(tableText).toBe('rgb(31, 41, 55)'); // text-gray-800
  });

  test('shows only essential columns', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('table');
    
    const headers = await page.locator('th').allTextContents();
    
    expect(headers).toEqual([
      'Player',
      'Targets', 
      'Receptions',
      'Yards',
      'TDs'
    ]);
  });

  test('data is limited to 30 rows', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('table');
    
    const rows = await page.locator('tbody tr').count();
    expect(rows).toBeLessThanOrEqual(30);
  });

  test('font sizes are readable', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('table');
    
    const fontSize = await page.locator('td').first().evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    expect(fontSize).toBe('14px'); // text-sm
  });
});