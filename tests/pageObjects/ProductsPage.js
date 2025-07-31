const { expect } = require("@playwright/test");
const { BASE_URL } = require("../utils/constants");

class ProductsPage {
  constructor(page) {
    this.page = page;

    // Navigation selectors
    this.homeLink = page.locator('a[href="/us"]').first();
    this.breadcrumbContainer = page.locator('ol');
    this.productsLabel = page.locator("ol li span", { hasText: "Products" });
    this.breadcrumbIcons = page.locator("ol li svg");

    // Product list selectors
    this.productList = page.locator('[data-testid="ProductList"]');
    this.productElements = page.locator('[data-testid="ProductElement"]');
    this.productNames = page.locator('[data-testid="ProductElement"] h3');
    this.productDescriptions = page.locator('[data-testid="ProductElement"] p');
    this.productImages = page.locator('[data-testid="ProductElement"] img');
    this.productLinks = page.locator('[data-testid="ProductElement"] a');

    // Filter selectors (if available)
    this.filterButtons = page.locator('button[type="button"]');
    this.resetFiltersButton = page.locator('button:has-text("Reset Filters")');

    // Layout selectors
    this.header = page.locator('header');
    this.mainContent = page.locator('main, .main, [role="main"]');
  }

  async navigate() {
    await this.page.goto(BASE_URL + "/products");
    await this.page.waitForLoadState("networkidle");
  }

  async clickHomeLink() {
    await this.homeLink.click();
  }

  async getProductCount() {
    return await this.productElements.count();
  }

  async getProductName(index = 0) {
    return await this.productNames.nth(index).textContent();
  }

  async getProductDescription(index = 0) {
    return await this.productDescriptions.nth(index).textContent();
  }

  async clickProduct(index = 0) {
    await this.productLinks.nth(index).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getProductHref(index = 0) {
    return await this.productLinks.nth(index).getAttribute("href");
  }

  async hoverProduct(index = 0) {
    await this.productElements.nth(index).hover();
  }

  async getProductBoundingBox(index = 0) {
    return await this.productElements.nth(index).boundingBox();
  }

  async verifyProductStructure() {
    const count = await this.getProductCount();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const element = this.productElements.nth(i);
      
      // Check required elements exist
      const hasImage = await element.locator('img').count();
      const hasTitle = await element.locator('h3').count();
      const hasDescription = await element.locator('p').count();
      const hasLink = await element.locator('a').count();
      
      expect(hasImage).toBeGreaterThan(0);
      expect(hasTitle).toBeGreaterThan(0);
      expect(hasDescription).toBeGreaterThan(0);
      expect(hasLink).toBeGreaterThan(0);
    }
  }

  async verifyGridLayout() {
    await expect(this.productList).toBeVisible();
    
    const display = await this.productList.evaluate(
      (el) => getComputedStyle(el).display
    );
    expect(display).toBe("grid");

    const columns = await this.productList.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns
    );
    const columnCount = columns.split(" ").length;
    expect(columnCount).toBeGreaterThanOrEqual(2);
  }

  async verifyBreadcrumb() {
    await expect(this.breadcrumbContainer).toBeVisible();
    await expect(this.productsLabel).toBeVisible();
    
    const breadcrumbItems = await this.breadcrumbContainer.locator("li").allTextContents();
    expect(breadcrumbItems).toContainEqual(expect.stringMatching(/Products/i));
  }

  async verifyImagesLoaded() {
    const count = await this.productImages.count();
    
    for (let i = 0; i < count; i++) {
      const img = this.productImages.nth(i);
      await expect(img).toBeVisible();
      
      const loaded = await img.evaluate(
        (el) => el.complete && el.naturalWidth > 0
      );
      expect(loaded).toBe(true);
    }
  }

  async verifyImageAltText() {
    const count = await this.productImages.count();
    
    for (let i = 0; i < count; i++) {
      const altText = await this.productImages.nth(i).getAttribute("alt");
      expect(altText).not.toBe("");
      expect(altText).toBeDefined();
    }
  }

  async setViewportSize(width, height) {
    await this.page.setViewportSize({ width, height });
  }

  async getGridColumns() {
    return await this.productList.evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns
    );
  }

  async verifyResponsiveBehavior() {
    // Desktop view
    await this.setViewportSize(1200, 800);
    const desktopColumns = await this.getGridColumns();
    
    // Mobile view
    await this.setViewportSize(375, 812);
    const mobileColumns = await this.getGridColumns();
    
    expect(desktopColumns).not.toBe(mobileColumns);
  }

  async verifyPageTitle() {
    await expect(this.page).toHaveTitle(/Products.*ZoomPrints/);
  }

  async verifyPageLayout() {
    await expect(this.header).toBeVisible();
    await expect(this.breadcrumbContainer).toBeVisible();
    await expect(this.productList).toBeVisible();
    await expect(this.productElements.first()).toBeVisible();
  }

  async testHoverEffects() {
    const before = await this.getProductBoundingBox(0);
    await this.hoverProduct(0);
    await this.page.waitForTimeout(300);
    const after = await this.getProductBoundingBox(0);
    
    return { before, after };
  }

  async testNavigation() {
    const href = await this.getProductHref(0);
    expect(href).toContain('/us/products/');
    
    await this.clickProduct(0);
    await expect(this.page).not.toHaveURL(BASE_URL + "/products");
  }
}

module.exports = { ProductsPage }; 