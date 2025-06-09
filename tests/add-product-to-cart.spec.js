import { test, expect } from "@playwright/test";
import { LoginPage } from "./pageObjects/LoginPage";
import {BASE_URL, PRODUCTS_URL} from "./utils/constants";
import { TEST_CREDENTIALS } from "./utils/testData";

test.describe("Add Product to Cart", () => {
  test.beforeEach(async ({ page }) => {
    // Login before running test
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(TEST_CREDENTIALS.validUser.email, TEST_CREDENTIALS.validUser.password);
    await expect(
      page.getByRole("heading", { name: /Welcome to ZoomPrints/i })
    ).toBeVisible({ timeout: 30000 });
    
    // Verify successful login
    await expect(page).toHaveURL(BASE_URL);
  });

  test("AD001 - Select color, size and add to cart", async ({ page }) => {
    let actual = "";
    let status = "Fail";

    try {
      // Go to product list page
      await page.goto(PRODUCTS_URL);

      // Select the first product in the list
      const firstProduct = page.locator('li[data-testid="ProductElement"] a').first();
      await expect(firstProduct).toBeVisible({ timeout: 5000 });
      await firstProduct.click();
      await page.pause();

      // Select color (button with title attribute)
      const colorButton = page.locator('button[title^="WHITE"]'); // or select any color
      await expect(colorButton).toBeVisible({ timeout: 5000 });
      await colorButton.click();

      // Select size
      const sizeButton = page.locator('button[title="M"]'); // can select different size
      await expect(sizeButton).toBeVisible({ timeout: 5000 });
      await sizeButton.click();

      // (Optional) Select product variant if available (role="option")
      const option = page.locator('[role="option"]').first();
      if (await option.isVisible()) {
        await option.click();
      }

      // Click "Add to Cart"
      const addToCartBtn = page.locator('button:has-text("Add to Cart")');
      await expect(addToCartBtn).toBeVisible({ timeout: 5000 });
      await addToCartBtn.click();

      // Check confirmation (assuming there's a toast or redirect)
      await expect(page.locator("text=Added to cart")).toBeVisible({ timeout: 5000 });

      actual = "Product successfully added to cart";
      status = "Pass";
    } catch (e) {
      actual = "Failed to add product to cart";
    } 
  });

  test("AD002 - Verify Product Price Consistency", async ({ page }) => {
    // Go to product list page
    await page.goto(PRODUCTS_URL);

    // Select the first product in the list
    const firstProduct = page.locator('li[data-testid="ProductElement"] a').first();
    await expect(firstProduct).toBeVisible({ timeout: 30000 });
    await firstProduct.click();
    await page.pause();

    // Get displayed price
    const priceLocator = page.locator("div", { hasText: "$" }).nth(0);
    await expect(priceLocator).toBeVisible({ timeout: 20000 });
    const displayedPriceText = await priceLocator.textContent();
    const displayedPrice = displayedPriceText.match(/\$[\d.]+/)[0]; // Extract price like $7.42
    console.log("Hello displayedPrice", displayedPrice);
    
    // Select size and quantity
    const sizeButton = page.locator('button[title="5XL"]');
    console.log("Hello sizeButton", sizeButton);
    await expect(sizeButton).toBeVisible({ timeout: 30000 });
    await sizeButton.click();
    await page.locator('input[type="number"]').fill("1");
    
    // Add to cart
    const addToCartBtn = page.locator('button:has-text("Add to Cart")');
    await expect(addToCartBtn).toBeVisible({ timeout: 30000 });
    await addToCartBtn.click();
    
    // Navigate to cart page
    await page.locator('a[href*="/cart"]').click();
    await expect(page).toHaveURL(/\/cart/);
    
    // Get cart price
    const cartPriceLocator = page.locator("p", { hasText: "$" }).nth(0);
    await expect(cartPriceLocator).toBeVisible({ timeout: 20000 });
    const cartPriceText = await cartPriceLocator.textContent();
    const cartPrice = cartPriceText.match(/\$[\d.]+/)[0]; // Extract price like $7.42
    
    // Compare prices
    expect(displayedPrice).toBe(cartPrice);
  });
});
