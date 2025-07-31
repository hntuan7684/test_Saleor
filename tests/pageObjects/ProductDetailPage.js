const { expect } = require("@playwright/test");
const { PRODUCTS_URL } = require("../utils/constants");

class ProductDetailPage {
  constructor(page) {
    this.page = page;

    // Selectors based on MCP server analysis
    this.productTitle = page.locator("h1");
    this.productImages = page.locator("div[data-swiper-slide-index] img");
    this.colorButtons = page.locator('button.rounded-full[title]');
    this.sizeButtons = page.locator('button').filter({ hasText: /^(XS|S|M|L|XL|2XL|3XL|4XL|5XL)$/ });
    this.priceElement = page.locator(".price-main");
    this.addToCartButton = page.locator('button:has-text("Add to Cart")');
    this.quantityInput = page.locator('input[type="number"]');
    this.breadcrumbContainer = page.locator('ol');
    this.breadcrumbProductsLink = page.locator('a:has-text("Products")');
    this.descriptionHeading = page.locator('h2:has-text("Descriptions")');
    this.descriptionContent = page.locator('.prose');
    this.featuresHeading = page.locator('h2:has-text("Features")');
    this.featuresList = page.locator("ul li");
    this.header = page.locator('header');
    this.sizeGuideButton = page.locator('button:has-text("Size Guide")');
  }

  async goto(productSlug = "bella-3001") {
    try {
      await this.page.goto(`${PRODUCTS_URL}/${productSlug}`, {
        timeout: 60000,
        waitUntil: "load",
      });
      await this.page.waitForLoadState("networkidle");
    } catch (err) {
      console.error(
        `Navigation to product failed: ${PRODUCTS_URL}/${productSlug}`
      );
      throw err;
    }
  }

  async verifyProductDetails() {
    await expect(this.productTitle).toBeVisible();
    await expect(this.priceElement).toBeVisible();
    await expect(this.productImages.first()).toBeVisible();
    await expect(this.colorButtons.first()).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.descriptionHeading).toBeVisible();
    await expect(this.featuresHeading).toBeVisible();
  }

  async getProductTitle() {
    return await this.productTitle.textContent();
  }

  async getProductPrice() {
    return await this.priceElement.textContent();
  }

  async getImageCount() {
    return await this.productImages.count();
  }

  async getColorCount() {
    return await this.colorButtons.count();
  }

  async getSizeCount() {
    return await this.sizeButtons.count();
  }

  async selectColor(index = 0) {
    const count = await this.getColorCount();
    if (count > index) {
      const button = this.colorButtons.nth(index);
      await button.scrollIntoViewIfNeeded();
      await button.click();
      await this.page.waitForTimeout(500); // Wait for color change
    }
  }

  async selectSize(sizeLabel = "M") {
    const sizeButton = this.sizeButtons.filter({ hasText: sizeLabel });
    if (await sizeButton.count() > 0) {
      await sizeButton.first().click();
      await this.page.waitForTimeout(200);
    }
  }

  async setQuantity(quantity = 1) {
    const count = await this.quantityInput.count();
    if (count > 0) {
      await this.quantityInput.first().fill(quantity.toString());
    }
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }

  async clickSizeGuide() {
    await this.sizeGuideButton.click();
  }

  async navigateToProducts() {
    await this.breadcrumbProductsLink.first().click();
  }

  async verifyProductTitle(expectedTitle) {
    const actualTitle = await this.getProductTitle();
    expect(actualTitle.trim()).toBe(expectedTitle);
  }

  async verifyPriceFormat() {
    const price = await this.getProductPrice();
    expect(price).toMatch(/^\$\d+\.\d+$/);
  }

  async verifyColorSelection() {
    const count = await this.getColorCount();
    expect(count).toBeGreaterThan(0);
    
    // Test first color selection
    if (count > 0) {
      const firstButton = this.colorButtons.first();
      const initialSrc = await this.productImages.first().getAttribute("src");
      
      await firstButton.click();
      await this.page.waitForTimeout(1000);
      
      const newSrc = await this.productImages.first().getAttribute("src");
      expect(newSrc).not.toBe(initialSrc);
    }
  }

  async verifySizeSelection() {
    const count = await this.getSizeCount();
    expect(count).toBeGreaterThan(0);
    
    // Test first size selection
    if (count > 0) {
      const firstButton = this.sizeButtons.first();
      await firstButton.click();
      await this.page.waitForTimeout(200);
    }
  }

  async verifyDescriptionContent() {
    await expect(this.descriptionContent).toBeVisible();
    
    const descriptionText = await this.descriptionContent.locator('p').textContent();
    expect(descriptionText).toContain('BELLA + CANVAS');
    expect(descriptionText).toContain('comfort');
  }

  async verifyFeaturesList() {
    await expect(this.featuresHeading).toBeVisible();
    
    const count = await this.featuresList.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify first few features
    for (let i = 0; i < Math.min(count, 3); i++) {
      const featureText = await this.featuresList.nth(i).textContent();
      expect(featureText.trim()).toBeTruthy();
    }
  }

  async verifyPageLayout() {
    await expect(this.header).toBeVisible();
    await expect(this.breadcrumbContainer).toBeVisible();
    await expect(this.productTitle).toBeVisible();
    await expect(this.productImages.first()).toBeVisible();
    await expect(this.priceElement).toBeVisible();
    await expect(this.colorButtons.first()).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }

  async verifyResponsiveBehavior() {
    // Mobile viewport
    await this.page.setViewportSize({ width: 375, height: 812 });
    await expect(this.productTitle).toBeVisible();
    await expect(this.productImages.first()).toBeVisible();
    
    // Tablet viewport
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await expect(this.productTitle).toBeVisible();
    await expect(this.priceElement).toBeVisible();
    
    // Desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await expect(this.productTitle).toBeVisible();
    await expect(this.colorButtons.first()).toBeVisible();
  }

  async testImageCarousel() {
    const count = await this.getImageCount();
    if (count > 1) {
      const secondImage = this.productImages.nth(1);
      await secondImage.click();
      await this.page.waitForTimeout(500);
    }
  }

  async addToCartWithSize(size = "M") {
    await this.selectSize(size);
    await this.clickAddToCart();
  }

  async addToCartWithQuantity(quantity = 1) {
    await this.setQuantity(quantity);
    await this.clickAddToCart();
  }

  async verify404NotPresent() {
    const is404 = await this.page.locator("text=404").first().isVisible();
    expect(is404).toBeFalsy();
  }

  async verifySEOUrl(productSlug) {
    await expect(this.page).toHaveURL(new RegExp(productSlug));
  }
}

module.exports = { ProductDetailPage };
