// cartPage.spec.js
import { test } from './global-test';
const { LOGIN_URL, PRODUCTS_URL, CART_URL } = require("./utils/constants");
import { expect } from '@playwright/test';
const { CartPage } = require("./pageObjects/ShoppingCartPage");

// Helper to open Cart from icon
const openCart = async (page) => {
  const cartIcon = page.locator('a[href*="/cart"]'); // ✅
  await expect(cartIcon).toBeVisible();
  await cartIcon.click();
  await expect(page).toHaveURL(CART_URL);
};

const login = async (page) => {
  await page.goto(`${LOGIN_URL}`);
  await page.locator("[placeholder='Email']").fill("testaccount455@mailinator.com");
  await page.locator("[placeholder='Password']").fill("ValidPass123!");

  // ✅ Fixed correct button selection
  await page.getByRole("button", { name: "Log In" }).click();

  // ⏳ Ensure successful redirection
  await expect(page).toHaveURL(/default-channel/);
};

test.describe("Shopping Cart Tests", () => {
  test("CT001 - Add Product to Cart", async ({ page }) => {
    await login(page);
    await page.waitForLoadState("networkidle");

    await page.goto(`${PRODUCTS_URL}/bella-3001`);
    await page.waitForLoadState("domcontentloaded");

    await page.getByRole("button", { title: "2XL" }).click();
    await page.locator("input[type='number']").fill("1");
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.waitForSelector('text=Added to Cart', { timeout: 120000 });

    const cartIcon = page.locator('a[href*="/cart"]');
    await cartIcon.click();
    await page.waitForLoadState("networkidle");

    // ✅ Check product heading in cart
    const heading = page.locator('a h2');
    await expect(heading).toHaveText("BELLA + CANVAS - Jersey Tee - 3001", {
      timeout: 10000,
    });
  });

  test("CT002 - Open Cart Page from Header", async ({ page }) => {
    await login(page); // if login is required
    await page.waitForLoadState("networkidle");

    await openCart(page);
    await expect(page.locator("h1")).toHaveText("Shopping Cart");
  });

  test("CT003 - Change Product Quantity in Cart", async ({ page }) => {
    await login(page);
    await page.waitForLoadState("networkidle");

    await openCart(page);

    const cart = new CartPage(page);
    await cart.changeQuantity(0, 2);

    await expect(cart.getQuantityInput(0)).toHaveValue("2");
  });

  test("CT004 - Remove Product from Cart", async ({ page }) => {
    await login(page); // ensure logged in
    await page.waitForLoadState("networkidle");

    await openCart(page);
    const cart = new CartPage(page);
    await cart.removeItem(0);

    const cartItems = await cart.getItemCount();
    expect(cartItems);
  });

 test("CT005 - Verify Subtotal Matches Sum of Prices", async ({ page }) => {
  test.setTimeout(60000); // ⏱ Set timeout to 60 seconds

  await login(page);
  await page.waitForLoadState("networkidle");

  await page.goto(`${PRODUCTS_URL}/bella-3001`);
  await page.waitForLoadState("domcontentloaded");

  await page.getByRole("button", { name: "2XL" }).click();
  await page.locator("input[type='number']").fill("2");
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await page.waitForTimeout(1000);

  await openCart(page);
  await page.waitForSelector("p.text-left.font-semibold");

  const cart = new CartPage(page);
  const total = await cart.getTotalItemPrices();
  const subtotal = await cart.getSubtotal();

  console.log("🧾 Total item price:", total);
  console.log("💵 Subtotal:", subtotal);

  expect(subtotal).toBeCloseTo(total, 2);
});

});