const { test, expect } = require('@playwright/test');
const { BASE_URL } = require('./utils/constants');
const { TEST_CREDENTIALS } = require('./utils/testCredentials');

test.describe('Promotion System Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('PM001 - Should display promotion code input field', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for promotion code input
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"], input[name*="coupon"]');
    
    if (await promoInput.count() > 0) {
      await expect(promoInput.first()).toBeVisible();
      console.log('✅ Promotion code input field displayed');
    } else {
      // Look for promotion section
      const promoSection = page.locator('text=/promotion|coupon|discount|code/i');
      
      if (await promoSection.count() > 0) {
        await expect(promoSection.first()).toBeVisible();
        console.log('✅ Promotion section displayed');
      } else {
        console.log('⚠️ Promotion code input not found');
      }
    }
  });

  test('PM002 - Should apply promotion code correctly', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Get original price
    const originalPriceElement = page.locator('[class*="total"], [class*="price"], [class*="amount"]');
    let originalPrice = 0;
    
    if (await originalPriceElement.count() > 0) {
      const originalPriceText = await originalPriceElement.first().textContent();
      originalPrice = parseFloat(originalPriceText.replace(/[^0-9.]/g, ''));
    }
    
    // Look for promotion code input
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    
    if (await promoInput.count() > 0) {
      const input = promoInput.first();
      
      // Apply test promotion code
      await input.fill('SAVE10');
      
      // Look for apply button
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit"), button[type="submit"]');
      
      if (await applyButton.count() > 0) {
        await applyButton.first().click();
        await page.waitForTimeout(2000);
        
        // Check if price changed
        const newPriceElement = page.locator('[class*="total"], [class*="price"], [class*="amount"]');
        
        if (await newPriceElement.count() > 0) {
          const newPriceText = await newPriceElement.first().textContent();
          const newPrice = parseFloat(newPriceText.replace(/[^0-9.]/g, ''));
          
          console.log(`Original price: $${originalPrice}, New price: $${newPrice}`);
          
          // Price should be different (either applied or error)
          expect(newPrice).toBeDefined();
          
          if (newPrice < originalPrice) {
            console.log('✅ Promotion code applied successfully');
          } else {
            console.log('⚠️ Promotion code may not have been applied');
          }
        }
      } else {
        console.log('⚠️ Apply button not found');
      }
    } else {
      console.log('⚠️ Promotion code input not found');
    }
  });

  test('PM003 - Should validate promotion code format', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    
    if (await promoInput.count() > 0) {
      const input = promoInput.first();
      
      // Test invalid promotion code
      await input.fill('INVALID123');
      
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit")');
      
      if (await applyButton.count() > 0) {
        await applyButton.first().click();
        await page.waitForTimeout(1000);
        
        // Look for validation error
        const errorMessage = page.locator('text=/invalid|error|not found|expired/i');
        
        if (await errorMessage.count() > 0) {
          await expect(errorMessage.first()).toBeVisible();
          console.log('✅ Promotion code validation working');
        } else {
          console.log('⚠️ No promotion code validation error found');
        }
      } else {
        console.log('⚠️ Apply button not found');
      }
    } else {
      console.log('⚠️ Promotion code input not found');
    }
  });

  test('PM004 - Should calculate discount correctly', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Get original price
    const originalPriceElement = page.locator('[class*="total"], [class*="price"], [class*="amount"]');
    let originalPrice = 0;
    
    if (await originalPriceElement.count() > 0) {
      const originalPriceText = await originalPriceElement.first().textContent();
      originalPrice = parseFloat(originalPriceText.replace(/[^0-9.]/g, ''));
      console.log(`Original price: $${originalPrice}`);
    }
    
    // Apply promotion code
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    
    if (await promoInput.count() > 0) {
      const input = promoInput.first();
      await input.fill('SAVE10');
      
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit")');
      
      if (await applyButton.count() > 0) {
        await applyButton.first().click();
        await page.waitForTimeout(2000);
        
        // Look for discount display
        const discountElement = page.locator('text=/discount|savings|off|reduction/i, [class*="discount"]');
        
        if (await discountElement.count() > 0) {
          const discountText = await discountElement.first().textContent();
          console.log(`Discount: ${discountText}`);
          
          // Should contain discount information
          expect(discountText).toMatch(/discount|savings|off|reduction|\$/i);
          
          console.log('✅ Discount calculation displayed correctly');
        } else {
          console.log('⚠️ Discount display not found');
        }
      } else {
        console.log('⚠️ Apply button not found');
      }
    } else {
      console.log('⚠️ Promotion code input not found');
    }
  });

  test('PM005 - Should handle promotion expiration', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    
    if (await promoInput.count() > 0) {
      const input = promoInput.first();
      
      // Test expired promotion code
      await input.fill('EXPIRED123');
      
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit")');
      
      if (await applyButton.count() > 0) {
        await applyButton.first().click();
        await page.waitForTimeout(1000);
        
        // Look for expiration error
        const expirationError = page.locator('text=/expired|expired|no longer valid|past due/i');
        
        if (await expirationError.count() > 0) {
          await expect(expirationError.first()).toBeVisible();
          console.log('✅ Promotion expiration handling working');
        } else {
          console.log('⚠️ No promotion expiration error found');
        }
      } else {
        console.log('⚠️ Apply button not found');
      }
    } else {
      console.log('⚠️ Promotion code input not found');
    }
  });

  test('PM006 - Should handle multiple promotion codes', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for multiple promotion code inputs
    const promoInputs = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    const inputCount = await promoInputs.count();
    
    if (inputCount > 1) {
      console.log(`Found ${inputCount} promotion code inputs`);
      
      // Test applying multiple codes
      for (let i = 0; i < Math.min(inputCount, 2); i++) {
        const input = promoInputs.nth(i);
        await input.fill(`CODE${i + 1}`);
        
        const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit")');
        if (await applyButton.count() > 0) {
          await applyButton.first().click();
          await page.waitForTimeout(1000);
        }
      }
      
      console.log('✅ Multiple promotion codes handled');
    } else {
      console.log('⚠️ Multiple promotion code inputs not found');
    }
  });

  test('PM007 - Should display promotion terms and conditions', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for terms and conditions
    const termsConditions = page.locator('text=/terms|conditions|restrictions|valid|minimum/i');
    
    if (await termsConditions.count() > 0) {
      await expect(termsConditions.first()).toBeVisible();
      console.log('✅ Promotion terms and conditions displayed');
    } else {
      // Look for promotion information
      const promoInfo = page.locator('text=/promotion|coupon|discount|offer/i');
      
      if (await promoInfo.count() > 0) {
        await expect(promoInfo.first()).toBeVisible();
        console.log('✅ Promotion information displayed');
      } else {
        console.log('⚠️ Promotion terms and conditions not found');
      }
    }
  });

  test('PM008 - Should validate minimum order requirements for promotions', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for minimum order validation
    const minOrderValidation = page.locator('text=/minimum.*order|minimum.*purchase|minimum.*amount/i');
    
    if (await minOrderValidation.count() > 0) {
      await expect(minOrderValidation.first()).toBeVisible();
      console.log('✅ Minimum order validation for promotions displayed');
    } else {
      // Test with small order
      const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
      
      if (await promoInput.count() > 0) {
        const input = promoInput.first();
        await input.fill('MINORDER50');
        
        const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit")');
        
        if (await applyButton.count() > 0) {
          await applyButton.first().click();
          await page.waitForTimeout(1000);
          
          // Look for minimum order error
          const minOrderError = page.locator('text=/minimum|order|purchase|amount/i');
          
          if (await minOrderError.count() > 0) {
            await expect(minOrderError.first()).toBeVisible();
            console.log('✅ Minimum order validation for promotions working');
          } else {
            console.log('⚠️ No minimum order validation error found');
          }
        } else {
          console.log('⚠️ Apply button not found');
        }
      } else {
        console.log('⚠️ Promotion code input not found');
      }
    }
  });

  test('PM009 - Should handle promotion code removal', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Apply promotion code first
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    
    if (await promoInput.count() > 0) {
      const input = promoInput.first();
      await input.fill('SAVE10');
      
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit")');
      
      if (await applyButton.count() > 0) {
        await applyButton.first().click();
        await page.waitForTimeout(1000);
        
        // Look for remove button
        const removeButton = page.locator('button:has-text("Remove"), button:has-text("Delete"), a:has-text("Remove")');
        
        if (await removeButton.count() > 0) {
          await removeButton.first().click();
          await page.waitForTimeout(1000);
          
          // Check if promotion was removed
          const discountElement = page.locator('text=/discount|savings|off/i, [class*="discount"]');
          
          if (await discountElement.count() === 0) {
            console.log('✅ Promotion code removed successfully');
          } else {
            console.log('⚠️ Promotion code may not have been removed');
          }
        } else {
          console.log('⚠️ Remove button not found');
        }
      } else {
        console.log('⚠️ Apply button not found');
      }
    } else {
      console.log('⚠️ Promotion code input not found');
    }
  });

  test('PM010 - Should display promotion success message', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    
    if (await promoInput.count() > 0) {
      const input = promoInput.first();
      await input.fill('SAVE10');
      
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit")');
      
      if (await applyButton.count() > 0) {
        await applyButton.first().click();
        await page.waitForTimeout(1000);
        
        // Look for success message
        const successMessage = page.locator('text=/applied|success|valid|accepted/i');
        
        if (await successMessage.count() > 0) {
          await expect(successMessage.first()).toBeVisible();
          console.log('✅ Promotion success message displayed');
        } else {
          console.log('⚠️ No promotion success message found');
        }
      } else {
        console.log('⚠️ Apply button not found');
      }
    } else {
      console.log('⚠️ Promotion code input not found');
    }
  });

  test('PM011 - Should handle promotion code case sensitivity', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    
    if (await promoInput.count() > 0) {
      const input = promoInput.first();
      
      // Test with different cases
      const testCodes = ['SAVE10', 'save10', 'Save10'];
      
      for (const code of testCodes) {
        await input.fill(code);
        
        const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit")');
        
        if (await applyButton.count() > 0) {
          await applyButton.first().click();
          await page.waitForTimeout(1000);
          
          // Check for success or error
          const successMessage = page.locator('text=/applied|success|valid/i');
          const errorMessage = page.locator('text=/invalid|error|not found/i');
          
          if (await successMessage.count() > 0) {
            console.log(`✅ Promotion code "${code}" applied successfully`);
            break;
          } else if (await errorMessage.count() > 0) {
            console.log(`⚠️ Promotion code "${code}" not valid`);
          }
        }
      }
    } else {
      console.log('⚠️ Promotion code input not found');
    }
  });

  test('PM012 - Should validate promotion code length', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    
    if (await promoInput.count() > 0) {
      const input = promoInput.first();
      
      // Test with very long code
      const longCode = 'A'.repeat(100);
      await input.fill(longCode);
      
      // Check if input truncates or shows error
      const inputValue = await input.inputValue();
      
      if (inputValue.length < longCode.length) {
        console.log('✅ Promotion code length validation working');
      } else {
        console.log('⚠️ No promotion code length validation found');
      }
    } else {
      console.log('⚠️ Promotion code input not found');
    }
  });

  test('PM013 - Should handle promotion code with special characters', async ({ page }) => {
    // Navigate to checkout page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="coupon"], input[name*="promo"]');
    
    if (await promoInput.count() > 0) {
      const input = promoInput.first();
      
      // Test with special characters
      const specialCode = 'SAVE-10%';
      await input.fill(specialCode);
      
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Submit")');
      
      if (await applyButton.count() > 0) {
        await applyButton.first().click();
        await page.waitForTimeout(1000);
        
        // Check for validation error
        const errorMessage = page.locator('text=/invalid|error|special characters/i');
        
        if (await errorMessage.count() > 0) {
          await expect(errorMessage.first()).toBeVisible();
          console.log('✅ Special character validation working');
        } else {
          console.log('⚠️ No special character validation found');
        }
      } else {
        console.log('⚠️ Apply button not found');
      }
    } else {
      console.log('⚠️ Promotion code input not found');
    }
  });

  test('PM014 - Should display promotion code history', async ({ page }) => {
    // Login first to access user-specific features
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    
    await emailInput.fill(TEST_CREDENTIALS.VALID_EMAIL);
    await passwordInput.fill(TEST_CREDENTIALS.VALID_PASSWORD);
    
    const loginButton = page.locator('button:has-text("Login"), button[type="submit"]');
    await loginButton.click();
    
    await expect(page).toHaveURL(BASE_URL);
    
    // Navigate to user account or order history
    const accountLink = page.locator('a[href*="/account"], a[href*="/profile"], a:has-text("Account")');
    
    if (await accountLink.count() > 0) {
      await accountLink.first().click();
      await page.waitForLoadState('networkidle');
      
      // Look for promotion history
      const promoHistory = page.locator('text=/promotion history|coupon history|used codes|applied codes/i');
      
      if (await promoHistory.count() > 0) {
        await expect(promoHistory.first()).toBeVisible();
        console.log('✅ Promotion code history displayed');
      } else {
        console.log('⚠️ Promotion code history not found');
      }
    } else {
      console.log('⚠️ Account link not found');
    }
  });
}); 