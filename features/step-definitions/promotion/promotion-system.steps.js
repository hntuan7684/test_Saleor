const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { BASE_URL } = require('../../../tests/utils/constants');

// Background step
Given('I am on the checkout page', async function() {
  await this.page.goto(BASE_URL + "/checkout", {
    timeout: 90000,
    waitUntil: "domcontentloaded",
  });
});

// Promotion steps
When('I enter a valid promotion code', async function() {
  await this.page.fill('input[name="promotionCode"]', 'SAVE20');
});

When('I apply the promotion', async function() {
  await this.page.click('button:has-text("Apply")');
});

When('I enter an invalid promotion code format', async function() {
  await this.page.fill('input[name="promotionCode"]', 'INVALID123');
});

When('I enter an expired promotion code', async function() {
  await this.page.fill('input[name="promotionCode"]', 'EXPIRED');
});

When('I try to use a promotion that has reached its usage limit', async function() {
  await this.page.fill('input[name="promotionCode"]', 'LIMITED');
});

When('I try to apply a promotion to an order below the minimum', async function() {
  await this.page.fill('input[name="promotionCode"]', 'MINORDER');
});

When('I apply a percentage-based promotion', async function() {
  await this.page.fill('input[name="promotionCode"]', 'PERCENT20');
  await this.page.click('button:has-text("Apply")');
});

When('I apply a fixed amount promotion', async function() {
  await this.page.fill('input[name="promotionCode"]', 'FIXED10');
  await this.page.click('button:has-text("Apply")');
});

When('I apply multiple valid promotions', async function() {
  await this.page.fill('input[name="promotionCode"]', 'SAVE20');
  await this.page.click('button:has-text("Apply")');
  await this.page.fill('input[name="promotionCode"]', 'FREESHIP');
  await this.page.click('button:has-text("Apply")');
});

When('I apply conflicting promotions', async function() {
  await this.page.fill('input[name="promotionCode"]', 'CONFLICT1');
  await this.page.click('button:has-text("Apply")');
  await this.page.fill('input[name="promotionCode"]', 'CONFLICT2');
  await this.page.click('button:has-text("Apply")');
});

When('I apply a promotion for specific products', async function() {
  await this.page.fill('input[name="promotionCode"]', 'PRODUCTSPEC');
  await this.page.click('button:has-text("Apply")');
});

When('I apply a promotion that is specific to my user account', async function() {
  await this.page.fill('input[name="promotionCode"]', 'USERSPEC');
  await this.page.click('button:has-text("Apply")');
});

When('I remove an applied promotion', async function() {
  await this.page.click('[data-testid="remove-promotion"]');
});

When('I apply a promotion', async function() {
  await this.page.fill('input[name="promotionCode"]', 'SAVE20');
  await this.page.click('button:has-text("Apply")');
});

When('I use a promotion', async function() {
  await this.page.fill('input[name="promotionCode"]', 'SAVE20');
  await this.page.click('button:has-text("Apply")');
});

When('I have eligible promotions for my order', async function() {
  // Eligible promotions should be automatically detected
});

// Assertion steps
Then('the discount should be applied to my order', async function() {
  const discountApplied = this.page.locator('[data-testid="discount-applied"]');
  await expect(discountApplied).toBeVisible();
});

Then('the final price should reflect the discount', async function() {
  const finalPrice = this.page.locator('[data-testid="final-price"]');
  await expect(finalPrice).toBeVisible();
});

Then('I should see a format validation error', async function() {
  const formatError = this.page.locator('text=Invalid promotion code format');
  await expect(formatError).toBeVisible();
});

Then('the promotion should not be applied', async function() {
  const promotionApplied = this.page.locator('[data-testid="promotion-applied"]');
  await expect(promotionApplied).not.toBeVisible();
});

Then('I should see an expiration error message', async function() {
  const expirationError = this.page.locator('text=Promotion code has expired');
  await expect(expirationError).toBeVisible();
});

Then('the promotion should be rejected', async function() {
  const rejectionMessage = this.page.locator('text=Promotion rejected');
  await expect(rejectionMessage).toBeVisible();
});

Then('I should see a usage limit error', async function() {
  const usageLimitError = this.page.locator('text=Usage limit reached');
  await expect(usageLimitError).toBeVisible();
});

Then('I should see a minimum order requirement message', async function() {
  const minimumOrderMessage = this.page.locator('text=Minimum order required');
  await expect(minimumOrderMessage).toBeVisible();
});

Then('the discount should be calculated as a percentage', async function() {
  const percentageDiscount = this.page.locator('[data-testid="percentage-discount"]');
  await expect(percentageDiscount).toBeVisible();
});

Then('the calculation should be accurate', async function() {
  const accurateCalculation = this.page.locator('[data-testid="accurate-calculation"]');
  await expect(accurateCalculation).toBeVisible();
});

Then('the discount should be a fixed amount', async function() {
  const fixedDiscount = this.page.locator('[data-testid="fixed-discount"]');
  await expect(fixedDiscount).toBeVisible();
});

Then('the amount should be deducted from the total', async function() {
  const deductedAmount = this.page.locator('[data-testid="deducted-amount"]');
  await expect(deductedAmount).toBeVisible();
});

Then('the system should handle the combination correctly', async function() {
  const combinationHandling = this.page.locator('[data-testid="combination-handling"]');
  await expect(combinationHandling).toBeVisible();
});

Then('the total discount should be calculated properly', async function() {
  const totalDiscount = this.page.locator('[data-testid="total-discount"]');
  await expect(totalDiscount).toBeVisible();
});

Then('the system should resolve conflicts appropriately', async function() {
  const conflictResolution = this.page.locator('[data-testid="conflict-resolution"]');
  await expect(conflictResolution).toBeVisible();
});

Then('I should be informed about the resolution', async function() {
  const resolutionInfo = this.page.locator('[data-testid="resolution-info"]');
  await expect(resolutionInfo).toBeVisible();
});

Then('the discount should only apply to eligible products', async function() {
  const eligibleProducts = this.page.locator('[data-testid="eligible-products"]');
  await expect(eligibleProducts).toBeVisible();
});

Then('other products should remain at full price', async function() {
  const fullPriceProducts = this.page.locator('[data-testid="full-price-products"]');
  await expect(fullPriceProducts).toBeVisible();
});

Then('the promotion should be validated against my account', async function() {
  const accountValidation = this.page.locator('[data-testid="account-validation"]');
  await expect(accountValidation).toBeVisible();
});

Then('the discount should be applied if eligible', async function() {
  const eligibilityCheck = this.page.locator('[data-testid="eligibility-check"]');
  await expect(eligibilityCheck).toBeVisible();
});

Then('the discount should be removed', async function() {
  const discountRemoved = this.page.locator('[data-testid="discount-removed"]');
  await expect(discountRemoved).toBeVisible();
});

Then('the total price should be recalculated', async function() {
  const recalculatedPrice = this.page.locator('[data-testid="recalculated-price"]');
  await expect(recalculatedPrice).toBeVisible();
});

Then('the promotion details should be clearly displayed', async function() {
  const promotionDetails = this.page.locator('[data-testid="promotion-details"]');
  await expect(promotionDetails).toBeVisible();
});

Then('the savings amount should be visible', async function() {
  const savingsAmount = this.page.locator('[data-testid="savings-amount"]');
  await expect(savingsAmount).toBeVisible();
});

Then('the usage should be tracked in my account', async function() {
  const usageTracking = this.page.locator('[data-testid="usage-tracking"]');
  await expect(usageTracking).toBeVisible();
});

Then('I should be able to view my promotion history', async function() {
  const promotionHistory = this.page.locator('[data-testid="promotion-history"]');
  await expect(promotionHistory).toBeVisible();
});

Then('the system should suggest applicable promotions', async function() {
  const suggestedPromotions = this.page.locator('[data-testid="suggested-promotions"]');
  await expect(suggestedPromotions).toBeVisible();
});

Then('I should be able to apply them with one click', async function() {
  const oneClickApply = this.page.locator('[data-testid="one-click-apply"]');
  await expect(oneClickApply).toBeVisible();
}); 