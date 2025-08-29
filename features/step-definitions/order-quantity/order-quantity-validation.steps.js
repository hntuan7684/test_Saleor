const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { BASE_URL } = require('../../../tests/utils/constants');

// Background step is now in shared-steps.js

// Order quantity validation steps
When('I try to add less than 500 shirts to cart', async function() {
  // Implementation for adding less than 500 shirts
  await this.page.fill('input[name="quantity"]', '100');
  await this.page.click('button:has-text("Add to Cart")');
});

When('I add exactly 500 shirts to cart', async function() {
  await this.page.fill('input[name="quantity"]', '500');
  await this.page.click('button:has-text("Add to Cart")');
});

When('I add more than 500 shirts to cart', async function() {
  await this.page.fill('input[name="quantity"]', '1000');
  await this.page.click('button:has-text("Add to Cart")');
});

When('I view the product page', async function() {
  // Already on product page from background
});

When('I enter an invalid quantity', async function() {
  await this.page.fill('input[name="quantity"]', '50');
  await this.page.click('button:has-text("Add to Cart")');
});

When('I click on the support link for small orders', async function() {
  await this.page.click('a:has-text("Contact Support")');
});

When('I view the quantity input field', async function() {
  // Quantity field is already visible
});

// Permission steps
Given('I am logged in with special permission', async function() {
  // Implementation for login with special permission
  await this.page.goto(BASE_URL + "/login");
  await this.page.fill('input[name="username"]', 'special-user@example.com');
  await this.page.fill('input[name="password"]', 'password123');
  await this.page.click('button:has-text("Log In")');
});

// Assertion steps
Then('I should see a minimum order message', async function() {
  const message = this.page.locator('text=Minimum order quantity is 500 shirts');
  await expect(message).toBeVisible({ timeout: 10000 });
});

Then('I should be redirected to the support form', async function() {
  await expect(this.page).toHaveURL(/.*support.*/);
});

Then('the order should be accepted', async function() {
  const successMessage = this.page.locator('text=Added to cart');
  await expect(successMessage).toBeVisible({ timeout: 10000 });
});

Then('I should be able to proceed to checkout', async function() {
  const checkoutButton = this.page.locator('button:has-text("Checkout")');
  await expect(checkoutButton).toBeEnabled();
});

Then('I should see a note about minimum 500 orders', async function() {
  const note = this.page.locator('text=Minimum 500 orders required');
  await expect(note).toBeVisible();
});

Then('the note should mention contacting support for smaller orders', async function() {
  const supportNote = this.page.locator('text=contact support');
  await expect(supportNote).toBeVisible();
});

Then('I should see a special permission indicator', async function() {
  const indicator = this.page.locator('[data-testid="special-permission"]');
  await expect(indicator).toBeVisible();
});

// Clear error message step is now in shared-steps.js

Then('the error should explain the minimum requirement', async function() {
  const requirementText = this.page.locator('text=minimum requirement');
  await expect(requirementText).toBeVisible();
});

Then('the form should be pre-filled with order inquiry', async function() {
  const inquiryField = this.page.locator('textarea[name="message"]');
  await expect(inquiryField).toHaveValue(/.*order.*/);
});

Then('I should see helpful tooltips about minimum orders', async function() {
  const tooltip = this.page.locator('[data-tooltip*="minimum"]');
  await expect(tooltip).toBeVisible();
});

Then('the interface should guide me to the correct quantity', async function() {
  const guidance = this.page.locator('text=Enter quantity');
  await expect(guidance).toBeVisible();
}); 