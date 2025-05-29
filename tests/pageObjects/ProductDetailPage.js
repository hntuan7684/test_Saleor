const { expect } = require('@playwright/test');

class ProductDetailPage {
  constructor(page) {
    this.page = page;

    // Selectors
    this.productTitle = page.locator('h1');
    this.productPrice = page.locator('text=$10.00');
    this.productImage = page.locator('img >> nth=0');
    this.colorOptions = page.locator('[type="button"]');
    this.sizeButtons = page.locator('div:has-text("SIZE") >> button');
    this.quantityInput = page.locator('input[type="number"]');
    this.addToCartButton = page.locator('button:has-text("Add to Cart")');
    this.designButton = page.locator('button:has-text("Design")');
    this.descriptionText = page.locator('text=Descriptions').locator('xpath=..');
    this.featuresList = page.locator('text=Features').locator('xpath=../ul/li');
  }

  async goto(productSlug = 'bella-3001') {
    await this.page.goto(`https://mypod.io.vn/default-channel/products/${productSlug}`);
  }

  async verifyProductDetails() {
    await expect(this.productTitle).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productImage).toBeVisible();
    await expect(this.colorOptions).toHaveCountGreaterThan(0);
    await expect(this.sizeButtons).toHaveCountGreaterThan(0);
    await expect(this.quantityInput).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.designButton).toBeVisible();
    await expect(this.descriptionText).toContainText('The BELLA + CANVAS');
    await expect(this.featuresList).toHaveCountGreaterThan(5);
  }

  async selectSize(sizeLabel = 'M') {
    await this.page.locator(`button:has-text("${sizeLabel}")`).click();
  }

  async setQuantity(quantity = 2) {
    await this.quantityInput.fill('');
    await this.quantityInput.type(quantity.toString());
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }

  async clickDesign() {
    await this.designButton.click();
  }
}

module.exports = { ProductDetailPage };
