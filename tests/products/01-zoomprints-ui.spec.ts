import { test, expect, Page } from '@playwright/test';

test.describe('ZoomPrints - Final Stable Tests', () => {
  // Helper function to wait for page to be ready
  async function waitForPageReady(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    // Wait for main content to appear
    await page.waitForSelector('text=EXPERTS IN PROMOTIONAL APPAREL PRODUCTS', { timeout: 30000 });
  }

  // Helper function to navigate to homepage
  async function navigateToHomepage(page: Page) {
    await page.goto('https://storefront-dev.mypodsoftware.io.vn/us', { 
      timeout: 90000,
      waitUntil: 'domcontentloaded' 
    });
    await waitForPageReady(page);
  }

  test.beforeEach(async ({ page }) => {
    // Set longer timeout for this operation
    test.setTimeout(120000);
    await navigateToHomepage(page);
  });

  test('should display correct homepage content for anonymous users', async ({ page }) => {
    test.setTimeout(120000);
    
    // Verify homepage loads correctly
    await expect(page).toHaveTitle(/ZoomPrints/i);
    
    // Verify login button is present for anonymous users
    await expect(page.locator('svg.lucide-user')).toBeVisible({ timeout: 20000 });
    
    // Verify main content sections
    await expect(page.locator('text=EXPERTS IN PROMOTIONAL APPAREL PRODUCTS')).toBeVisible();
    await expect(page.locator('text=Our Top Products')).toBeVisible({ timeout: 20000 });
    
    // Verify contact information
    await expect(page.locator('text=info@mypodsoftware.io.vn')).toBeVisible({ timeout: 20000 });
  });

  test('should display navigation menu correctly', async ({ page }) => {
    test.setTimeout(120000);
    
    // Verify main navigation elements exist
    const navigationItems = [
      'Home',
      'About', 
      'Shop',
      'Support'
    ];
    
    for (const item of navigationItems) {
      // Use flexible selector that checks for text content
      await expect(page.locator(`text="${item}"`).first()).toBeVisible({ timeout: 20000 });
    }
    
    // Verify shopping cart indicator
    await expect(page.locator('text=0 items in cart')).toBeVisible({ timeout: 20000 });
  });

  test('should display top products section', async ({ page }) => {
    test.setTimeout(120000);
    
    // Verify products section header
    await expect(page.locator('text=Our Top Products')).toBeVisible({ timeout: 20000 });
    
    // Verify some popular products are displayed
    const popularProducts = [
      'Bella Canvas 3001',
      'GILDAN 5000',
      'Comfort Colors'
    ];
    
    for (const product of popularProducts) {
      await expect(page.locator(`text="${product}"`)).toBeVisible({ timeout: 20000 });
    }
    
    // Verify "Learn more" links are present
    await expect(page.locator('text=Learn more').first()).toBeVisible({ timeout: 20000 });
  });

  test('should handle basic page interactions without errors', async ({ page }) => {
    test.setTimeout(120000);
    
    // Test scrolling to different sections
    await page.locator('text=Our Top Products').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Our Top Products')).toBeVisible({ timeout: 20000 });
    
    await page.locator('text=Our Mission').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Our Mission')).toBeVisible({ timeout: 20000 });
    
    await page.locator('text=Contact Us').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Contact Us')).toBeVisible({ timeout: 20000 });
    
    // Scroll back to top
    await page.locator('text=EXPERTS IN PROMOTIONAL APPAREL PRODUCTS').scrollIntoViewIfNeeded();
    await expect(page.locator('text=EXPERTS IN PROMOTIONAL APPAREL PRODUCTS')).toBeVisible({ timeout: 20000 });
  });

  test('should load page performance within acceptable time', async ({ page }) => {
    test.setTimeout(120000);
    
    const startTime = Date.now();
    
    // Navigate to homepage and wait for key content
    await page.goto('https://storefront-dev.mypodsoftware.io.vn/us', { timeout: 90000 });
    await page.waitForSelector('text=EXPERTS IN PROMOTIONAL APPAREL PRODUCTS', { timeout: 30000 });
    
    const loadTime = Date.now() - startTime;
    
    // Verify page loaded within reasonable time (60 seconds)
    expect(loadTime).toBeLessThan(60000);
    
    // Verify critical content is present
    await expect(page.locator('text=Our Top Products')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('svg.lucide-user')).toBeVisible({ timeout: 20000 });
  });

  test('should verify core business information is displayed', async ({ page }) => {
    test.setTimeout(120000);
    
    // Verify company tagline
    await expect(page.locator('text=EXPERTS IN PROMOTIONAL APPAREL PRODUCTS')).toBeVisible({ timeout: 20000 });
    
    // Verify key value propositions
    const valueProps = [
      'Highest Quality',
      'Speed',
      'Competitive Pricing'
    ];
    
    for (const prop of valueProps) {
      await expect(page.locator(`text="${prop}"`)).toBeVisible({ timeout: 20000 });
    }
    
    // Verify mission statement section
    await expect(page.locator('text=Our Mission')).toBeVisible({ timeout: 20000 });
    
    // Verify B2B focus
    await expect(page.locator('text=B2B PRINTING FOR')).toBeVisible({ timeout: 20000 });
  });
});
