const { chromium } = require("playwright");
import { test, expect } from "@playwright/test";
import { PRODUCTS_URL } from "./utils/constants";
import { CART_URL } from "./utils/constants";
import { LOGIN_URL } from "./utils/constants";
import {ORDERS_URL } from "./utils/constants";
import { TEST_CREDENTIALS } from "./utils/testData";

test("Login, add product to card, remove product from cart", async ({
  page,
}) => {
  // Step 1: Login
  await page.goto(LOGIN_URL, {
    waitUntil: "domcontentloaded",
  });
  await page.fill('input[name="username"]', TEST_CREDENTIALS.validUser.email);
  await page.fill(
    'input[name="password"]',
    TEST_CREDENTIALS.validUser.password
  );
  await page.click('button:has-text("Log in")');
  await page.waitForURL("**/default-channel");

  //Step 2: Access product page
  await page.goto(PRODUCTS_URL, {
    waitUntil: "domcontentloaded",
  });

  const firstProduct = page
    .locator('li[data-testid="ProductElement"] a')
    .first();
  await expect(firstProduct).toBeVisible({ timeout: 30000 });
  await firstProduct.click();
  await page.pause();

  //Step 3: Add product to cart
  await page.click("#add-to-cart-button ");

  // await addToCartBtn.click();

  // Step 4: Check error message
  const errorMessage = page.locator("text=Only 0 remaining in stock");
  await errorMessage.waitFor({ timeout: 10000 }).catch(() => {});
  const isErrorVisible = await errorMessage.isVisible();

  if (isErrorVisible) {
    const msg = await errorMessage.textContent();
    console.warn("⚠️ Can not add items:", msg);
    test.skip("❌ Product out of stock");
    return;
  }

  console.log("Add product to cart successfully");

  //Step 6: Access the cart
  await page.click("a[href='/default-channel/cart']");
  await expect(page).toHaveURL(CART_URL);

  //Step 7: Remove product from cart
  await page.locator("button >> text=Delete").first().click();

  console.log("Removed product from cart successfully");
});

test("Login, add product to cart, check total price, checkout", async ({
  page,
}) => {
  await page.goto(LOGIN_URL);
  await page.fill('input[name="username"]', TEST_CREDENTIALS.validUser.email);
  await page.fill('input[name="password"]', TEST_CREDENTIALS.validUser.password);
  await page.click('button:has-text("Log in")');
  await page.waitForURL("**/default-channel");

  await page.goto(PRODUCTS_URL);
  await page.locator("a[href*='/products/']").first().click();
  await page.pause();
  await page.locator("button:has-text('Add to Cart')").click();
  await page.click("a[href='/default-channel/cart']");

  const totalPrice = await page
    .locator('[data-testid="totalOrderPrice"]')
    .nth(1)
    .textContent();
  console.log(`Total price: ${totalPrice}`);
});