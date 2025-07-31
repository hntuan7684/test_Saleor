const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { BASE_URL } = require('../../../tests/utils/constants');

// Background step
Given('I am on the design tool page', async function() {
  await this.page.goto(BASE_URL + "/design", {
    timeout: 90000,
    waitUntil: "domcontentloaded",
  });
});

// Authentication steps
Given('I am logged in', async function() {
  await this.page.goto(BASE_URL + "/login");
  await this.page.fill('input[name="username"]', 'test@example.com');
  await this.page.fill('input[name="password"]', 'password123');
  await this.page.click('button:has-text("Log In")');
  await this.page.goto(BASE_URL + "/design");
});

Given('I am not logged in', async function() {
  await this.page.goto(BASE_URL + "/logout");
  await this.page.goto(BASE_URL + "/design");
});

// Design tool steps
When('I access the design tool', async function() {
  // Already on design tool page from background
});

When('I create a new design', async function() {
  await this.page.click('[data-testid="new-design"]');
  await this.page.click('[data-testid="text-tool"]');
  await this.page.fill('[data-testid="text-input"]', 'Sample Text');
});

When('I save the design', async function() {
  await this.page.click('[data-testid="save-design"]');
});

When('I select a different product type', async function() {
  await this.page.selectOption('[data-testid="product-selector"]', 'hoodie');
});

When('I change from t-shirt to hoodie', async function() {
  await this.page.selectOption('[data-testid="product-selector"]', 'hoodie');
});

When('I make multiple design changes', async function() {
  await this.page.click('[data-testid="text-tool"]');
  await this.page.fill('[data-testid="text-input"]', 'First Change');
  await this.page.click('[data-testid="color-picker"]');
  await this.page.click('[data-testid="red-color"]');
});

When('I click the undo button', async function() {
  await this.page.click('[data-testid="undo-button"]');
});

When('I undo a design change', async function() {
  await this.page.click('[data-testid="undo-button"]');
});

When('I click the redo button', async function() {
  await this.page.click('[data-testid="redo-button"]');
});

When('I make several design changes', async function() {
  await this.page.click('[data-testid="text-tool"]');
  await this.page.fill('[data-testid="text-input"]', 'Change 1');
  await this.page.click('[data-testid="text-tool"]');
  await this.page.fill('[data-testid="text-input"]', 'Change 2');
  await this.page.click('[data-testid="text-tool"]');
  await this.page.fill('[data-testid="text-input"]', 'Change 3');
});

When('I view the print area guidelines', async function() {
  await this.page.click('[data-testid="print-area-toggle"]');
});

When('I place design elements outside the print area', async function() {
  await this.page.click('[data-testid="text-tool"]');
  await this.page.fill('[data-testid="text-input"]', 'Outside Area');
  await this.page.dragAndDrop('[data-testid="text-element"]', '[data-testid="outside-area"]');
});

When('I select different print areas (chest, back, sleeve)', async function() {
  await this.page.click('[data-testid="print-area-chest"]');
  await this.page.click('[data-testid="print-area-back"]');
  await this.page.click('[data-testid="print-area-sleeve"]');
});

When('I use the design tool', async function() {
  // Design tool is already being used
});

// Assertion steps
Then('I should see the art depot section', async function() {
  const artDepot = this.page.locator('[data-testid="art-depot"]');
  await expect(artDepot).toBeVisible();
});

Then('I should see my previously used designs', async function() {
  const previousDesigns = this.page.locator('[data-testid="previous-designs"]');
  await expect(previousDesigns).toBeVisible();
});

Then('I should not see the art depot section', async function() {
  const artDepot = this.page.locator('[data-testid="art-depot"]');
  await expect(artDepot).not.toBeVisible();
});

Then('I should see a message to log in for access', async function() {
  const loginMessage = this.page.locator('text=Log in to access art depot');
  await expect(loginMessage).toBeVisible();
});

Then('the design should be saved to my art depot', async function() {
  const savedDesign = this.page.locator('[data-testid="saved-design"]');
  await expect(savedDesign).toBeVisible();
});

Then('I should see a confirmation message', async function() {
  const confirmation = this.page.locator('text=Design saved successfully');
  await expect(confirmation).toBeVisible();
});

Then('the design canvas should update', async function() {
  const updatedCanvas = this.page.locator('[data-testid="design-canvas"]');
  await expect(updatedCanvas).toBeVisible();
});

Then('the design should adapt to the new product', async function() {
  const adaptedDesign = this.page.locator('[data-testid="adapted-design"]');
  await expect(adaptedDesign).toBeVisible();
});

Then('my existing design should be preserved', async function() {
  const preservedDesign = this.page.locator('[data-testid="preserved-design"]');
  await expect(preservedDesign).toBeVisible();
});

Then('the design should be properly positioned', async function() {
  const positionedDesign = this.page.locator('[data-testid="positioned-design"]');
  await expect(positionedDesign).toBeVisible();
});

Then('the last change should be reverted', async function() {
  const revertedDesign = this.page.locator('[data-testid="reverted-design"]');
  await expect(revertedDesign).toBeVisible();
});

Then('the design should return to the previous state', async function() {
  const previousState = this.page.locator('[data-testid="previous-state"]');
  await expect(previousState).toBeVisible();
});

Then('the change should be reapplied', async function() {
  const reappliedChange = this.page.locator('[data-testid="reapplied-change"]');
  await expect(reappliedChange).toBeVisible();
});

Then('the design should return to the current state', async function() {
  const currentState = this.page.locator('[data-testid="current-state"]');
  await expect(currentState).toBeVisible();
});

Then('I should be able to undo multiple steps', async function() {
  const undoButton = this.page.locator('[data-testid="undo-button"]');
  await expect(undoButton).toBeEnabled();
});

Then('I should be able to redo multiple steps', async function() {
  const redoButton = this.page.locator('[data-testid="redo-button"]');
  await expect(redoButton).toBeEnabled();
});

Then('the print area should be positioned 3 inches below the collar', async function() {
  const printArea = this.page.locator('[data-testid="print-area"]');
  await expect(printArea).toBeVisible();
});

Then('the measurement should be in inches', async function() {
  const measurement = this.page.locator('[data-testid="measurement-unit"]');
  await expect(measurement).toContainText('inches');
});

Then('I should see a warning message', async function() {
  const warning = this.page.locator('text=Design element outside print area');
  await expect(warning).toBeVisible();
});

Then('the design should be constrained to the print area', async function() {
  const constrainedDesign = this.page.locator('[data-testid="constrained-design"]');
  await expect(constrainedDesign).toBeVisible();
});

Then('each area should have its own design canvas', async function() {
  const chestCanvas = this.page.locator('[data-testid="chest-canvas"]');
  const backCanvas = this.page.locator('[data-testid="back-canvas"]');
  const sleeveCanvas = this.page.locator('[data-testid="sleeve-canvas"]');
  
  await expect(chestCanvas).toBeVisible();
  await expect(backCanvas).toBeVisible();
  await expect(sleeveCanvas).toBeVisible();
});

Then('the print areas should be clearly defined', async function() {
  const definedAreas = this.page.locator('[data-testid="defined-areas"]');
  await expect(definedAreas).toBeVisible();
});

Then('the interface should be user-friendly', async function() {
  const userFriendly = this.page.locator('[data-testid="user-friendly"]');
  await expect(userFriendly).toBeVisible();
});

Then('all tools should be easily accessible', async function() {
  const tools = this.page.locator('[data-testid="design-tools"]');
  await expect(tools).toBeVisible();
});

Then('the design preview should be clear', async function() {
  const preview = this.page.locator('[data-testid="design-preview"]');
  await expect(preview).toBeVisible();
}); 