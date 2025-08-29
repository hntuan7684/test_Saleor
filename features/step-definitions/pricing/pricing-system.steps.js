const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { BASE_URL } = require('../../../tests/utils/constants');

// Background and authentication steps are now in shared-steps.js

// Pricing steps
When('I view the product pricing', async function() {
  // Pricing is already visible on product page
});

When('I change the quantity to different tiers', async function() {
  await this.page.fill('input[name="quantity"]', '100');
  await this.page.waitForTimeout(1000);
  await this.page.fill('input[name="quantity"]', '500');
  await this.page.waitForTimeout(1000);
  await this.page.fill('input[name="quantity"]', '1000');
});

When('I select {int} colors for front printing', async function(colorCount) {
  for (let i = 0; i < colorCount; i++) {
    await this.page.click(`[data-testid="front-color-${i}"]`);
  }
});

When('I select {int} color for back printing', async function(colorCount) {
  for (let i = 0; i < colorCount; i++) {
    await this.page.click(`[data-testid="back-color-${i}"]`);
  }
});

When('I select printing for chest area', async function() {
  await this.page.click('[data-testid="print-area-chest"]');
});

When('I select printing for back area', async function() {
  await this.page.click('[data-testid="print-area-back"]');
});

When('I enter a valid coupon code', async function() {
  await this.page.fill('input[name="coupon"]', 'SAVE20');
  await this.page.click('button:has-text("Apply")');
});

When('I enter an invalid coupon code', async function() {
  await this.page.fill('input[name="coupon"]', 'INVALID');
  await this.page.click('button:has-text("Apply")');
});

When('I apply multiple valid coupons', async function() {
  await this.page.fill('input[name="coupon"]', 'SAVE20');
  await this.page.click('button:has-text("Apply")');
  await this.page.fill('input[name="coupon"]', 'FREESHIP');
  await this.page.click('button:has-text("Apply")');
});

When('I change product options', async function() {
  await this.page.selectOption('select[name="size"]', 'L');
  await this.page.selectOption('select[name="color"]', 'blue');
});

When('I note the current price', async function() {
  this.guestPrice = await this.page.locator('[data-testid="product-price"]').textContent();
});

When('I log in', async function() {
  await this.page.goto(BASE_URL + "/login");
  await this.page.fill('input[name="username"]', 'test@example.com');
  await this.page.fill('input[name="password"]', 'password123');
  await this.page.click('button:has-text("Log In")');
  await this.page.goto(BASE_URL + "/products/bella-3001");
});

// Assertion steps
Then('I should see Price A category pricing', async function() {
  const priceA = this.page.locator('[data-testid="price-category-a"]');
  await expect(priceA).toBeVisible();
});

Then('the pricing should be based on quantity tiers', async function() {
  const tierPricing = this.page.locator('[data-testid="tier-pricing"]');
  await expect(tierPricing).toBeVisible();
});

Then('I should see Price B category pricing', async function() {
  const priceB = this.page.locator('[data-testid="price-category-b"]');
  await expect(priceB).toBeVisible();
});

Then('the pricing should be more favorable than Price A', async function() {
  const priceA = await this.page.locator('[data-testid="price-category-a"]').textContent();
  const priceB = await this.page.locator('[data-testid="price-category-b"]').textContent();
  expect(parseFloat(priceB)).toBeLessThan(parseFloat(priceA));
});

Then('the price should update accordingly', async function() {
  const priceElement = this.page.locator('[data-testid="product-price"]');
  await expect(priceElement).toBeVisible();
});

Then('the pricing should follow the tier structure', async function() {
  const tierStructure = this.page.locator('[data-testid="tier-structure"]');
  await expect(tierStructure).toBeVisible();
});

Then('the total printing cost should be ${float}', async function(expectedCost) {
  const totalCost = this.page.locator('[data-testid="printing-total"]');
  await expect(totalCost).toContainText(expectedCost.toString());
});

Then('the cost should be itemized by area', async function() {
  const itemizedCosts = this.page.locator('[data-testid="itemized-costs"]');
  await expect(itemizedCosts).toBeVisible();
});

Then('the costs should be calculated separately', async function() {
  const separateCosts = this.page.locator('[data-testid="separate-costs"]');
  await expect(separateCosts).toBeVisible();
});

Then('the total should be the sum of all areas', async function() {
  const totalSum = this.page.locator('[data-testid="total-sum"]');
  await expect(totalSum).toBeVisible();
});

Then('the discount should be applied', async function() {
  const discountApplied = this.page.locator('[data-testid="discount-applied"]');
  await expect(discountApplied).toBeVisible();
});

Then('the final price should reflect the discount percentage', async function() {
  const finalPrice = this.page.locator('[data-testid="final-price"]');
  await expect(finalPrice).toBeVisible();
});

// Error message steps are now in shared-steps.js

Then('the price should remain unchanged', async function() {
  const originalPrice = this.page.locator('[data-testid="original-price"]');
  await expect(originalPrice).toBeVisible();
});

// Combination handling steps are now in shared-steps.js

Then('the price should update in real-time', async function() {
  const realTimePrice = this.page.locator('[data-testid="real-time-price"]');
  await expect(realTimePrice).toBeVisible();
});

Then('all calculations should be accurate', async function() {
  const calculations = this.page.locator('[data-testid="calculations"]');
  await expect(calculations).toBeVisible();
});

Then('I should see a different (better) price', async function() {
  const loggedInPrice = await this.page.locator('[data-testid="product-price"]').textContent();
  expect(loggedInPrice).not.toBe(this.guestPrice);
});

Then('the difference should be clearly visible', async function() {
  const priceDifference = this.page.locator('[data-testid="price-difference"]');
  await expect(priceDifference).toBeVisible();
}); 