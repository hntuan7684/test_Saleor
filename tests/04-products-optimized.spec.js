// products-optimized.spec.js
import { test } from './global-test.js';
import { expect } from "@playwright/test";
import { ProductsPage } from "./pageObjects/ProductsPage.js";

test.describe("Products Page Tests - Optimized", () => {
  let productsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
  });

  test("PR001 - Home link navigation", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.clickHomeLink();
    await expect(page).toHaveURL("https://zoomprints.com/us");
  });

  test("PR002 - Products label visibility", async ({ page }) => {
    await productsPage.navigate();
    await expect(productsPage.productsLabel).toBeVisible();
  });

  test("PR003 - Home link hover effect", async ({ page }) => {
    await productsPage.navigate();
    
    const beforeTransform = await productsPage.homeLink.evaluate(
      (el) => getComputedStyle(el).transform
    );
    await productsPage.homeLink.hover();
    await page.waitForTimeout(300);
    const afterTransform = await productsPage.homeLink.evaluate(
      (el) => getComputedStyle(el).transform
    );
    expect(afterTransform).not.toBe(beforeTransform);
  });

  test("PR004 - Breadcrumb icons display", async ({ page }) => {
    await productsPage.navigate();
    await expect(productsPage.breadcrumbIcons.nth(0)).toBeVisible();
    await expect(productsPage.breadcrumbIcons.nth(1)).toBeVisible();
  });

  test("PR005 - Breadcrumb order validation", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyBreadcrumb();
  });

  test("PR006 - Offline navigation handling", async ({ page }) => {
    await productsPage.navigate();
    await page.context().setOffline(true);
    await productsPage.clickHomeLink();
    await page.waitForTimeout(1000);
    await page.context().setOffline(false);
  });

  test("PR007 - Product structure validation", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyProductStructure();
  });

  test("PR008 - Products label non-actionable", async ({ page }) => {
    await productsPage.navigate();
    const tag = await productsPage.productsLabel.evaluate((el) => el.tagName);
    expect(tag).not.toBe("A");
    await expect(page).toHaveURL("https://zoomprints.com/us/products");
  });

  test("PR009 - No unexpected popup on hover", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.homeLink.hover();
    const popup = page.locator(".popup, .tooltip, .modal");
    await expect(popup).toHaveCount(0);
  });

  test("PR010 - Product list displays products", async ({ page }) => {
    await productsPage.navigate();
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    await expect(productsPage.productNames.first()).toBeVisible();
  });

  test("PR011 - Product name and description", async ({ page }) => {
    await productsPage.navigate();
    
    const productName = productsPage.productNames.filter({ hasText: "BELLA + CANVAS" }).first();
    const productDescription = productsPage.productDescriptions.first();

    await expect(productName).toBeVisible();
    await expect(productDescription).toBeVisible();

    const nameText = await productName.textContent();
    const descText = await productDescription.textContent();
    
    expect(nameText.trim()).toBe("BELLA + CANVAS");
    expect(descText.trim()).toContain("BELLA + CANVAS Jersey Tee");
  });

  test("PR012 - Product navigation to detail page", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.testNavigation();
  });

  test("PR013 - Product image loading", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyImagesLoaded();
  });

  test("PR014 - Product descriptions validation", async ({ page }) => {
    await productsPage.navigate();
    
    const descText = await productsPage.getProductDescription(0);
    expect(descText.length).toBeGreaterThan(20);
    expect(descText).toContain("Introducing") || expect(descText).toContain("The");
  });

  test("PR015 - Product card hover effect", async ({ page }) => {
    await productsPage.navigate();
    
    const { before, after } = await productsPage.testHoverEffects();
    expect(after.width).toBeGreaterThanOrEqual(before.width);
  });

  test("PR016 - Grid layout validation", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyGridLayout();
  });

  test("PR017 - Product links validation", async ({ page }) => {
    await productsPage.navigate();
    
    const count = await productsPage.getProductCount();
    for (let i = 0; i < count; i++) {
      const href = await productsPage.getProductHref(i);
      expect(href).not.toMatch(/undefined|null|broken/i);
      expect(href).toContain("/us/products/");
    }
  });

  test("PR018 - Multiple products display", async ({ page }) => {
    await productsPage.navigate();
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(5);
  });

  test("PR019 - Mobile responsiveness", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyResponsiveBehavior();
  });

  test("PR020 - Products label styling", async ({ page }) => {
    await productsPage.navigate();
    
    const fontSize = await productsPage.productsLabel.evaluate(
      (el) => getComputedStyle(el).fontSize
    );
    const color = await productsPage.productsLabel.evaluate(
      (el) => getComputedStyle(el).color
    );
    expect(fontSize).toMatch(/\d+px/);
    expect(color).toMatch(/rgb/);
  });

  test("PR021 - Hover effect isolation", async ({ page }) => {
    await productsPage.navigate();
    
    const unrelated = productsPage.productElements.first();
    const before = await unrelated.boundingBox();
    await productsPage.homeLink.hover();
    await page.waitForTimeout(300);
    const after = await unrelated.boundingBox();
    expect(after).toMatchObject(before);
  });

  test("PR022 - Image alt attributes", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyImageAltText();
  });

  test("PR023 - Product card clickability", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.testNavigation();
  });

  test("PR024 - Product card structure", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyProductStructure();
  });

  test("PR025 - Responsive grid behavior", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyResponsiveBehavior();
  });

  test("PR026 - Image loading validation", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyImagesLoaded();
  });

  test("PR027 - Page layout validation", async ({ page }) => {
    await productsPage.navigate();
    await productsPage.verifyPageLayout();
    await productsPage.verifyPageTitle();
  });

  test("PR028 - Product count consistency", async ({ page }) => {
    await productsPage.navigate();
    
    const productCount = await productsPage.getProductCount();
    const nameCount = await productsPage.productNames.count();
    const imageCount = await productsPage.productImages.count();
    const linkCount = await productsPage.productLinks.count();
    
    expect(productCount).toBe(nameCount);
    expect(productCount).toBe(imageCount);
    expect(productCount).toBe(linkCount);
  });

  test("PR029 - Product data consistency", async ({ page }) => {
    await productsPage.navigate();
    
    const count = await productsPage.getProductCount();
    for (let i = 0; i < Math.min(count, 3); i++) { // Test first 3 products
      const name = await productsPage.getProductName(i);
      const description = await productsPage.getProductDescription(i);
      const href = await productsPage.getProductHref(i);
      
      expect(name.trim()).toBeTruthy();
      expect(description.trim()).toBeTruthy();
      expect(href).toContain('/us/products/');
    }
  });

  test("PR030 - Performance validation", async ({ page }) => {
    const startTime = Date.now();
    await productsPage.navigate();
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Images should be visible quickly
    await expect(productsPage.productImages.first()).toBeVisible({ timeout: 3000 });
  });
}); 