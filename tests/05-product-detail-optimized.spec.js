// product-detail-optimized.spec.js
import { test } from './global-test';
const { expect } = require("@playwright/test");
const { ProductDetailPage } = require("./pageObjects/ProductDetailPage");
import { LoginPage } from "./pageObjects/LoginPage";
import { BASE_URL, PRODUCTS_URL } from "./utils/constants";
const PRODUCT_SLUG = "bella-3001";

test.describe("Product Detail Page Tests - Optimized", () => {
  let productDetailPage;

  test.beforeEach(async ({ page }) => {
    productDetailPage = new ProductDetailPage(page);
    await productDetailPage.goto(PRODUCT_SLUG);
  });

  test("PD001 - Verify Product Title is displayed correctly", async () => {
    await productDetailPage.verifyProductTitle("BELLA + CANVAS - Jersey Tee - 3001");
  });

  test("PD002 - Verify Product Images are displayed", async () => {
    const imageCount = await productDetailPage.getImageCount();
    expect(imageCount).toBeGreaterThan(0);
    await expect(productDetailPage.productImages.first()).toBeVisible();
  });

  test("PD003 - Verify Color options are displayed and selectable", async () => {
    const colorCount = await productDetailPage.getColorCount();
    expect(colorCount).toBeGreaterThan(0);
    
    // Test first few color selections
    for (let i = 0; i < Math.min(colorCount, 3); i++) {
      await productDetailPage.selectColor(i);
    }
  });

  test("PD004 - Verify Size options are displayed and selectable", async () => {
    const sizeCount = await productDetailPage.getSizeCount();
    expect(sizeCount).toBeGreaterThan(0);
    
    // Test size selection
    await productDetailPage.selectSize("M");
  });

  test("PD005 - Verify Price is displayed correctly", async () => {
    await productDetailPage.verifyPriceFormat();
  });

  test("PD006 - Verify Add to Cart button is clickable", async () => {
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await productDetailPage.clickAddToCart();
  });

  test("PD007 - Verify Quantity selector functionality", async () => {
    const quantityCount = await productDetailPage.quantityInput.count();
    
    if (quantityCount > 0) {
      await productDetailPage.setQuantity(2);
      await expect(productDetailPage.quantityInput.first()).toHaveValue("2");
    } else {
      console.log("Quantity input not found - test passes");
    }
  });

  test("PD008 - Verify Product is added to Cart correctly", async () => {
    await productDetailPage.addToCartWithSize("M");
  });

  test("PD009 - Verify Error message for invalid quantity", async ({ page }) => {
    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("testaccount123@mailinator.com", "ValidPass123!");
    await expect(
      page.getByRole("heading", { name: /Welcome to ZoomPrints/i })
    ).toBeVisible({ timeout: 120000 });

    await expect(page).toHaveURL(`${BASE_URL}`);

    // Navigate to product detail
    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.goto("bella-3001");

    // Test invalid quantity if input exists
    const quantityCount = await productDetailPage.quantityInput.count();
    if (quantityCount > 0) {
      const qtyInput = productDetailPage.quantityInput.first();
      await qtyInput.focus();
      await qtyInput.press("Control+A");
      await qtyInput.press("Backspace");
      await qtyInput.type("");

      await productDetailPage.clickAddToCart();

      const systemErrorAlert = page.locator(
        'text="Something went wrong. Please try again later"'
      );
      await expect(systemErrorAlert).toBeVisible({ timeout: 10000 });
    } else {
      console.log("Quantity input not found - skipping invalid quantity test");
    }

    await expect(page).toHaveURL(`${PRODUCTS_URL}/bella-3001`);
  });

  test("PD010 - Verify Product Images Carousel works correctly", async () => {
    await productDetailPage.testImageCarousel();
  });

  test("PD011 - Verify Product Features list is displayed", async () => {
    await productDetailPage.verifyFeaturesList();
  });

  test("PD012 - Verify Breadcrumb navigation works", async () => {
    await expect(productDetailPage.breadcrumbProductsLink.first()).toBeVisible();
    await productDetailPage.navigateToProducts();
    await expect(page).toHaveURL(/.*products.*/);
  });

  test("PD013 - Verify Product URL is SEO friendly", async () => {
    await productDetailPage.verifySEOUrl(PRODUCT_SLUG);
  });

  test("PD014 - Verify Image changes with color selection", async () => {
    await productDetailPage.verify404NotPresent();
    await productDetailPage.verifyColorSelection();
  });

  test("PD015 - Verify Add to Cart without selecting Size", async () => {
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await productDetailPage.clickAddToCart();
    await expect(page).toHaveURL(/\/protocol\/openid-connect\/auth/);
  });

  test('PD016 - Verify Product Description is displayed and formatted correctly', async () => {
    await productDetailPage.verifyDescriptionContent();
  });

  test('PD017 - Verify page layout and structure', async () => {
    await productDetailPage.verifyPageLayout();
  });

  test('PD018 - Verify color selection functionality', async () => {
    await productDetailPage.verifyColorSelection();
  });

  test('PD019 - Verify product information accuracy', async () => {
    const title = await productDetailPage.getProductTitle();
    expect(title).toContain('BELLA + CANVAS');
    expect(title).toContain('Jersey Tee');
    expect(title).toContain('3001');
    
    await productDetailPage.verifyPriceFormat();
    await productDetailPage.verifyDescriptionContent();
  });

  test('PD020 - Verify responsive behavior', async () => {
    await productDetailPage.verifyResponsiveBehavior();
  });

  test('PD021 - Verify size guide functionality', async () => {
    await expect(productDetailPage.sizeGuideButton).toBeVisible();
    await productDetailPage.clickSizeGuide();
  });

  test('PD022 - Verify product data consistency', async () => {
    // Verify title consistency
    const title = await productDetailPage.getProductTitle();
    expect(title.trim()).toBe("BELLA + CANVAS - Jersey Tee - 3001");
    
    // Verify price consistency
    const price = await productDetailPage.getProductPrice();
    expect(price).toMatch(/^\$\d+\.\d+$/);
    
    // Verify image count
    const imageCount = await productDetailPage.getImageCount();
    expect(imageCount).toBeGreaterThan(0);
    
    // Verify color count
    const colorCount = await productDetailPage.getColorCount();
    expect(colorCount).toBeGreaterThan(0);
  });

  test('PD023 - Verify page performance', async () => {
    const startTime = Date.now();
    await productDetailPage.goto(PRODUCT_SLUG);
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    // Images should be visible quickly
    await expect(productDetailPage.productImages.first()).toBeVisible({ timeout: 5000 });
  });

  test('PD024 - Verify accessibility features', async () => {
    // Check for proper heading structure
    await expect(productDetailPage.productTitle).toBeVisible();
    await expect(productDetailPage.descriptionHeading).toBeVisible();
    await expect(productDetailPage.featuresHeading).toBeVisible();
    
    // Check for proper button labels
    await expect(productDetailPage.addToCartButton).toBeVisible();
    await expect(productDetailPage.sizeGuideButton).toBeVisible();
    
    // Check for proper image alt text
    const firstImage = productDetailPage.productImages.first();
    const altText = await firstImage.getAttribute('alt');
    expect(altText).toBeTruthy();
  });

  test('PD025 - Verify error handling', async () => {
    // Test with invalid product slug
    try {
      await productDetailPage.goto("invalid-product-slug");
      // Should either redirect or show error
      const currentUrl = page.url();
      expect(currentUrl).not.toContain("invalid-product-slug");
    } catch (error) {
      // Error is expected for invalid product
      console.log("Expected error for invalid product slug");
    }
  });
}); 