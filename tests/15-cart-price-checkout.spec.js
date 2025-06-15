import { test } from './global-test';
import { expect } from "@playwright/test";
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
  await page.fill('input[name="password"]', TEST_CREDENTIALS.validUser.password);
  await page.click('button:has-text("Log in")');
  await page.waitForURL("**/default-channel");
  await page.waitForSelector(
    'button.bg-neutral-200 >> span[aria-hidden="true"]'
  );

  //Step 2: Access product page
  await page.waitForSelector('a[href="/default-channel/products"]');

  // Click in "Order"
  await page.click('a[href="/default-channel/products"]');

  const firstProduct = page.locator('li[data-testid="ProductElement"] a').first();
  await expect(firstProduct).toBeVisible({ timeout: 30000 });

  await firstProduct.click();
  await page.pause();

  //Step 3: Add product to cart
  const xsInput = page.locator('input[type="number"]').first();
  await xsInput.fill("1");
  const addToCartBtn = page.locator("button:has-text('Add to Cart')");
  await expect(addToCartBtn).toBeVisible({ timeout: 30000 });
  await addToCartBtn.click();

  //Check error messgae if any
  const errorMessage = page.locator("div.Toastify__toast-body", {
    hasText: "Could not add items",
  });
  await errorMessage.waitFor({timeout: 10000}).catch(() => {});
  
  const isErrorVisible = await errorMessage.isVisible();
  if (isErrorVisible) {
    const errorText = await errorMessage.textContent();
    console.error("Error message:", errorText);
  } else {
    // Step 4: Wait for the cart to display the quantity
    const countText = await page.textContent(
      "div.bg-neutral-900.text-white.text-xs.font-medium"
    );
    const match = countText?.match(/\d+/);
    const itemCount = match ? Number(match[0]) : 0;
    expect(itemCount).toBeGreaterThan(0);

    //Step 5: Access the cart
    await page.click("a[href='/default-channel/cart']");
    await expect(page).toHaveURL(CART_URL);

    //Step 6: Remove product from cart
    await page.locator("button >> text=Delete").first().click();
  }
});

test("Login, add product to cart, check total price, checkout", async ({
  page,
}) => {
  // Step 1: Login
  await page.goto(LOGIN_URL, {
    waitUntil: "domcontentloaded",
  });
  await page.fill('input[name="username"]', TEST_CREDENTIALS.validUser.email);
  await page.fill('input[name="password"]', TEST_CREDENTIALS.validUser.password);
  await page.click('button:has-text("Log in")');
  await page.waitForURL("**/default-channel");
  await page.waitForSelector(
    'button.bg-neutral-200 >> span[aria-hidden="true"]'
  );

  //Step 2: Access product page
  await page.waitForSelector('a[href="/default-channel/products"]');

  // Click in "Order"
  await page.click('a[href="/default-channel/products"]');

  const firstProduct = page.locator('li[data-testid="ProductElement"] a').first();
  await expect(firstProduct).toBeVisible({ timeout: 30000 });

  await firstProduct.click();
  await page.pause();

  //Step 3: Add product to cart
  const xsInput = page.locator('input[type="number"]').first();
  await xsInput.fill("1");
  const addToCartBtn = page.locator("button:has-text('Add to Cart')");
  await expect(addToCartBtn).toBeVisible({ timeout: 30000 });
  await addToCartBtn.click();

  //Check error messgae if any
  const errorMessage = page.locator("div.Toastify__toast-body", {
    hasText: "Could not add items",
  });
  await errorMessage.waitFor({timeout: 10000}).catch(() => {});
  
  const isErrorVisible = await errorMessage.isVisible();
  if (isErrorVisible) {
    const errorText = await errorMessage.textContent();
    console.error("Error message:", errorText);
  } else {
    await page.click("a[href='/default-channel/cart']");
    // Check total price
    const totalLocator = page.locator("div.font-medium.text-neutral-900");
    const priceText = await totalLocator.textContent({ timeout: 300000 });

    const match = priceText?.match(/\$([\d.]+)/);
    expect(match).not.toBeNull();

    const totalValue = parseFloat(match[1]);
    expect(totalValue).toBeGreaterThan(0);

    // console.log(`Total price: $${totalValue}`);

    // Click Checkout button
    const checkoutBtn = page.locator("text=/.*Checkout.*/i");
    await checkoutBtn.waitFor({ state: "visible", timeout: 150000 });
    await checkoutBtn.click();

    await page.waitForURL(/\/checkout\?checkout=/, { timeout: 150000 });

    const ShippingDropdown = page.locator('select[name="deliveryMethod"]');

    await ShippingDropdown.waitFor({ state: "visible", timeout: 120000 });

    await expect(ShippingDropdown).toBeVisible();

    await ShippingDropdown.selectOption({ value: "U2hpcHBpbmdNZXRob2Q6MTA=" });

    const totalPrice = await page
      .locator('[data-testid="totalOrderPrice"]')
      .nth(1)
      .textContent();
    // console.log(`Total price: ${totalPrice}`);

    await page.click('button:has-text("Place Order")');

    // await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(ORDERS_URL, { timeout: 120000 });
  }
});