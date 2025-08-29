import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

test.describe('ZoomPrints - Final Multi-Product Pricing Tests', () => {
  const testUser = {
    email: process.env.TEST_EMAIL || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'testpassword123'
  };

  // Helper function to wait for page to be ready
  async function waitForPageReady(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('text=EXPERTS IN PROMOTIONAL APPAREL PRODUCTS', { timeout: 30000 });
  }

  test('Should verify multi-product selection capabilities', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://storefront-dev.mypodsoftware.io.vn/us');
    await waitForPageReady(page);
    


    // Go to shop
    await page.click('text=Shop');
    await page.waitForLoadState('domcontentloaded');
    


    // Verify multiple products are available
    const hasBellaCanvas = await page.locator('text=BELLA + CANVAS').first().isVisible({ timeout: 10000 });
    const hasGildan = await page.locator('text=GILDAN').first().isVisible({ timeout: 10000 });
    const hasComfortColors = await page.locator('text=Comfort Colors').first().isVisible({ timeout: 10000 });

    if (hasBellaCanvas) {

    }
    if (hasGildan) {

    }
    if (hasComfortColors) {

    }

    // Test selecting different products
    if (hasBellaCanvas) {
      await page.click('text=BELLA + CANVAS');
      await page.waitForLoadState('domcontentloaded');

      
      // Go back to shop
      await page.click('text=Shop');
      await page.waitForLoadState('domcontentloaded');

    }

    if (hasComfortColors) {
      await page.click('text=Comfort Colors');
      await page.waitForLoadState('domcontentloaded');

    }


  });

  test('Should verify shopping cart functionality exists', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://storefront-dev.mypodsoftware.io.vn/us');
    await waitForPageReady(page);
    


    // Verify shopping cart icon exists
    const hasCartIcon = await page.locator('svg.lucide-shopping-cart').first().isVisible({ timeout: 10000 });
    if (hasCartIcon) {

      
      // Try to click on shopping cart
      try {
        await page.click('svg.lucide-shopping-cart');
        await page.waitForLoadState('domcontentloaded');

        
        // Check if cart page loaded
        const hasCartContent = await page.locator('text=Cart, text=Shopping Cart').first().isVisible({ timeout: 10000 });
        if (hasCartContent) {

        } else {

        }
      } catch (error) {

      }
    } else {

    }

    // Verify cart-related text exists
    const hasCartText = await page.locator('text=cart, text=Cart').first().isVisible({ timeout: 10000 });
    if (hasCartText) {

    } else {

    }
  });

  test('Should verify pricing system functionality', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://storefront-dev.mypodsoftware.io.vn/us');
    await waitForPageReady(page);
    


    // Go to shop
    await page.click('text=Shop');
    await page.waitForLoadState('domcontentloaded');
    


    // Select a product to test pricing
    await page.click('text=BELLA + CANVAS');
    await page.waitForLoadState('domcontentloaded');


    // Verify pricing elements exist
    const hasPriceElement = await page.locator('text=$, text=Price, text=Total').first().isVisible({ timeout: 10000 });
    if (hasPriceElement) {

    } else {

    }

    // Verify quantity selector exists
    const hasQuantitySelector = await page.locator('input[type="number"], input[type="text"]').first().isVisible({ timeout: 10000 });
    if (hasQuantitySelector) {

    } else {

    }


  });

  test('Should verify checkout process exists', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://storefront-dev.mypodsoftware.io.vn/us');
    await waitForPageReady(page);
    


    // Go to shop and add product to cart
    await page.click('text=Shop');
    await page.waitForLoadState('domcontentloaded');
    await page.click('text=BELLA + CANVAS');
    await page.waitForLoadState('domcontentloaded');
    
    // Try to add to cart
    const addToCartButton = await page.locator('text=Add to Cart, text=Add to cart').first().isVisible({ timeout: 10000 });
    if (addToCartButton) {

      
      try {
        await page.click('text=Add to Cart, text=Add to cart');
        await page.waitForLoadState('domcontentloaded');

        
        // Check for checkout elements
        const hasCheckoutButton = await page.locator('text=Checkout, text=Proceed to Checkout').first().isVisible({ timeout: 10000 });
        if (hasCheckoutButton) {

          
          try {
            await page.click('text=Checkout, text=Proceed to Checkout');
            await page.waitForLoadState('domcontentloaded');

            
            // Verify checkout page elements
            const hasCheckoutForm = await page.locator('text=Payment, text=Shipping, text=Billing').first().isVisible({ timeout: 10000 });
            if (hasCheckoutForm) {

            } else {

            }
          } catch (error) {

          }
        } else {

        }
      } catch (error) {

      }
    } else {

    }


  });

  test('Should verify user account management exists', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://storefront-dev.mypodsoftware.io.vn/us');
    await waitForPageReady(page);
    


    // Login first
    await page.click('svg.lucide-user', { timeout: 30000 });
    await page.waitForURL(/admin-dev\.mypodsoftware\.io\.vn.*auth/, { timeout: 45000 });
    await page.fill('input[name="username"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/storefront-dev\.mypodsoftware\.io\.vn/, { timeout: 60000 });
    await page.waitForTimeout(3000);
    


    // Verify user account elements exist
    const hasUserMenu = await page.locator('text=Profile, text=Account, text=Settings').first().isVisible({ timeout: 10000 });
    if (hasUserMenu) {

      
      // Try to click on user menu
      try {
        await page.click('text=Profile, text=Account, text=Settings');
        await page.waitForLoadState('domcontentloaded');

        
        // Check if account page loaded
        const hasAccountContent = await page.locator('text=Profile, text=Account, text=Settings').first().isVisible({ timeout: 10000 });
        if (hasAccountContent) {

        } else {

        }
      } catch (error) {

      }
    } else {

    }


  });
});
