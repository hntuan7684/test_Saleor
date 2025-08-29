export class OrderQuantityPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Quantity input elements
    this.quantityInput = page.locator('input[name="quantity"]');
    this.addToCartButton = page.locator('button:has-text("Add to Cart")');
    
    // Validation messages
    this.minimumOrderMessage = page.locator('text=Minimum order quantity is 500 shirts');
    this.minimumOrderNote = page.locator('text=Minimum 500 orders required');
    this.supportNote = page.locator('text=contact support');
    this.errorMessage = page.locator('.error-message');
    
    // Navigation elements
    this.supportLink = page.locator('a:has-text("Contact Support")');
    this.checkoutButton = page.locator('button:has-text("Checkout")');
    
    // Permission elements
    this.specialPermissionIndicator = page.locator('[data-testid="special-permission"]');
    
    // UI elements
    this.quantityTooltip = page.locator('[data-tooltip*="minimum"]');
    this.quantityGuidance = page.locator('text=Enter quantity');
    
    // Success messages
    this.addedToCartMessage = page.locator('text=Added to cart');
  }

  /**
   * Navigate to product detail page
   */
  async navigateToProduct(productId = 'bella-3001') {
    await this.page.goto(`/products/${productId}`);
  }

  /**
   * Set quantity and add to cart
   * @param {number} quantity 
   */
  async setQuantityAndAddToCart(quantity) {
    await this.quantityInput.fill(quantity.toString());
    await this.addToCartButton.click();
  }

  /**
   * Add less than minimum quantity
   */
  async addLessThanMinimum() {
    await this.setQuantityAndAddToCart(100);
  }

  /**
   * Add exactly minimum quantity
   */
  async addExactlyMinimum() {
    await this.setQuantityAndAddToCart(500);
  }

  /**
   * Add more than minimum quantity
   */
  async addMoreThanMinimum() {
    await this.setQuantityAndAddToCart(1000);
  }

  /**
   * Enter invalid quantity
   */
  async enterInvalidQuantity() {
    await this.setQuantityAndAddToCart(50);
  }

  /**
   * Click support link for small orders
   */
  async clickSupportLink() {
    await this.supportLink.click();
  }

  /**
   * Check if minimum order message is visible
   * @returns {Promise<boolean>}
   */
  async hasMinimumOrderMessage() {
    return await this.minimumOrderMessage.isVisible();
  }

  /**
   * Check if order was accepted
   * @returns {Promise<boolean>}
   */
  async isOrderAccepted() {
    return await this.addedToCartMessage.isVisible();
  }

  /**
   * Check if can proceed to checkout
   * @returns {Promise<boolean>}
   */
  async canProceedToCheckout() {
    return await this.checkoutButton.isEnabled();
  }

  /**
   * Check if minimum order note is visible
   * @returns {Promise<boolean>}
   */
  async hasMinimumOrderNote() {
    return await this.minimumOrderNote.isVisible();
  }

  /**
   * Check if support note is visible
   * @returns {Promise<boolean>}
   */
  async hasSupportNote() {
    return await this.supportNote.isVisible();
  }

  /**
   * Check if special permission indicator is visible
   * @returns {Promise<boolean>}
   */
  async hasSpecialPermission() {
    return await this.specialPermissionIndicator.isVisible();
  }

  /**
   * Check if error message is visible
   * @returns {Promise<boolean>}
   */
  async hasErrorMessage() {
    return await this.errorMessage.isVisible();
  }

  /**
   * Check if quantity tooltip is visible
   * @returns {Promise<boolean>}
   */
  async hasQuantityTooltip() {
    return await this.quantityTooltip.isVisible();
  }

  /**
   * Check if quantity guidance is visible
   * @returns {Promise<boolean>}
   */
  async hasQuantityGuidance() {
    return await this.quantityGuidance.isVisible();
  }

  /**
   * Get current URL
   * @returns {Promise<string>}
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }
} 