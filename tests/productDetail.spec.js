// productDetails.spec.js
import { test, expect } from "@playwright/test";
import { BASE_URL } from "./utils/constants.js";
import { initExcel, logTestResult, saveExcel, openExcelAfterSave } from "./utils/testResultLogger.js";

test.describe("Product Details Page Tests", () => {
  let allTestResults = [];
  let productUrl = "";

  test.beforeAll(async () => {
    await initExcel(); // Automatically uses "productDetails" as sheet name
  });

  // Helper function to navigate to a product detail page
  async function navigateToProduct(page) {
    await page.goto(BASE_URL + "/products");
    const productLink = await page.locator('[data-testid="ProductElement"] a').first();
    productUrl = await productLink.getAttribute("href");
    await productLink.click();
    await page.waitForLoadState("domcontentloaded");
  }

  const testCases = [
    {
      description: "Verify Product Title is displayed correctly",
      run: async (page) => {
        await navigateToProduct(page);
        const title = await page.locator("h1").first();
        await expect(title).toBeVisible();
        const titleText = await title.textContent();
        expect(titleText.trim()).not.toBe("");
      }
    },
    {
      description: "Verify Product Image is displayed",
      run: async (page) => {
        await navigateToProduct(page);
        const image = await page.locator('[data-testid="ProductImage"] img').first();
        await expect(image).toBeVisible();
        const isLoaded = await image.evaluate((el) => el.complete && el.naturalWidth > 0);
        expect(isLoaded).toBe(true);
      }
    },
    {
      description: "Verify Color options are displayed and selectable",
      run: async (page) => {
        await navigateToProduct(page);
        const colorOptions = await page.locator('[data-testid="ColorOption"]');
        const count = await colorOptions.count();
        expect(count).toBeGreaterThan(0);
        
        // Test selecting a color
        await colorOptions.first().click();
        const selectedClass = await colorOptions.first().getAttribute("class");
        expect(selectedClass).toContain("selected");
      }
    },
    {
      description: "Verify Size options are displayed and selectable",
      run: async (page) => {
        await navigateToProduct(page);
        const sizeOptions = await page.locator('[data-testid="SizeOption"]');
        const count = await sizeOptions.count();
        expect(count).toBeGreaterThan(0);
        
        // Test selecting a size
        await sizeOptions.first().click();
        const selectedClass = await sizeOptions.first().getAttribute("class");
        expect(selectedClass).toContain("selected");
      }
    },
    {
      description: "Verify Price is displayed correctly",
      run: async (page) => {
        await navigateToProduct(page);
        const price = await page.locator('[data-testid="ProductPrice"]');
        await expect(price).toBeVisible();
        const priceText = await price.textContent();
        expect(priceText).toMatch(/\$\d+(\.\d{1,2})?/);
      }
    },
    {
      description: "Verify Add to Cart button is clickable",
      run: async (page) => {
        await navigateToProduct(page);
        const addToCartBtn = await page.locator('[data-testid="AddToCartButton"]');
        await expect(addToCartBtn).toBeEnabled();
        await addToCartBtn.click();
        await expect(page.locator('[data-testid="CartNotification"]')).toBeVisible();
      }
    },
    {
      description: "Verify Quantity selector is working correctly",
      run: async (page) => {
        await navigateToProduct(page);
        const quantityInput = await page.locator('[data-testid="QuantityInput"]');
        await expect(quantityInput).toBeVisible();
        
        // Test increasing quantity
        const increaseBtn = await page.locator('[data-testid="QuantityIncrease"]');
        await increaseBtn.click();
        let value = await quantityInput.inputValue();
        expect(value).toBe("2");
        
        // Test decreasing quantity
        const decreaseBtn = await page.locator('[data-testid="QuantityDecrease"]');
        await decreaseBtn.click();
        value = await quantityInput.inputValue();
        expect(value).toBe("1");
      }
    },
    {
      description: "Verify Product is added to Cart correctly",
      run: async (page) => {
        await navigateToProduct(page);
        const addToCartBtn = await page.locator('[data-testid="AddToCartButton"]');
        await addToCartBtn.click();
        
        // Check cart notification
        const notification = await page.locator('[data-testid="CartNotification"]');
        await expect(notification).toBeVisible();
        
        // Check cart count
        const cartCount = await page.locator('[data-testid="CartCount"]');
        const countText = await cartCount.textContent();
        expect(parseInt(countText)).toBeGreaterThan(0);
      }
    },
    {
      description: "Verify Error message for invalid quantity",
      run: async (page) => {
        await navigateToProduct(page);
        const quantityInput = await page.locator('[data-testid="QuantityInput"]');
        await quantityInput.fill("0");
        const addToCartBtn = await page.locator('[data-testid="AddToCartButton"]');
        await addToCartBtn.click();
        
        const errorMessage = await page.locator('[data-testid="QuantityError"]');
        await expect(errorMessage).toBeVisible();
        const messageText = await errorMessage.textContent();
        expect(messageText).toContain("Quantity must be at least 1");
      }
    },
    {
      description: "Verify Product Images Carousel works correctly",
      run: async (page) => {
        await navigateToProduct(page);
        const carousel = await page.locator('[data-testid="ImageCarousel"]');
        await expect(carousel).toBeVisible();
        
        // Test navigation
        const nextButton = await page.locator('[data-testid="CarouselNext"]');
        await nextButton.click();
        await page.waitForTimeout(500); // Wait for animation
        
        const activeImage = await carousel.locator(".active");
        await expect(activeImage).toBeVisible();
      }
    },
    {
      description: "Verify Product Features list is displayed",
      run: async (page) => {
        await navigateToProduct(page);
        const featuresList = await page.locator('[data-testid="FeaturesList"] li');
        const count = await featuresList.count();
        expect(count).toBeGreaterThan(0);
      }
    },
    {
      description: "Verify Breadcrumb navigation works",
      run: async (page) => {
        await navigateToProduct(page);
        const breadcrumb = await page.locator('[data-testid="Breadcrumb"] a').first();
        await expect(breadcrumb).toBeVisible();
        await breadcrumb.click();
        await expect(page).toHaveURL(BASE_URL + "/products");
      }
    },
    {
      description: "Verify Social Media Share buttons are displayed",
      run: async (page) => {
        await navigateToProduct(page);
        const shareButtons = await page.locator('[data-testid="SocialShare"] a');
        const count = await shareButtons.count();
        expect(count).toBeGreaterThanOrEqual(3); // At least Facebook, Twitter, Pinterest
      }
    },
    {
      description: "Verify Product URL is SEO friendly",
      run: async (page) => {
        await navigateToProduct(page);
        const currentUrl = await page.url();
        expect(currentUrl).toMatch(/\/products\/[a-z0-9-]+$/i);
      }
    },
    {
      description: "Verify Product Title with long text",
      run: async (page) => {
        await navigateToProduct(page);
        const title = await page.locator("h1").first();
        const titleText = await title.textContent();
        expect(titleText.length).toBeLessThan(100); // Assuming max 100 chars is reasonable
      }
    },
    {
      description: "Verify Product Title with special characters",
      run: async (page) => {
        await page.goto(BASE_URL + "/products/special-chars-product");
        const title = await page.locator("h1").first();
        await expect(title).toBeVisible();
        const titleText = await title.textContent();
        expect(titleText).toMatch(/[!@#$%^&*()]/); // Contains special chars
      }
    },
    {
      description: "Verify Product Title with Unicode characters",
      run: async (page) => {
        await page.goto(BASE_URL + "/products/unicode-product");
        const title = await page.locator("h1").first();
        await expect(title).toBeVisible();
        const titleText = await title.textContent();
        expect(titleText).toMatch(/[^\x00-\x7F]/); // Contains non-ASCII chars
      }
    },
    {
      description: "Verify Product Image fails to load",
      run: async (page) => {
        await page.goto(BASE_URL + "/products/broken-image-product");
        const image = await page.locator('[data-testid="ProductImage"] img').first();
        const isLoaded = await image.evaluate((el) => el.complete && el.naturalWidth > 0);
        expect(isLoaded).toBe(false);
        
        // Check fallback image is shown
        const fallback = await page.locator('[data-testid="ImageFallback"]');
        await expect(fallback).toBeVisible();
      }
    },
    {
      description: "Verify Image Zoom functionality",
      run: async (page) => {
        await navigateToProduct(page);
        const image = await page.locator('[data-testid="ProductImage"]').first();
        await image.hover();
        
        const zoom = await page.locator('[data-testid="ImageZoom"]');
        await expect(zoom).toBeVisible();
      }
    },
    {
      description: "Verify Image changes with color selection",
      run: async (page) => {
        await navigateToProduct(page);
        const initialImageSrc = await page.locator('[data-testid="ProductImage"] img').getAttribute("src");
        
        const colorOptions = await page.locator('[data-testid="ColorOption"]');
        await colorOptions.nth(1).click();
        await page.waitForTimeout(500); // Wait for image to change
        
        const newImageSrc = await page.locator('[data-testid="ProductImage"] img').getAttribute("src");
        expect(newImageSrc).not.toBe(initialImageSrc);
      }
    },
    {
      description: "Verify Color option is disabled when out of stock",
      run: async (page) => {
        await navigateToProduct(page);
        const outOfStockColor = await page.locator('[data-testid="ColorOption"].out-of-stock').first();
        const isDisabled = await outOfStockColor.getAttribute("disabled");
        expect(isDisabled).toBe("");
      }
    },
    {
      description: "Verify Size options with invalid values",
      run: async (page) => {
        await navigateToProduct(page);
        const invalidSize = await page.locator('[data-testid="SizeOption"].invalid').first();
        const isDisabled = await invalidSize.getAttribute("disabled");
        expect(isDisabled).toBe("");
      }
    },
    {
      description: "Verify Price with discount",
      run: async (page) => {
        await page.goto(BASE_URL + "/products/discounted-product");
        const originalPrice = await page.locator('[data-testid="OriginalPrice"]');
        const discountPrice = await page.locator('[data-testid="DiscountPrice"]');
        
        await expect(originalPrice).toBeVisible();
        await expect(discountPrice).toBeVisible();
        
        const originalValue = parseFloat((await originalPrice.textContent()).replace(/[^\d.]/g, ""));
        const discountValue = parseFloat((await discountPrice.textContent()).replace(/[^\d.]/g, ""));
        expect(discountValue).toBeLessThan(originalValue);
      }
    },
    {
      description: "Verify Price in multiple currencies",
      run: async (page) => {
        await navigateToProduct(page);
        const currencySelector = await page.locator('[data-testid="CurrencySelector"]');
        await expect(currencySelector).toBeVisible();
        
        // Change currency
        await currencySelector.selectOption("EUR");
        await page.waitForTimeout(500); // Wait for price to update
        
        const price = await page.locator('[data-testid="ProductPrice"]');
        const priceText = await price.textContent();
        expect(priceText).toMatch(/€\d+(\.\d{1,2})?/);
      }
    },
    {
      description: "Verify Price with formatting (thousands separator)",
      run: async (page) => {
        await page.goto(BASE_URL + "/products/high-price-product");
        const price = await page.locator('[data-testid="ProductPrice"]');
        const priceText = await price.textContent();
        expect(priceText).toMatch(/\$\d{1,3}(,\d{3})*(\.\d{1,2})?/);
      }
    },
    {
      description: "Verify Add to Cart without selecting Size",
      run: async (page) => {
        await navigateToProduct(page);
        const addToCartBtn = await page.locator('[data-testid="AddToCartButton"]');
        await addToCartBtn.click();
        
        const errorMessage = await page.locator('[data-testid="SizeError"]');
        await expect(errorMessage).toBeVisible();
        const messageText = await errorMessage.textContent();
        expect(messageText).toContain("Please select a size");
      }
    },
    {
      description: "Verify Stock availability for each color/size",
      run: async (page) => {
        await navigateToProduct(page);
        const stockInfo = await page.locator('[data-testid="StockInfo"]');
        await expect(stockInfo).toBeVisible();
        
        const colorOptions = await page.locator('[data-testid="ColorOption"]');
        await colorOptions.first().click();
        
        const sizeOptions = await page.locator('[data-testid="SizeOption"]');
        await sizeOptions.first().click();
        
        const stockText = await stockInfo.textContent();
        expect(stockText).toMatch(/\d+ in stock/i);
      }
    },
    {
      description: "Verify Product Description is displayed and formatted correctly",
      run: async (page) => {
        await navigateToProduct(page);
        const description = await page.locator('[data-testid="ProductDescription"]');
        await expect(description).toBeVisible();
        
        // Check for formatted elements
        const paragraphs = await description.locator("p").count();
        expect(paragraphs).toBeGreaterThan(0);
        
        const lists = await description.locator("ul, ol").count();
        expect(lists).toBeGreaterThan(0);
      }
    }
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
          input: productUrl || BASE_URL + "/products",
          expected: "Should behave as described",
          actual,
          status,
        };
        allTestResults.push(testResult);
      } catch (err) {
        console.error("Error preparing test result:", err);
      }
    });
  });

  test.afterAll(async () => {
    try {
      for (const result of allTestResults) {
        await logTestResult(result);
      }
      await saveExcel();
      // await openExcelAfterSave();
      console.log("Test results saved to Excel successfully!");
    } catch (error) {
      console.error("Error saving Excel file:", error);
    }
  });
});