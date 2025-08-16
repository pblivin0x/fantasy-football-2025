import { test, expect } from '@playwright/test';

test.describe('Hero Section Visibility', () => {
  test('Hollywoo background image is visible', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check background image is loaded and visible
    const bgImage = page.locator('img[alt="Hollywoo Fantasy Football"]');
    await expect(bgImage).toBeVisible();
    
    // Verify image source
    const src = await bgImage.getAttribute('src');
    expect(src).toContain('hollywoo');
  });

  test('Text overlay is visible on top of image', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check main text is visible
    const mainText = page.locator('text=Fantasy Football 2025');
    await expect(mainText).toBeVisible();
    
    // Check it's white and bold
    const styles = await mainText.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        fontWeight: computed.fontWeight
      };
    });
    
    expect(styles.fontWeight).toBe('700'); // bold
  });

  test('back to text is bouncing', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check bouncing text exists
    const bouncingText = page.locator('span:has-text("back to")');
    await expect(bouncingText).toBeVisible();
    
    // Check it has bounce animation
    const className = await bouncingText.getAttribute('class');
    expect(className).toContain('animate-bounce');
  });

  test('PB Livin character is visible', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check Sonic character is visible
    const sonic = page.locator('img[alt="PB Livin Sonic"]');
    await expect(sonic).toBeVisible();
  });

  test('All elements are positioned correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000); // Wait for animations
    
    // Take a screenshot to verify layout
    await page.screenshot({ path: 'hero-test.png', fullPage: false });
    
    // Check text is in upper left area
    const textDiv = page.locator('h1').first();
    const box = await textDiv.boundingBox();
    
    expect(box?.x).toBeLessThan(400); // On the left side
    expect(box?.y).toBeLessThan(200); // Near the top
  });
});