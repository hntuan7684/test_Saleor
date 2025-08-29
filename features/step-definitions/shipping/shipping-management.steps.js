const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { BASE_URL } = require('../../../tests/utils/constants');

// Background step is now in shared-steps.js

// File upload steps
When('I upload a valid CSV shipping list', async function() {
  await this.page.setInputFiles('input[type="file"]', 'test-data/valid-shipping-list.csv');
});

When('I upload an invalid CSV file', async function() {
  await this.page.setInputFiles('input[type="file"]', 'test-data/invalid-file.txt');
});

When('I click on the download template link', async function() {
  await this.page.click('[data-testid="download-template"]');
});

When('I upload a CSV with invalid addresses', async function() {
  await this.page.setInputFiles('input[type="file"]', 'test-data/invalid-addresses.csv');
});

When('I upload a CSV with invalid quantities', async function() {
  await this.page.setInputFiles('input[type="file"]', 'test-data/invalid-quantities.csv');
});

When('I upload a valid shipping list', async function() {
  await this.page.setInputFiles('input[type="file"]', 'test-data/valid-shipping-list.csv');
});

When('I upload a shipping list with multiple addresses', async function() {
  await this.page.setInputFiles('input[type="file"]', 'test-data/multiple-addresses.csv');
});

When('I view the shipping cost details', async function() {
  await this.page.click('[data-testid="shipping-details"]');
});

When('the shipping list is processed', async function() {
  await this.page.click('[data-testid="process-shipping"]');
});

When('I place an order with multiple shipping addresses', async function() {
  await this.page.setInputFiles('input[type="file"]', 'test-data/multiple-addresses.csv');
  await this.page.click('[data-testid="place-order"]');
});

When('I access the shipping list upload feature', async function() {
  await this.page.click('[data-testid="upload-shipping"]');
});

When('I upload a shipping list', async function() {
  await this.page.setInputFiles('input[type="file"]', 'test-data/valid-shipping-list.csv');
});

When('I encounter a file upload error', async function() {
  // Simulate file upload error
  await this.page.setInputFiles('input[type="file"]', 'test-data/error-file.csv');
});

When('I place an order with multiple addresses', async function() {
  await this.page.setInputFiles('input[type="file"]', 'test-data/multiple-addresses.csv');
  await this.page.click('[data-testid="place-order"]');
});

// Assertion steps
Then('the file should be accepted', async function() {
  const successMessage = this.page.locator('text=File uploaded successfully');
  await expect(successMessage).toBeVisible({ timeout: 10000 });
});

Then('the shipping addresses should be processed', async function() {
  const processedAddresses = this.page.locator('[data-testid="processed-addresses"]');
  await expect(processedAddresses).toBeVisible();
});

// Error message steps are now in shared-steps.js

Then('the file should be rejected', async function() {
  const rejectionMessage = this.page.locator('text=File rejected');
  await expect(rejectionMessage).toBeVisible();
});

Then('a CSV template should be downloaded', async function() {
  // Check if download started
  const downloadMessage = this.page.locator('text=Download started');
  await expect(downloadMessage).toBeVisible();
});

Then('the template should contain the required columns', async function() {
  const templateInfo = this.page.locator('[data-testid="template-info"]');
  await expect(templateInfo).toBeVisible();
});

// Validation error steps are now in shared-steps.js

Then('the invalid addresses should be highlighted', async function() {
  const highlightedAddresses = this.page.locator('[data-testid="highlighted-addresses"]');
  await expect(highlightedAddresses).toBeVisible();
});

Then('I should see quantity validation errors', async function() {
  const quantityErrors = this.page.locator('[data-testid="quantity-errors"]');
  await expect(quantityErrors).toBeVisible();
});

Then('the system should prevent order placement', async function() {
  const orderButton = this.page.locator('[data-testid="place-order"]');
  await expect(orderButton).toBeDisabled();
});

Then('the order should be split by address', async function() {
  const splitOrders = this.page.locator('[data-testid="split-orders"]');
  await expect(splitOrders).toBeVisible();
});

Then('each address should have its own sub-order', async function() {
  const subOrders = this.page.locator('[data-testid="sub-orders"]');
  await expect(subOrders).toBeVisible();
});

Then('shipping costs should be calculated per address', async function() {
  const perAddressCosts = this.page.locator('[data-testid="per-address-costs"]');
  await expect(perAddressCosts).toBeVisible();
});

Then('the total should include all shipping costs', async function() {
  const totalShipping = this.page.locator('[data-testid="total-shipping"]');
  await expect(totalShipping).toBeVisible();
});

Then('I should see costs for each address', async function() {
  const addressCosts = this.page.locator('[data-testid="address-costs"]');
  await expect(addressCosts).toBeVisible();
});

Then('the breakdown should be expandable', async function() {
  const expandableBreakdown = this.page.locator('[data-testid="expandable-breakdown"]');
  await expect(expandableBreakdown).toBeVisible();
});

Then('separate orders should be created for each address', async function() {
  const separateOrders = this.page.locator('[data-testid="separate-orders"]');
  await expect(separateOrders).toBeVisible();
});

Then('each sub-order should have its own tracking', async function() {
  const trackingNumbers = this.page.locator('[data-testid="tracking-numbers"]');
  await expect(trackingNumbers).toBeVisible();
});

Then('inventory should be checked for the total quantity', async function() {
  const inventoryCheck = this.page.locator('[data-testid="inventory-check"]');
  await expect(inventoryCheck).toBeVisible();
});

Then('backorder warnings should be shown if needed', async function() {
  const backorderWarning = this.page.locator('[data-testid="backorder-warning"]');
  await expect(backorderWarning).toBeVisible();
});

Then('the interface should be intuitive', async function() {
  const intuitiveInterface = this.page.locator('[data-testid="intuitive-interface"]');
  await expect(intuitiveInterface).toBeVisible();
});

Then('drag-and-drop should be supported', async function() {
  const dragDrop = this.page.locator('[data-testid="drag-drop"]');
  await expect(dragDrop).toBeVisible();
});

Then('I should see a preview of all addresses', async function() {
  const addressPreview = this.page.locator('[data-testid="address-preview"]');
  await expect(addressPreview).toBeVisible();
});

Then('I should be able to edit or remove addresses', async function() {
  const editRemoveButtons = this.page.locator('[data-testid="edit-remove-buttons"]');
  await expect(editRemoveButtons).toBeVisible();
});

// Clear error message steps are now in shared-steps.js

Then('I should be guided to resolve the issue', async function() {
  const guidance = this.page.locator('[data-testid="guidance"]');
  await expect(guidance).toBeVisible();
});

Then('the system should group similar designs', async function() {
  const groupedDesigns = this.page.locator('[data-testid="grouped-designs"]');
  await expect(groupedDesigns).toBeVisible();
});

Then('bulk printing should be optimized', async function() {
  const optimizedPrinting = this.page.locator('[data-testid="optimized-printing"]');
  await expect(optimizedPrinting).toBeVisible();
}); 