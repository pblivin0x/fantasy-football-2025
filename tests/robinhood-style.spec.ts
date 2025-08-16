import { test, expect } from '@playwright/test';

test.describe('Robinhood-style Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('hero section has centered content like Robinhood', async ({ page }) => {
    // Check hero is full viewport height
    const hero = page.locator('.relative.h-screen.w-full').first();
    await expect(hero).toBeVisible();
    
    const viewportSize = page.viewportSize();
    const heroBox = await hero.boundingBox();
    expect(heroBox?.height).toBe(viewportSize?.height);
    
    // Check text is centered
    const mainText = page.locator('h1').first();
    await expect(mainText).toBeVisible();
    const textBox = await mainText.boundingBox();
    
    if (textBox && viewportSize) {
      const centerX = textBox.x + textBox.width / 2;
      const viewportCenterX = viewportSize.width / 2;
      // Allow 50px tolerance for center alignment
      expect(Math.abs(centerX - viewportCenterX)).toBeLessThan(50);
    }
  });

  test('PB Livin character is properly positioned', async ({ page }) => {
    const sonic = page.locator('img[alt="PB Livin Sonic"]');
    await expect(sonic).toBeVisible();
    
    // Check it's on the left side
    const box = await sonic.boundingBox();
    expect(box?.x).toBeLessThan(200);
    
    // Check size is appropriate (large)
    expect(box?.width).toBeGreaterThan(250);
  });

  test('floating stats widget has proper shadow and rounded corners', async ({ page }) => {
    // Scroll to stats section
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(500);
    
    const widget = page.locator('.bg-white.rounded-2xl').first();
    await expect(widget).toBeVisible();
    
    // Check for shadow class
    const classes = await widget.getAttribute('class');
    expect(classes).toContain('shadow-');
    expect(classes).toContain('rounded-2xl');
  });

  test('show more/less functionality works smoothly', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(500);
    
    // Wait for data to load
    await page.waitForSelector('table tbody tr');
    
    // Count initial rows (should be 5)
    let rows = await page.locator('table tbody tr').count();
    expect(rows).toBeLessThanOrEqual(5);
    
    // Click show more
    const showMoreBtn = page.getByRole('button', { name: /show more/i });
    if (await showMoreBtn.isVisible()) {
      await showMoreBtn.click();
      await page.waitForTimeout(300); // Wait for animation
      
      // Should now show more rows
      rows = await page.locator('table tbody tr').count();
      expect(rows).toBeGreaterThan(5);
      
      // Click show less
      const showLessBtn = page.getByRole('button', { name: /show less/i });
      await expect(showLessBtn).toBeVisible();
      await showLessBtn.click();
      await page.waitForTimeout(300);
      
      // Back to 5 rows
      rows = await page.locator('table tbody tr').count();
      expect(rows).toBeLessThanOrEqual(5);
    }
  });

  test('animations are smooth on page load', async ({ page }) => {
    // Reload to see animations
    await page.reload();
    
    // Check for transition classes
    const animatedElements = page.locator('.transition-all');
    const count = await animatedElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Wait for animations to complete
    await page.waitForTimeout(1500);
    
    // All elements should be visible
    const sonic = page.locator('img[alt="PB Livin Sonic"]');
    await expect(sonic).toBeVisible();
    await expect(sonic).toHaveCSS('opacity', '1');
  });

  test('tab switching in stats widget is smooth', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(500);
    
    // Test all three tabs
    for (const tabName of ['Rushing', 'Passing', 'Receiving']) {
      const tab = page.getByRole('button', { name: tabName });
      await tab.click();
      await page.waitForTimeout(200);
      
      // Check tab is active
      const classes = await tab.getAttribute('class');
      if (tabName === 'Receiving') {
        expect(classes).toContain('text-gray-900');
      }
      
      // Check table updates
      await page.waitForSelector('table tbody tr');
    }
  });

  test('Hollywoo sign is visible in background', async ({ page }) => {
    // The Hollywoo image should be the background
    const bgImage = page.locator('img[alt="Hollywoo Fantasy Football"]');
    await expect(bgImage).toBeVisible();
    
    // Text should not overlap the Hollywoo sign (text is moved up)
    const mainText = page.locator('h1').first();
    const textBox = await mainText.boundingBox();
    
    // Text should be in upper portion of screen
    const viewportSize = page.viewportSize();
    if (textBox && viewportSize) {
      expect(textBox.y).toBeLessThan(viewportSize.height * 0.4);
    }
  });
});