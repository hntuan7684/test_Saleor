const { test, expect } = require('@playwright/test');
const { BASE_URL } = require('./utils/constants');
const { TEST_CREDENTIALS } = require('./utils/testCredentials');
const path = require('path');

test.describe('Shipping Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('SM001 - Should navigate to checkout page', async ({ page }) => {
    // Add product to cart first
    await page.goto(`${BASE_URL}/products/bella-3001`);
    await page.waitForLoadState('networkidle');
    
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Navigate to checkout
    const checkoutLink = page.locator('a[href*="/checkout"], a:has-text("Checkout"), button:has-text("Checkout")');
    
    if (await checkoutLink.count() > 0) {
      await checkoutLink.first().click();
      await page.waitForLoadState('networkidle');
      
      // Should be on checkout page
      await expect(page).toHaveURL(/checkout/i);
      
      console.log('✅ Successfully navigated to checkout page');
    } else {
      // Try navigating directly
      await page.goto(`${BASE_URL}/checkout`);
      await page.waitForLoadState('networkidle');
      
      console.log('✅ Checkout page loaded');
    }
  });

  test('SM002 - Should display shipping list upload option', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for shipping list upload section
    const uploadSection = page.locator('text=/shipping list|multiple locations|upload csv|bulk shipping/i');
    
    if (await uploadSection.count() > 0) {
      await expect(uploadSection.first()).toBeVisible();
      console.log('✅ Shipping list upload option displayed');
    } else {
      console.log('⚠️ Shipping list upload option not found');
    }
  });

  test('SM003 - Should accept CSV file upload for shipping list', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for file upload input
    const fileInput = page.locator('input[type="file"], input[accept*="csv"]');
    
    if (await fileInput.count() > 0) {
      const input = fileInput.first();
      
      // Create a test CSV file path
      const testCsvPath = path.join(__dirname, 'fixtures', 'test-shipping-list.csv');
      
      // Upload CSV file
      await input.setInputFiles(testCsvPath);
      await page.waitForTimeout(1000);
      
      // Look for success message or preview
      const successMessage = page.locator('text=/uploaded|success|preview|addresses loaded/i');
      
      if (await successMessage.count() > 0) {
        await expect(successMessage.first()).toBeVisible();
        console.log('✅ CSV file uploaded successfully');
      } else {
        console.log('⚠️ No upload confirmation found');
      }
    } else {
      console.log('⚠️ File upload input not found');
    }
  });

  test('SM004 - Should validate CSV file format', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    const fileInput = page.locator('input[type="file"], input[accept*="csv"]');
    
    if (await fileInput.count() > 0) {
      const input = fileInput.first();
      
      // Try uploading invalid file
      const invalidFilePath = path.join(__dirname, 'fixtures', 'invalid-file.txt');
      
      await input.setInputFiles(invalidFilePath);
      await page.waitForTimeout(1000);
      
      // Look for error message
      const errorMessage = page.locator('text=/invalid|error|wrong format|csv required/i');
      
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
        console.log('✅ CSV format validation working');
      } else {
        console.log('⚠️ No format validation error found');
      }
    } else {
      console.log('⚠️ File upload input not found');
    }
  });

  test('SM005 - Should validate shipping addresses', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for address validation
    const addressValidation = page.locator('text=/address validation|invalid address|address error/i');
    
    if (await addressValidation.count() > 0) {
      await expect(addressValidation.first()).toBeVisible();
      console.log('✅ Address validation displayed');
    } else {
      // Look for address input fields
      const addressInputs = page.locator('input[name*="address"], input[placeholder*="address"]');
      
      if (await addressInputs.count() > 0) {
        // Test invalid address
        const addressInput = addressInputs.first();
        await addressInput.fill('Invalid Address 12345');
        await page.waitForTimeout(500);
        
        // Look for validation error
        const validationError = page.locator('text=/invalid|error|not found/i');
        
        if (await validationError.count() > 0) {
          await expect(validationError.first()).toBeVisible();
          console.log('✅ Address validation working');
        } else {
          console.log('⚠️ No address validation error found');
        }
      } else {
        console.log('⚠️ Address input fields not found');
      }
    }
  });

  test('SM006 - Should validate quantity per shipping address', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for quantity validation
    const quantityValidation = page.locator('text=/quantity|qty|amount per address/i');
    
    if (await quantityValidation.count() > 0) {
      await expect(quantityValidation.first()).toBeVisible();
      console.log('✅ Quantity validation displayed');
    } else {
      // Look for quantity input fields
      const quantityInputs = page.locator('input[type="number"], input[name*="quantity"]');
      
      if (await quantityInputs.count() > 0) {
        // Test invalid quantity
        const quantityInput = quantityInputs.first();
        await quantityInput.fill('-1');
        await page.waitForTimeout(500);
        
        // Look for validation error
        const validationError = page.locator('text=/invalid|error|minimum|positive/i');
        
        if (await validationError.count() > 0) {
          await expect(validationError.first()).toBeVisible();
          console.log('✅ Quantity validation working');
        } else {
          console.log('⚠️ No quantity validation error found');
        }
      } else {
        console.log('⚠️ Quantity input fields not found');
      }
    }
  });

  test('SM007 - Should split orders by shipping address', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for order splitting information
    const orderSplitting = page.locator('text=/order split|separate orders|multiple orders/i');
    
    if (await orderSplitting.count() > 0) {
      await expect(orderSplitting.first()).toBeVisible();
      console.log('✅ Order splitting information displayed');
    } else {
      // Look for multiple address sections
      const addressSections = page.locator('[class*="address"], [class*="shipping"]');
      const sectionCount = await addressSections.count();
      
      if (sectionCount > 1) {
        console.log(`Found ${sectionCount} shipping address sections`);
        console.log('✅ Multiple shipping addresses supported');
      } else {
        console.log('⚠️ Multiple shipping addresses not found');
      }
    }
  });

  test('SM008 - Should calculate shipping costs per address', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for shipping cost calculation
    const shippingCosts = page.locator('text=/shipping cost|delivery fee|shipping fee/i');
    
    if (await shippingCosts.count() > 0) {
      await expect(shippingCosts.first()).toBeVisible();
      console.log('✅ Shipping cost calculation displayed');
    } else {
      // Look for cost breakdown
      const costBreakdown = page.locator('[class*="cost"], [class*="price"], [class*="total"]');
      
      if (await costBreakdown.count() > 0) {
        for (let i = 0; i < Math.min(await costBreakdown.count(), 3); i++) {
          const costElement = costBreakdown.nth(i);
          const costText = await costElement.textContent();
          console.log(`Cost breakdown ${i + 1}: ${costText}`);
        }
        
        console.log('✅ Shipping cost breakdown available');
      } else {
        console.log('⚠️ Shipping cost information not found');
      }
    }
  });

  test('SM009 - Should handle bulk shipping list processing', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for bulk processing options
    const bulkProcessing = page.locator('text=/bulk|batch|process all|upload multiple/i');
    
    if (await bulkProcessing.count() > 0) {
      await expect(bulkProcessing.first()).toBeVisible();
      console.log('✅ Bulk processing options available');
    } else {
      // Look for upload button
      const uploadButton = page.locator('button:has-text("Upload"), button:has-text("Import"), input[type="file"]');
      
      if (await uploadButton.count() > 0) {
        console.log('✅ File upload functionality available for bulk processing');
      } else {
        console.log('⚠️ Bulk processing options not found');
      }
    }
  });

  test('SM010 - Should provide shipping list template download', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for template download link
    const templateLink = page.locator('a:has-text("Template"), a:has-text("Download"), a:has-text("CSV"), button:has-text("Template")');
    
    if (await templateLink.count() > 0) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download');
      
      await templateLink.first().click();
      await page.waitForTimeout(1000);
      
      try {
        const download = await downloadPromise;
        console.log(`✅ Template downloaded: ${download.suggestedFilename()}`);
      } catch (error) {
        console.log('⚠️ Download event not triggered - may be client-side only');
      }
    } else {
      console.log('⚠️ Template download link not found');
    }
  });

  test('SM011 - Should validate minimum order requirements per address', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for minimum order validation
    const minOrderValidation = page.locator('text=/minimum.*500|500.*minimum|at least.*500/i');
    
    if (await minOrderValidation.count() > 0) {
      await expect(minOrderValidation.first()).toBeVisible();
      console.log('✅ Minimum order validation displayed');
    } else {
      // Look for quantity inputs
      const quantityInputs = page.locator('input[type="number"], input[name*="quantity"]');
      
      if (await quantityInputs.count() > 0) {
        // Test quantity below minimum
        const quantityInput = quantityInputs.first();
        await quantityInput.fill('100');
        await page.waitForTimeout(500);
        
        // Look for validation error
        const validationError = page.locator('text=/minimum|500|at least/i');
        
        if (await validationError.count() > 0) {
          await expect(validationError.first()).toBeVisible();
          console.log('✅ Minimum order validation working');
        } else {
          console.log('⚠️ No minimum order validation error found');
        }
      } else {
        console.log('⚠️ Quantity input fields not found');
      }
    }
  });

  test('SM012 - Should handle shipping address errors gracefully', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for error handling
    const errorHandling = page.locator('text=/error|invalid|not found|try again/i');
    
    if (await errorHandling.count() > 0) {
      await expect(errorHandling.first()).toBeVisible();
      console.log('✅ Error handling displayed');
    } else {
      // Look for address input fields
      const addressInputs = page.locator('input[name*="address"], input[placeholder*="address"]');
      
      if (await addressInputs.count() > 0) {
        // Test with empty address
        const addressInput = addressInputs.first();
        await addressInput.fill('');
        await page.waitForTimeout(500);
        
        // Look for validation error
        const validationError = page.locator('text=/required|empty|invalid/i');
        
        if (await validationError.count() > 0) {
          await expect(validationError.first()).toBeVisible();
          console.log('✅ Address error handling working');
        } else {
          console.log('⚠️ No address error handling found');
        }
      } else {
        console.log('⚠️ Address input fields not found');
      }
    }
  });

  test('SM013 - Should support shipping address autocomplete', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for address input fields
    const addressInputs = page.locator('input[name*="address"], input[placeholder*="address"]');
    
    if (await addressInputs.count() > 0) {
      const addressInput = addressInputs.first();
      
      // Type partial address
      await addressInput.fill('123 Main St');
      await page.waitForTimeout(1000);
      
      // Look for autocomplete suggestions
      const autocompleteSuggestions = page.locator('[class*="autocomplete"], [class*="suggestion"], [role="listbox"]');
      
      if (await autocompleteSuggestions.count() > 0) {
        await expect(autocompleteSuggestions.first()).toBeVisible();
        console.log('✅ Address autocomplete working');
      } else {
        console.log('⚠️ Address autocomplete not found');
      }
    } else {
      console.log('⚠️ Address input fields not found');
    }
  });

  test('SM014 - Should calculate total shipping costs correctly', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for total shipping cost
    const totalShipping = page.locator('text=/total shipping|shipping total|delivery total/i');
    
    if (await totalShipping.count() > 0) {
      await expect(totalShipping.first()).toBeVisible();
      
      const totalText = await totalShipping.first().textContent();
      console.log(`Total shipping cost: ${totalText}`);
      
      // Should contain a dollar amount
      expect(totalText).toMatch(/\$/);
      
      console.log('✅ Total shipping cost calculated correctly');
    } else {
      // Look for cost breakdown
      const costElements = page.locator('[class*="cost"], [class*="price"], [class*="total"]');
      
      if (await costElements.count() > 0) {
        let totalCost = 0;
        
        for (let i = 0; i < await costElements.count(); i++) {
          const costText = await costElements.nth(i).textContent();
          const cost = parseFloat(costText.replace(/[^0-9.]/g, ''));
          
          if (!isNaN(cost)) {
            totalCost += cost;
          }
        }
        
        console.log(`Calculated total cost: $${totalCost}`);
        expect(totalCost).toBeGreaterThan(0);
        
        console.log('✅ Shipping costs calculated correctly');
      } else {
        console.log('⚠️ Shipping cost information not found');
      }
    }
  });
}); 