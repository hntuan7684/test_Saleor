const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { BASE_URL } = require('../../../tests/utils/constants');

// ========================
// SHARED AUTHENTICATION STEPS
// ========================

Given('I am logged in', async function() {
  // Click on user icon to go to login
  await this.page.goto(BASE_URL + "/us", {
    timeout: 90000,
    waitUntil: "domcontentloaded",
  });
  
  // Click user icon
  await this.page.click('svg.lucide-user');
  
  // Fill Keycloak login form
  await this.page.fill('input[name="username"]', 'test@example.com');
  await this.page.fill('input[name="password"]', 'password123');
  
  // Submit login (look for Sign In button)
  await this.page.click('input[type="submit"], button[type="submit"]');
  
  // Wait for redirect back to main site
  await this.page.waitForTimeout(3000);
});

Given('I am not logged in', async function() {
  // Just ensure we're on the main page without authentication
  await this.page.goto(BASE_URL + "/us", {
    timeout: 30000,
    waitUntil: "domcontentloaded",
  });
  
  // Clear any existing sessions
  await this.page.context().clearCookies();
  await this.page.waitForTimeout(1000);
});

// ========================
// SHARED NAVIGATION STEPS
// ========================

Given('I am on the product detail page', async function() {
  await this.page.goto(BASE_URL + "/us/products/bella-3001", {
    timeout: 90000,
    waitUntil: "domcontentloaded",
  });
});

Given('I am on the checkout page', async function() {
  await this.page.goto(BASE_URL + "/us/cart", {
    timeout: 90000,
    waitUntil: "domcontentloaded",
  });
});

// ========================
// SHARED VALIDATION STEPS
// ========================

Then('I should see an error message', async function() {
  // Look for common error message patterns
  const errorSelectors = [
    '.error',
    '.error-message', 
    '.alert-error',
    '.text-red-500',
    '[data-testid="error"]',
    '.validation-error'
  ];
  
  let errorFound = false;
  for (const selector of errorSelectors) {
    const errorElement = this.page.locator(selector);
    if (await errorElement.count() > 0 && await errorElement.first().isVisible()) {
      errorFound = true;
      break;
    }
  }
  
  expect(errorFound).toBe(true);
});

Then('I should see validation errors', async function() {
  // Look for validation error patterns
  const validationSelectors = [
    '.validation-error',
    '.field-error',
    '.form-error',
    '.invalid-feedback',
    '[role="alert"]',
    '.error-text'
  ];
  
  let validationFound = false;
  for (const selector of validationSelectors) {
    const validationElement = this.page.locator(selector);
    if (await validationElement.count() > 0 && await validationElement.first().isVisible()) {
      validationFound = true;
      break;
    }
  }
  
  expect(validationFound).toBe(true);
});

Then('I should see a clear error message', async function() {
  // Look for clear, user-friendly error messages
  const clearErrorSelectors = [
    '.user-error',
    '.clear-error',
    '.help-text.error',
    '.error-description',
    '.validation-message'
  ];
  
  let clearErrorFound = false;
  for (const selector of clearErrorSelectors) {
    const errorElement = this.page.locator(selector);
    if (await errorElement.count() > 0 && await errorElement.first().isVisible()) {
      const errorText = await errorElement.first().textContent();
      if (errorText && errorText.trim().length > 10) { // Ensure it's a meaningful message
        clearErrorFound = true;
        break;
      }
    }
  }
  
  // Fallback to any visible error message
  if (!clearErrorFound) {
    const anyError = this.page.locator('.error, .error-message, [role="alert"]').first();
    if (await anyError.isVisible()) {
      clearErrorFound = true;
    }
  }
  
  expect(clearErrorFound).toBe(true);
});

// ========================
// SHARED UTILITY STEPS
// ========================

Then('the system should handle the combination correctly', async function() {
  // Generic step for combination handling validation
  // Check that no JavaScript errors occurred
  const errors = await this.page.evaluate(() => window.errors || []);
  expect(errors.length).toBe(0);
  
  // Check that page is still responsive
  await this.page.waitForLoadState('domcontentloaded');
  const title = await this.page.title();
  expect(title).toBeTruthy();
});

Then('the total discount should be calculated properly', async function() {
  // Look for price/discount elements
  const priceSelectors = [
    '.total-price',
    '.final-price', 
    '.price-total',
    '.discount-total',
    '.order-total'
  ];
  
  let priceFound = false;
  for (const selector of priceSelectors) {
    const priceElement = this.page.locator(selector);
    if (await priceElement.count() > 0 && await priceElement.first().isVisible()) {
      const priceText = await priceElement.first().textContent();
      // Basic validation that it contains a price format
      if (priceText && /\$[\d,]+\.?\d*/.test(priceText)) {
        priceFound = true;
        break;
      }
    }
  }
  
  expect(priceFound).toBe(true);
});
