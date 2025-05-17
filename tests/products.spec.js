// products.spec.js
import { test, expect } from "@playwright/test";
import { BASE_URL } from "./utils/constants.js";
import {
  initExcel,
  logTestResult,
  saveExcel,
} from "./utils/testResultLogger.js";

test.describe("Products Page Tests", () => {
  let allTestResults = []; // Lưu trữ kết quả tạm thời

  test.beforeAll(async () => {
    await initExcel(); // Không cần truyền sheetName
  });

  const testCases = [
    {
      // id: "PR001",
      description: "Verify Home link navigates to default channel",
      inputData: "Click 'Home' link in breadcrumb",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const homeLink = page.locator('nav >> a:has-text("Home")').first();
        await homeLink.click();
        await expect(page).toHaveURL(BASE_URL);
      },
    },
    {
      // id: "PR002",
      description: "'Products' label is visible and correct",
      inputData: "Open /products page",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const breadcrumb = page.locator("nav >> text=Products");
        await expect(breadcrumb).toBeVisible();
      },
    },
    {
      // id: "PR003",
      description: "Home link has hover effect",
      inputData: "Hover over 'Home' link and check transform style",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const homeLink = page.locator('nav >> a:has-text("Home")').first();

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
      // id: "PR004",
      description: "Icons next to Home and Products are displayed",
      inputData: "Open /products page and check breadcrumb icons",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const icons = page.locator("nav svg");
        await expect(icons.nth(0)).toBeVisible();
        await expect(icons.nth(1)).toBeVisible();
      },
    },
    {
      // id: "PR005",
      description: "Breadcrumb order is correct: Home > Products",
      inputData: "Open /products page and get breadcrumb text contents",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const breadcrumbItems = await page
          .locator("nav a, nav span")
          .allTextContents();

        expect(breadcrumbItems[0]).toMatch(/Home/i);
        expect(breadcrumbItems).toContainEqual(
          expect.stringMatching(/Products/i)
        );
      },
    },
    {
      // id: "PR006",
      description: "Clicking Home while offline",
      inputData: "Set page offline, then click 'Home' link",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        await page.context().setOffline(true);
        await page.click('a:has-text("Home")');
        await page.waitForTimeout(1000);
        await page.context().setOffline(false);
      },
    },
    {
      // id: "PR007",
      description: "Product list has ARIA label for accessibility",
      inputData: "Check aria-label attribute for each product element",
      run: async (page) => {
        const productItems = page.locator('[data-testid="ProductElement"]');
        const count = await productItems.count();

        for (let i = 0; i < count; i++) {
          const item = productItems.nth(i);
          const ariaLabel = await item.getAttribute("aria-label");
          expect(ariaLabel).not.toBeNull();
        }
      },
    },
    {
      // id: "PR008",
      description: "'Products' label does not trigger action",
      inputData: "Click breadcrumb text 'Products', expect no navigation",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const productsLabel = page.locator("nav >> text=Products");
        const tag = await productsLabel.evaluate((el) => el.tagName);
        expect(tag).not.toBe("A");
        await expect(page).toHaveURL(BASE_URL + "/products");
      },
    },
    {
      // id: "PR009",
      description: "No unexpected popup on Home hover",
      inputData: "Hover 'Home' breadcrumb and check for modal/popup/tooltip",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const homeLink = page.locator('nav >> a:has-text("Home")');
        await homeLink.hover();
        const popup = page.locator(".popup, .tooltip, .modal");
        await expect(popup).toHaveCount(0);
      },
    },
    {
      // id: "PR010",
      description: "Product list displays at least one product",
      inputData: "Open /products page and count product elements",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const cards = page.locator('[data-testid="ProductElement"] h3');
        await expect(cards.first()).toBeVisible();
      },
    },

    {
      // id: "PR011",
      description: "Each product shows name and price correctly",
      inputData:
        "Open /products and check product name 'BELLA + CANVAS' and price format",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        const productName = page
          .locator('[data-testid="ProductElement"] h3', {
            hasText: "BELLA + CANVAS",
          })
          .first();

        const priceLocator = page
          .locator('[data-testid="ProductElement_PriceRange"]')
          .first();

        await expect(productName).toBeVisible();
        await expect(priceLocator).toBeVisible();

        const priceText = (await priceLocator.textContent()).trim();
        expect(priceText).toMatch(/^From:\s*\$\d+(\.\d+)?$/);
      },
    },
    {
      // id: "PR012",
      description: "Click product name navigates to detail page",
      inputData: "Click first product name and check detail page title",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        const productLink = page
          .locator('[data-testid="ProductElement"] a')
          .first();
        const nameText = await productLink.textContent();
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
      // id: "PR013",
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
      // id: "PR014",
      description: "Price format is correct (e.g. From: $10.0)",
      inputData: "Check text content of first product price range",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        const priceLocator = page
          .locator('[data-testid="ProductElement_PriceRange"]')
          .first();
        const priceText = (await priceLocator.textContent()).trim();

        expect(priceText).toMatch(/^From:\s*\$\d+(\.\d+)?$/);
      },
    },
    {
      // id: "PR015",
      description: "Hover on product enlarges card",
      inputData: "Hover over product card with 'BELLA + CANVAS'",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const card = page.locator(
          '[data-testid="ProductElement"] a div div div h3',
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
      // id: "PR016",
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
      // id: "PR017",
      description: "No broken product links",
      inputData:
        "Loop all product links and validate href is not 'undefined' or 'null'",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const productLinks = page.locator('[data-testid="ProductElement"] a');
        const count = await productLinks.count();
        for (let i = 0; i < count; i++) {
          const href = await productLinks.nth(i).getAttribute("href");
          expect(href).not.toMatch(/undefined|null|broken/i);
        }
      },
    },
    {
      // id: "PR018",
      description: "No products displayed when list is empty",
      inputData: "Open /products?test=empty and expect zero ProductElement",
      run: async (page) => {
        await page.goto(BASE_URL + "/products?test=empty");
        const products = page.locator('[data-testid="ProductElement"]');
        await expect(products).toHaveCount(0);
      },
    },
    {
      // id: "PR019",
      description: "Product page is responsive on mobile",
      inputData: "Set viewport to 375x812 and open /products",
      run: async (page) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto(BASE_URL + "/products");
        const card = page.locator('[data-testid="ProductElement"]');
        await expect(card.first()).toBeVisible();
      },
    },
    {
      // id: "PR020",
      description: "'Products' label has correct font size and color",
      inputData: "Check computed style of breadcrumb label 'Products'",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const label = page.locator("nav >> text=Products");
        const fontSize = await label.evaluate(
          (el) => getComputedStyle(el).fontSize
        );
        const color = await label.evaluate((el) => getComputedStyle(el).color);
        expect(fontSize).toMatch(/\d+px/);
        expect(color).toMatch(/rgb/);
      },
    },

    // Passed
    {
      // id: "PR021",
      description: "Hover on Home does not affect unrelated elements",
      inputData:
        "Hover on Home link and check bounding box of unrelated product",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const home = page.locator('nav >> a:has-text("Home")');
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
      // id: "PR022",
      description: "Product image has alt attribute",
      inputData: "Check 'alt' attribute for all product images",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const images = page.locator('[data-testid="ProductElement"] img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
          const altText = await images.nth(i).getAttribute("alt");
          expect(altText).not.toBe("");
        }
      },
    },

    {
      // id: "PR023",
      description: "Keyboard navigation works on product cards",
      inputData:
        "Press Tab 10 times and check if a product card receives focus",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");

        for (let i = 0; i < 10; i++) {
          await page.keyboard.press("Tab");

          const focusedTestId = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el) return null;

            if (el.hasAttribute("data-testid")) {
              return el.getAttribute("data-testid");
            }
            const parentWithTestId = el.closest("[data-testid]");
            return parentWithTestId
              ? parentWithTestId.getAttribute("data-testid")
              : null;
          });

          if (focusedTestId && focusedTestId.includes("ProductElement")) {
            expect(focusedTestId).toMatch(/ProductElement/);
            return;
          }
        }

        throw new Error("No ProductElement received focus after Tab presses");
      },
    },

    {
      // id: "PR024",
      description: "Product cards are focusable via keyboard (tabindex)",
      inputData: "Check tabindex attribute for each product card",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const cards = await page.$$('[data-testid="ProductElement"]');
        for (const card of cards) {
          const tabIndex = await card.getAttribute("tabindex");
          expect(tabIndex).not.toBeNull();
        }
      },
    },

    {
      // id: "PR025",
      description: "Product grid handles window resize properly",
      inputData:
        "Resize window from desktop to tablet and compare gridTemplateColumns",
      run: async (page) => {
        await page.goto(BASE_URL + "/products", { waitUntil: "networkidle" });

        const gridsCount = await page
          .locator('[data-testid="ProductList"]')
          .count();
        console.log("ProductGrid elements count:", gridsCount);

        if (gridsCount === 0) {
          throw new Error("Không tìm thấy phần tử ProductGrid trên trang");
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
      // id: "PR026",
      description: "Broken image fallback is handled",
      inputData: "Open /products?test=broken-image and validate image loads",
      run: async (page) => {
        await page.goto(BASE_URL + "/products?test=broken-image");
        const img = page.locator('[data-testid="ProductElement"] img').first();
        await expect(img).toBeVisible();
        const fallback = await img.evaluate((el) => el.naturalWidth > 0);
        expect(fallback).toBe(true);
      },
    },

    {
      // id: "PR027",
      description:
        "'No products found' message appears when search yields no results",
      inputData:
        "Fill search with 'somethingthatdoesnotexist' and click submit",
      run: async (page) => {
        await page.goto(BASE_URL + "/products");
        const search = page.locator('[placeholder="Search for products..."]');
        await expect(search).toBeVisible({ timeout: 5000 });
        await search.fill("somethingthatdoesnotexist");
        await page.locator('button[type="submit"]').click();
        const message = page.locator("h1", { hasText: "No results found" });
        await expect(message).toBeVisible({ timeout: 5000 });
      },
    },
  ];

  testCases.forEach((testCase, index) => {
    test(`${index + 1} - ${testCase.description}`, async ({ page }) => {
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
          id: `${index + 1}`,
          description: testCase.description,
          input: testCase.inputData || BASE_URL + "/products",
          expected: "Should behave as described",
          actual,
          status,
        };
        allTestResults.push(testResult); // Thêm vào mảng tạm thời
      } catch (err) {
        console.error("Lỗi khi chuẩn bị kết quả:", err);
      }
    });
  });

  test.afterAll(async () => {
    try {
      // Ghi tất cả kết quả vào Excel sau khi tất cả test case hoàn thành
      for (const result of allTestResults) {
        await logTestResult(result);
      }

      // Chỉ lưu và mở Excel sau khi tất cả kết quả được ghi
      await saveExcel();
      await openExcelAfterSave();
      console.log("Đã lưu kết quả vào Excel thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu file Excel:", error);
    }
  });
});
