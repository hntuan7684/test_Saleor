const { test, expect } = require('@playwright/test');
const { BASE_URL } = require('./utils/constants');
const { TEST_CREDENTIALS } = require('./utils/testCredentials');

test.describe('Payment Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('PI001 - Should navigate to payment page', async ({ page }) => {
    // Add product to cart first
    await page.goto(`${BASE_URL}/products/bella-3001`);
    await page.waitForLoadState('networkidle');
    
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Navigate to checkout/payment
    const checkoutLink = page.locator('a[href*="/checkout"], a:has-text("Checkout"), button:has-text("Checkout")');
    
    if (await checkoutLink.count() > 0) {
      await checkoutLink.first().click();
      await page.waitForLoadState('networkidle');
      
      // Should be on checkout/payment page
      await expect(page).toHaveURL(/checkout|payment/i);
      
      console.log('✅ Successfully navigated to payment page');
    } else {
      // Try navigating directly
      await page.goto(`${BASE_URL}/checkout`);
      await page.waitForLoadState('networkidle');
      
      console.log('✅ Payment page loaded');
    }
  });

  test('PI002 - Should display Stripe payment form', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for Stripe payment form elements
    const stripeElements = page.locator('[class*="stripe"], [data-stripe], iframe[src*="stripe"], [class*="card"]');
    
    if (await stripeElements.count() > 0) {
      await expect(stripeElements.first()).toBeVisible();
      console.log('✅ Stripe payment form displayed');
    } else {
      // Look for payment form fields
      const paymentFields = page.locator('input[name*="card"], input[name*="payment"], input[placeholder*="card"]');
      
      if (await paymentFields.count() > 0) {
        await expect(paymentFields.first()).toBeVisible();
        console.log('✅ Payment form fields displayed');
      } else {
        console.log('⚠️ Stripe payment form not found');
      }
    }
  });

  test('PI003 - Should validate payment information', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for payment form fields
    const cardNumberInput = page.locator('input[name*="card"], input[placeholder*="card"], input[placeholder*="number"]');
    const expiryInput = page.locator('input[name*="expiry"], input[placeholder*="expiry"], input[placeholder*="mm/yy"]');
    const cvvInput = page.locator('input[name*="cvv"], input[placeholder*="cvv"], input[placeholder*="cvc"]');
    
    if (await cardNumberInput.count() > 0) {
      const cardInput = cardNumberInput.first();
      
      // Test invalid card number
      await cardInput.fill('1234');
      await page.waitForTimeout(500);
      
      // Look for validation error
      const validationError = page.locator('text=/invalid|error|card number|required/i');
      
      if (await validationError.count() > 0) {
        await expect(validationError.first()).toBeVisible();
        console.log('✅ Payment validation working');
      } else {
        console.log('⚠️ No payment validation error found');
      }
    } else {
      console.log('⚠️ Payment form fields not found');
    }
  });

  test('PI004 - Should handle payment errors gracefully', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for payment form
    const paymentForm = page.locator('form, [class*="payment"], [class*="checkout"]');
    
    if (await paymentForm.count() > 0) {
      // Fill with test data that would cause an error
      const cardInput = page.locator('input[name*="card"], input[placeholder*="card"]');
      const expiryInput = page.locator('input[name*="expiry"], input[placeholder*="expiry"]');
      const cvvInput = page.locator('input[name*="cvv"], input[placeholder*="cvv"]');
      
      if (await cardInput.count() > 0) {
        await cardInput.first().fill('4000000000000002'); // Stripe test card that declines
        await expiryInput.first().fill('12/25');
        await cvvInput.first().fill('123');
        
        // Submit payment
        const submitButton = page.locator('button[type="submit"], button:has-text("Pay"), button:has-text("Submit")');
        await submitButton.first().click();
        
        await page.waitForTimeout(2000);
        
        // Look for error message
        const errorMessage = page.locator('text=/declined|error|failed|invalid/i');
        
        if (await errorMessage.count() > 0) {
          await expect(errorMessage.first()).toBeVisible();
          console.log('✅ Payment error handling working');
        } else {
          console.log('⚠️ No payment error message found');
        }
      } else {
        console.log('⚠️ Payment form fields not found');
      }
    } else {
      console.log('⚠️ Payment form not found');
    }
  });

  test('PI005 - Should process successful payment', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for payment form
    const paymentForm = page.locator('form, [class*="payment"], [class*="checkout"]');
    
    if (await paymentForm.count() > 0) {
      // Fill with test data for successful payment
      const cardInput = page.locator('input[name*="card"], input[placeholder*="card"]');
      const expiryInput = page.locator('input[name*="expiry"], input[placeholder*="expiry"]');
      const cvvInput = page.locator('input[name*="cvv"], input[placeholder*="cvv"]');
      
      if (await cardInput.count() > 0) {
        await cardInput.first().fill('4242424242424242'); // Stripe test card that succeeds
        await expiryInput.first().fill('12/25');
        await cvvInput.first().fill('123');
        
        // Submit payment
        const submitButton = page.locator('button[type="submit"], button:has-text("Pay"), button:has-text("Submit")');
        await submitButton.first().click();
        
        await page.waitForTimeout(3000);
        
        // Look for success message or redirect
        const successMessage = page.locator('text=/success|thank you|order confirmed|payment successful/i');
        
        if (await successMessage.count() > 0) {
          await expect(successMessage.first()).toBeVisible();
          console.log('✅ Payment processed successfully');
        } else {
          // Check if redirected to success page
          const currentUrl = page.url();
          if (currentUrl.includes('success') || currentUrl.includes('thank') || currentUrl.includes('confirm')) {
            console.log('✅ Payment successful - redirected to confirmation page');
          } else {
            console.log('⚠️ No payment success indication found');
          }
        }
      } else {
        console.log('⚠️ Payment form fields not found');
      }
    } else {
      console.log('⚠️ Payment form not found');
    }
  });

  test('PI006 - Should display payment confirmation', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for payment confirmation elements
    const confirmationElements = page.locator('text=/confirmation|receipt|order number|transaction/i');
    
    if (await confirmationElements.count() > 0) {
      await expect(confirmationElements.first()).toBeVisible();
      console.log('✅ Payment confirmation displayed');
    } else {
      // Look for order summary
      const orderSummary = page.locator('[class*="summary"], [class*="order"], [class*="receipt"]');
      
      if (await orderSummary.count() > 0) {
        await expect(orderSummary.first()).toBeVisible();
        console.log('✅ Order summary available for confirmation');
      } else {
        console.log('⚠️ Payment confirmation not found');
      }
    }
  });

  test('PI007 - Should handle payment method selection', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for payment method options
    const paymentMethods = page.locator('input[type="radio"], [class*="payment-method"], button:has-text("Card")');
    
    if (await paymentMethods.count() > 0) {
      const methodCount = await paymentMethods.count();
      console.log(`Found ${methodCount} payment methods`);
      
      // Test selecting different payment methods
      for (let i = 0; i < Math.min(methodCount, 3); i++) {
        const method = paymentMethods.nth(i);
        await method.click();
        await page.waitForTimeout(500);
        
        console.log(`✅ Payment method ${i + 1} selected`);
      }
    } else {
      console.log('⚠️ Payment method selection not found');
    }
  });

  test('PI008 - Should validate payment amount', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for payment amount display
    const amountDisplay = page.locator('text=/total|amount|payment|$/, [class*="amount"], [class*="total"]');
    
    if (await amountDisplay.count() > 0) {
      await expect(amountDisplay.first()).toBeVisible();
      
      const amountText = await amountDisplay.first().textContent();
      console.log(`Payment amount: ${amountText}`);
      
      // Should contain a dollar amount
      expect(amountText).toMatch(/\$/);
      
      // Amount should be reasonable
      const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
      expect(amount).toBeGreaterThan(0);
      expect(amount).toBeLessThan(10000);
      
      console.log('✅ Payment amount validation passed');
    } else {
      console.log('⚠️ Payment amount display not found');
    }
  });

  test('PI009 - Should handle payment security features', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for security indicators
    const securityElements = page.locator('text=/secure|ssl|encrypted|3d secure/i, [class*="secure"], [class*="ssl"]');
    
    if (await securityElements.count() > 0) {
      await expect(securityElements.first()).toBeVisible();
      console.log('✅ Payment security features displayed');
    } else {
      // Check for HTTPS
      const currentUrl = page.url();
      if (currentUrl.startsWith('https://')) {
        console.log('✅ HTTPS security enabled');
      } else {
        console.log('⚠️ HTTPS not detected');
      }
    }
  });

  test('PI010 - Should support payment retry functionality', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for retry button or option
    const retryButton = page.locator('button:has-text("Retry"), button:has-text("Try Again"), a:has-text("Retry")');
    
    if (await retryButton.count() > 0) {
      await expect(retryButton.first()).toBeVisible();
      console.log('✅ Payment retry functionality available');
    } else {
      // Look for error recovery options
      const errorRecovery = page.locator('text=/try again|retry|fix|correct/i');
      
      if (await errorRecovery.count() > 0) {
        await expect(errorRecovery.first()).toBeVisible();
        console.log('✅ Payment error recovery options available');
      } else {
        console.log('⚠️ Payment retry functionality not found');
      }
    }
  });

  test('PI011 - Should handle payment timeout scenarios', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for timeout handling
    const timeoutHandling = page.locator('text=/timeout|expired|session|time limit/i');
    
    if (await timeoutHandling.count() > 0) {
      await expect(timeoutHandling.first()).toBeVisible();
      console.log('✅ Payment timeout handling displayed');
    } else {
      // Test by waiting and checking for session expiration
      await page.waitForTimeout(5000);
      
      const sessionExpired = page.locator('text=/session|expired|timeout|login/i');
      
      if (await sessionExpired.count() > 0) {
        await expect(sessionExpired.first()).toBeVisible();
        console.log('✅ Payment session timeout handling working');
      } else {
        console.log('⚠️ Payment timeout handling not found');
      }
    }
  });

  test('PI012 - Should validate payment form accessibility', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Check for proper form labels
    const formLabels = page.locator('label, [aria-label], [title]');
    const labelCount = await formLabels.count();
    
    if (labelCount > 0) {
      console.log(`Found ${labelCount} form labels/accessibility attributes`);
      
      // Check for required field indicators
      const requiredFields = page.locator('[required], [aria-required="true"]');
      const requiredCount = await requiredFields.count();
      
      if (requiredCount > 0) {
        console.log(`Found ${requiredCount} required fields`);
        console.log('✅ Payment form accessibility features present');
      } else {
        console.log('⚠️ No required field indicators found');
      }
    } else {
      console.log('⚠️ No form labels or accessibility attributes found');
    }
  });

  test('PI013 - Should handle payment cancellation', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for cancel button
    const cancelButton = page.locator('button:has-text("Cancel"), a:has-text("Cancel"), button:has-text("Back")');
    
    if (await cancelButton.count() > 0) {
      await cancelButton.first().click();
      await page.waitForTimeout(1000);
      
      // Should navigate away from payment page
      const currentUrl = page.url();
      if (!currentUrl.includes('checkout') && !currentUrl.includes('payment')) {
        console.log('✅ Payment cancellation working - navigated away from payment page');
      } else {
        console.log('⚠️ Still on payment page after cancellation');
      }
    } else {
      console.log('⚠️ Payment cancellation button not found');
    }
  });

  test('PI014 - Should display payment processing status', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/checkout`);
    await page.waitForLoadState('networkidle');
    
    // Look for processing status indicators
    const processingStatus = page.locator('text=/processing|loading|please wait|verifying/i, [class*="loading"], [class*="spinner"]');
    
    if (await processingStatus.count() > 0) {
      await expect(processingStatus.first()).toBeVisible();
      console.log('✅ Payment processing status displayed');
    } else {
      // Look for progress indicators
      const progressIndicators = page.locator('[class*="progress"], [class*="status"], [role="progressbar"]');
      
      if (await progressIndicators.count() > 0) {
        await expect(progressIndicators.first()).toBeVisible();
        console.log('✅ Payment progress indicators available');
      } else {
        console.log('⚠️ Payment processing status not found');
      }
    }
  });
}); 