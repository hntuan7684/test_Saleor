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

// Payment steps
When('I enter valid payment information', async function() {
  await this.page.fill('input[name="cardNumber"]', '4242424242424242');
  await this.page.fill('input[name="expiryDate"]', '12/25');
  await this.page.fill('input[name="cvv"]', '123');
  await this.page.fill('input[name="cardholderName"]', 'John Doe');
});

When('I submit the payment', async function() {
  await this.page.click('button:has-text("Pay Now")');
});

When('I enter invalid payment information', async function() {
  await this.page.fill('input[name="cardNumber"]', '1234567890123456');
  await this.page.fill('input[name="expiryDate"]', '12/20');
  await this.page.fill('input[name="cvv"]', '999');
});

When('I enter an invalid credit card number', async function() {
  await this.page.fill('input[name="cardNumber"]', '1234567890123456');
  await this.page.fill('input[name="expiryDate"]', '12/25');
  await this.page.fill('input[name="cvv"]', '123');
});

When('I enter an expired card', async function() {
  await this.page.fill('input[name="cardNumber"]', '4242424242424242');
  await this.page.fill('input[name="expiryDate"]', '12/20');
  await this.page.fill('input[name="cvv"]', '123');
});

When('I enter an invalid CVV', async function() {
  await this.page.fill('input[name="cardNumber"]', '4242424242424242');
  await this.page.fill('input[name="expiryDate"]', '12/25');
  await this.page.fill('input[name="cvv"]', '999');
});

When('I complete a successful payment', async function() {
  await this.page.fill('input[name="cardNumber"]', '4242424242424242');
  await this.page.fill('input[name="expiryDate"]', '12/25');
  await this.page.fill('input[name="cvv"]', '123');
  await this.page.fill('input[name="cardholderName"]', 'John Doe');
  await this.page.click('button:has-text("Pay Now")');
});

When('a payment processing error occurs', async function() {
  // Simulate payment error
  await this.page.fill('input[name="cardNumber"]', '4000000000000002'); // Declined card
  await this.page.fill('input[name="expiryDate"]', '12/25');
  await this.page.fill('input[name="cvv"]', '123');
  await this.page.click('button:has-text("Pay Now")');
});

When('I enter payment information', async function() {
  await this.page.fill('input[name="cardNumber"]', '4242424242424242');
  await this.page.fill('input[name="expiryDate"]', '12/25');
  await this.page.fill('input[name="cvv"]', '123');
});

When('I attempt to pay an incorrect amount', async function() {
  // Modify the amount field
  await this.page.fill('input[name="amount"]', '0.01');
  await this.page.click('button:has-text("Pay Now")');
});

When('I pay in a different currency', async function() {
  await this.page.selectOption('select[name="currency"]', 'EUR');
  await this.page.fill('input[name="cardNumber"]', '4242424242424242');
  await this.page.fill('input[name="expiryDate"]', '12/25');
  await this.page.fill('input[name="cvv"]', '123');
  await this.page.click('button:has-text("Pay Now")');
});

When('I request a refund', async function() {
  await this.page.click('[data-testid="request-refund"]');
});

When('Stripe sends a webhook notification', async function() {
  // Simulate webhook notification
  await this.page.evaluate(() => {
    // Simulate webhook event
    window.webhookEvent = { type: 'payment_intent.succeeded' };
  });
});

When('I use test payment credentials', async function() {
  await this.page.fill('input[name="cardNumber"]', '4242424242424242');
  await this.page.fill('input[name="expiryDate"]', '12/25');
  await this.page.fill('input[name="cvv"]', '123');
});

When('I access the payment form on mobile', async function() {
  await this.page.setViewportSize({ width: 375, height: 667 });
});

// Assertion steps
Then('the payment should be processed through Stripe', async function() {
  const stripeProcessing = this.page.locator('[data-testid="stripe-processing"]');
  await expect(stripeProcessing).toBeVisible();
});

Then('I should receive a payment confirmation', async function() {
  const confirmation = this.page.locator('text=Payment successful');
  await expect(confirmation).toBeVisible({ timeout: 15000 });
});

Then('I should see validation errors', async function() {
  const validationErrors = this.page.locator('.validation-error');
  await expect(validationErrors).toBeVisible();
});

Then('the payment should not be processed', async function() {
  const paymentButton = this.page.locator('button:has-text("Pay Now")');
  await expect(paymentButton).toBeEnabled();
});

Then('I should see a card validation error', async function() {
  const cardError = this.page.locator('text=Invalid card number');
  await expect(cardError).toBeVisible();
});

Then('the form should highlight the invalid field', async function() {
  const highlightedField = this.page.locator('input[name="cardNumber"].error');
  await expect(highlightedField).toBeVisible();
});

Then('I should see an expiry date error', async function() {
  const expiryError = this.page.locator('text=Card has expired');
  await expect(expiryError).toBeVisible();
});

Then('the payment should be rejected', async function() {
  const rejection = this.page.locator('text=Payment rejected');
  await expect(rejection).toBeVisible();
});

Then('I should see a CVV validation error', async function() {
  const cvvError = this.page.locator('text=Invalid CVV');
  await expect(cvvError).toBeVisible();
});

Then('the payment should not proceed', async function() {
  const paymentButton = this.page.locator('button:has-text("Pay Now")');
  await expect(paymentButton).toBeEnabled();
});

Then('I should see a success message', async function() {
  const successMessage = this.page.locator('text=Payment successful');
  await expect(successMessage).toBeVisible();
});

Then('I should be redirected to the order confirmation page', async function() {
  await expect(this.page).toHaveURL(/.*confirmation.*/);
});

Then('I should receive an order confirmation email', async function() {
  const emailConfirmation = this.page.locator('text=Confirmation email sent');
  await expect(emailConfirmation).toBeVisible();
});

Then('I should see a user-friendly error message', async function() {
  const userFriendlyError = this.page.locator('[data-testid="user-friendly-error"]');
  await expect(userFriendlyError).toBeVisible();
});

Then('I should be able to retry the payment', async function() {
  const retryButton = this.page.locator('button:has-text("Retry Payment")');
  await expect(retryButton).toBeVisible();
});

Then('the data should be encrypted', async function() {
  const encryptedData = this.page.locator('[data-testid="encrypted-data"]');
  await expect(encryptedData).toBeVisible();
});

Then('sensitive information should not be stored locally', async function() {
  const localStorage = await this.page.evaluate(() => localStorage.getItem('cardNumber'));
  expect(localStorage).toBeNull();
});

Then('I should see an amount validation error', async function() {
  const amountError = this.page.locator('text=Invalid amount');
  await expect(amountError).toBeVisible();
});

Then('the correct amount should be displayed', async function() {
  const correctAmount = this.page.locator('[data-testid="correct-amount"]');
  await expect(correctAmount).toBeVisible();
});

Then('the currency should be converted correctly', async function() {
  const convertedCurrency = this.page.locator('[data-testid="converted-currency"]');
  await expect(convertedCurrency).toBeVisible();
});

Then('the exchange rate should be clearly displayed', async function() {
  const exchangeRate = this.page.locator('[data-testid="exchange-rate"]');
  await expect(exchangeRate).toBeVisible();
});

Then('the refund should be processed through Stripe', async function() {
  const refundProcessing = this.page.locator('[data-testid="refund-processing"]');
  await expect(refundProcessing).toBeVisible();
});

Then('I should receive a refund confirmation', async function() {
  const refundConfirmation = this.page.locator('text=Refund processed');
  await expect(refundConfirmation).toBeVisible();
});

Then('the order status should be updated accordingly', async function() {
  const updatedStatus = this.page.locator('[data-testid="updated-status"]');
  await expect(updatedStatus).toBeVisible();
});

Then('the customer should be notified', async function() {
  const customerNotification = this.page.locator('[data-testid="customer-notification"]');
  await expect(customerNotification).toBeVisible();
});

Then('the payment should be processed in test mode', async function() {
  const testMode = this.page.locator('[data-testid="test-mode"]');
  await expect(testMode).toBeVisible();
});

Then('no real charges should be made', async function() {
  const testModeIndicator = this.page.locator('text=Test Mode');
  await expect(testModeIndicator).toBeVisible();
});

Then('the form should be properly displayed', async function() {
  const mobileForm = this.page.locator('[data-testid="mobile-payment-form"]');
  await expect(mobileForm).toBeVisible();
});

Then('all fields should be easily accessible', async function() {
  const accessibleFields = this.page.locator('[data-testid="accessible-fields"]');
  await expect(accessibleFields).toBeVisible();
}); 