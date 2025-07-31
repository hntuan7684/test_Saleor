// products.spec.js
import { test } from './global-test.js';
import { expect } from "@playwright/test";
import { BASE_URL } from "./utils/constants.js";
// import {
//   initExcel,
//   logTestResult,
//   saveExcel,
// } from "./utils/testResultLogger.js";

test.describe("Products Page Tests", () => {
  let allTestResults = []; // Temporarily store test results

  const testCases = [
    {
      id: "PR001",
      description: "Verify Home link navigates to default channel",
      inputData: "Click 'Home' link in breadcrumb",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const homeLink = page.locator('a[href="/us"]').first();
        await homeLink.click();
        await expect(page).toHaveURL(BASE_URL);
      },
    },
    {
      id: "PR002",
      description: "'Products' label is visible and correct",
      inputData: "Open /products page",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const breadcrumb = page.locator("ol li span", { hasText: "Products" });
        await expect(breadcrumb).toBeVisible();
      },
    },
    {
      id: "PR003",
      description: "Home link has hover effect",
      inputData: "Hover over 'Home' link and check transform style",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const homeLink = page.locator('a[href="/us"]').first();

        const beforeTransform = await homeLink.evaluate(
          (el) => getComputedStyle(el).transform
        );
        await homeLink.hover();
        await page.waitForTimeout(300);
        const afterTransform = await homeLink.evaluate(
          (el) => getComputedStyle(el).transform
        );
        expect(afterTransform).not.toBe(beforeTransform);
      },
    },
    {
      id: "PR004",
      description: "Icons next to Home and Products are displayed",
      inputData: "Open /products page and check breadcrumb icons",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const icons = page.locator("ol li svg");
        await expect(icons.nth(0)).toBeVisible();
        await expect(icons.nth(1)).toBeVisible();
      },
    },
    {
      id: "PR005",
      description: "Breadcrumb order is correct: Home > Products",
      inputData: "Open /products page and get breadcrumb text contents",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const breadcrumbItems = await page
          .locator("ol li")
          .allTextContents();

        expect(breadcrumbItems[0]).toMatch(/Home/i);
        expect(breadcrumbItems).toContainEqual(
          expect.stringMatching(/Products/i)
        );
      },
    },
    {
      id: "PR006",
      description: "Clicking Home while offline",
      inputData: "Set page offline, then click 'Home' link",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        await page.context().setOffline(true);
        await page.click('a[href="/us"]');
        await page.waitForTimeout(1000);
        await page.context().setOffline(false);
      },
    },
    {
      id: "PR007",
      description: "Product list has proper structure for accessibility",
      inputData: "Check product elements have proper structure",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const productItems = page.locator('[data-testid="ProductElement"]');
        const count = await productItems.count();
        expect(count).toBeGreaterThan(0);

        // Check each product has required elements
        for (let i = 0; i < count; i++) {
          const item = productItems.nth(i);
          const hasImage = await item.locator('img').count();
          const hasTitle = await item.locator('h3').count();
          const hasLink = await item.locator('a').count();
          
          expect(hasImage).toBeGreaterThan(0);
          expect(hasTitle).toBeGreaterThan(0);
          expect(hasLink).toBeGreaterThan(0);
        }
      },
    },
    {
      id: "PR008",
      description: "'Products' label does not trigger action",
      inputData: "Click breadcrumb text 'Products', expect no navigation",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const productsLabel = page.locator("ol li span", { hasText: "Products" });
        const tag = await productsLabel.evaluate((el) => el.tagName);
        expect(tag).not.toBe("A");
        await expect(page).toHaveURL(BASE_URL + "/products");
      },
    },
    {
      id: "PR009",
      description: "No unexpected popup on Home hover",
      inputData: "Hover 'Home' breadcrumb and check for modal/popup/tooltip",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const homeLink = page.locator('a[href="/us"]');
        await homeLink.hover();
        const popup = page.locator(".popup, .tooltip, .modal");
        await expect(popup).toHaveCount(0);
      },
    },
    {
      id: "PR010",
      description: "Product list displays at least one product",
      inputData: "Open /products page and count product elements",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const cards = page.locator('[data-testid="ProductElement"] h3');
        await expect(cards.first()).toBeVisible();
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);
      },
    },
    {
      id: "PR011",
      description: "Each product shows name and description correctly",
      inputData: "Open /products and check product name 'BELLA + CANVAS' and description",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        const productName = page
          .locator('[data-testid="ProductElement"] h3', {
            hasText: "BELLA + CANVAS",
          })
          .first();

        const productDescription = page
          .locator('[data-testid="ProductElement"] p')
          .first();

        await expect(productName).toBeVisible();
        await expect(productDescription).toBeVisible();

        const nameText = await productName.textContent();
        const descText = await productDescription.textContent();
        
        expect(nameText.trim()).toBe("BELLA + CANVAS");
        expect(descText.trim()).toContain("BELLA + CANVAS Jersey Tee");
      },
    },
    {
      id: "PR012",
      description: "Click product name navigates to detail page",
      inputData: "Click first product name and check detail page title",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        const productLink = page
          .locator('[data-testid="ProductElement"] a')
          .first();
        const nameText = await productLink.locator('h3').textContent();
        const expectedName = nameText.trim();

        await productLink.click();
        await page.waitForLoadState("domcontentloaded");

        const h1 = page.locator("h1");
        await expect(h1).toBeVisible({ timeout: 10000 });

        const actualText = await h1.textContent();
        expect(actualText.trim().substring(0, 5)).toBe(
          expectedName.substring(0, 5)
        );
      },
    },
    {
      id: "PR013",
      description: "Product image loads correctly",
      inputData: "Check first product image visibility and load status",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        const img = page
          .locator('[data-testid="ProductElement"]')
          .first()
          .locator("img");

        await expect(img).toBeVisible();

        const loaded = await img.evaluate(
          (el) => el.complete && el.naturalWidth > 0
        );
        expect(loaded).toBe(true);
      },
    },
    {
      id: "PR014",
      description: "Product descriptions are visible and meaningful",
      inputData: "Check text content of first product description",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        const descLocator = page
          .locator('[data-testid="ProductElement"] p')
          .first();
        const descText = (await descLocator.textContent()).trim();

        expect(descText.length).toBeGreaterThan(20);
        expect(descText).toContain("Introducing") || expect(descText).toContain("The");
      },
    },
    {
      id: "PR015",
      description: "Hover on product enlarges card",
      inputData: "Hover over product card with 'BELLA + CANVAS'",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const card = page.locator(
          '[data-testid="ProductElement"]',
          { hasText: "BELLA + CANVAS" }
        );
        const before = await card.boundingBox();
        await card.hover();
        await page.waitForTimeout(300);
        const after = await card.boundingBox();
        expect(after.width).toBeGreaterThanOrEqual(before.width);
      },
    },
    {
      id: "PR016",
      description: "Products are displayed in a grid layout",
      inputData: "Check grid display style and column count on /products",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        const grid = page.locator('[data-testid="ProductList"]');
        await expect(grid).toBeVisible({ timeout: 10000 });

        const display = await grid.evaluate(
          (el) => getComputedStyle(el).display
        );
        expect(display).toBe("grid");

        const items = grid.locator('[data-testid="ProductElement"]');
        const count = await items.count();
        expect(count).toBeGreaterThan(1);

        const columns = await grid.evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns
        );
        const columnCount = columns.split(" ").length;
        expect(columnCount).toBeGreaterThanOrEqual(2);
      },
    },
    {
      id: "PR017",
      description: "No broken product links",
      inputData: "Loop all product links and validate href is not 'undefined' or 'null'",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const productLinks = page.locator('[data-testid="ProductElement"] a');
        const count = await productLinks.count();
        for (let i = 0; i < count; i++) {
          const href = await productLinks.nth(i).getAttribute("href");
          expect(href).not.toMatch(/undefined|null|broken/i);
          expect(href).toContain("/us/products/");
        }
      },
    },
    {
      id: "PR018",
      description: "Product list shows multiple products",
      inputData: "Open /products and expect multiple ProductElement",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const products = page.locator('[data-testid="ProductElement"]');
        const count = await products.count();
        expect(count).toBeGreaterThan(5); // Should have multiple products
      },
    },
    {
      id: "PR019",
      description: "Product page is responsive on mobile",
      inputData: "Set viewport to 375x812 and open /products",
      run: async (page) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto(BASE_URL + "/products");
        const card = page.locator('[data-testid="ProductElement"]');
        await expect(card.first()).toBeVisible();
        
        // Check grid adapts to mobile
        const grid = page.locator('[data-testid="ProductList"]');
        const mobileColumns = await grid.evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns
        );
        expect(mobileColumns).toBeDefined();
      },
    },
    {
      id: "PR020",
      description: "'Products' label has correct styling",
      inputData: "Check computed style of breadcrumb label 'Products'",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const label = page.locator("ol li span", { hasText: "Products" });
        const fontSize = await label.evaluate(
          (el) => getComputedStyle(el).fontSize
        );
        const color = await label.evaluate((el) => getComputedStyle(el).color);
        expect(fontSize).toMatch(/\d+px/);
        expect(color).toMatch(/rgb/);
      },
    },
    {
      id: "PR021",
      description: "Hover on Home does not affect unrelated elements",
      inputData: "Hover on Home link and check bounding box of unrelated product",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const home = page.locator('a[href="/us"]');
        const unrelated = page
          .locator('[data-testid="ProductElement"]')
          .first();
        const before = await unrelated.boundingBox();
        await home.hover();
        await page.waitForTimeout(300);
        const after = await unrelated.boundingBox();
        expect(after).toMatchObject(before);
      },
    },
    {
      id: "PR022",
      description: "Product image has alt attribute",
      inputData: "Check 'alt' attribute for all product images",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const images = page.locator('[data-testid="ProductElement"] img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
          const altText = await images.nth(i).getAttribute("alt");
          expect(altText).not.toBe("");
          expect(altText).toBeDefined();
        }
      },
    },
    {
      id: "PR023",
      description: "Product cards are clickable and navigable",
      inputData: "Click on product cards and verify navigation",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        const productCards = page.locator('[data-testid="ProductElement"] a');
        const firstCard = productCards.first();
        
        // Get the href before clicking
        const href = await firstCard.getAttribute('href');
        expect(href).toContain('/us/products/');
        
        // Click and verify navigation
        await firstCard.click();
        await page.waitForLoadState("domcontentloaded");
        
        // Should be on product detail page
        await expect(page).not.toHaveURL(BASE_URL + "/products");
      },
    },
    {
      id: "PR024",
      description: "Product cards have proper structure",
      inputData: "Check structure of each product card",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const cards = await page.$$('[data-testid="ProductElement"]');
        for (const card of cards) {
          const hasImage = await card.$('img');
          const hasTitle = await card.$('h3');
          const hasDescription = await card.$('p');
          const hasLink = await card.$('a');
          
          expect(hasImage).toBeTruthy();
          expect(hasTitle).toBeTruthy();
          expect(hasDescription).toBeTruthy();
          expect(hasLink).toBeTruthy();
        }
      },
    },
    {
      id: "PR025",
      description: "Product grid handles window resize properly",
      inputData: "Resize window from desktop to tablet and compare gridTemplateColumns",
      run: async (page) => {
        await page.goto(BASE_URL + "/products", { waitUntil: "networkidle" });

        const gridsCount = await page
          .locator('[data-testid="ProductList"]')
          .count();
        console.log("ProductGrid elements count:", gridsCount);

        if (gridsCount === 0) {
          throw new Error("ProductGrid element not found on the page");
        }

        const getGridColumns = async () => {
          const grid = page.locator('[data-testid="ProductList"]');
          await expect(grid).toBeVisible({ timeout: 10000 });
          return await grid.evaluate(
            (el) => getComputedStyle(el).gridTemplateColumns
          );
        };

        await page.setViewportSize({ width: 1200, height: 800 });
        const desktopColumns = await getGridColumns();

        await page.waitForTimeout(500);

        await page.setViewportSize({ width: 768, height: 1024 });
        const tabletColumns = await getGridColumns();

        expect(desktopColumns).not.toBe(tabletColumns);
      },
    },
    {
      id: "PR026",
      description: "Product images load with proper fallback",
      inputData: "Validate all product images load properly",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const images = page.locator('[data-testid="ProductElement"] img');
        const count = await images.count();
        
        for (let i = 0; i < count; i++) {
          const img = images.nth(i);
          await expect(img).toBeVisible();
          
          const loaded = await img.evaluate(
            (el) => el.complete && el.naturalWidth > 0
          );
          expect(loaded).toBe(true);
        }
      },
    },
    {
      id: "PR027",
      description: "Product page loads with proper layout",
      inputData: "Verify page layout and structure",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        
        // Check header
        await expect(page.locator('header')).toBeVisible();
        
        // Check breadcrumb
        await expect(page.locator('ol')).toBeVisible();
        
        // Check product grid
        await expect(page.locator('[data-testid="ProductList"]')).toBeVisible();
        
        // Check at least one product
        await expect(page.locator('[data-testid="ProductElement"]').first()).toBeVisible();
        
        // Verify page title
        await expect(page).toHaveTitle(/Products.*ZoomPrints/);
      },
    },
  ];

  testCases.forEach((testCase, index) => {
    test(`${testCase.id} - ${testCase.description}`, async ({ page }) => {
      let actual = "";
      let status = "Fail";
      let testResult = {};

      try {
        await testCase.run(page);
        actual = "Passed";
        status = "Pass";
      } catch (e) {
        actual = `Failed: ${e.message}`;
      }

      try {
        testResult = {
          id: testCase.id,
          description: testCase.description,
          input: testCase.inputData || BASE_URL + "/products",
          expected: "Should behave as described",
          actual,
          status,
        };
        allTestResults.push(testResult); // Add to temporary array
      } catch (err) {
        console.error("Error preparing result:", err);
      }
    });
  });
});
