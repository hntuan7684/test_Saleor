const { chromium } = require("playwright");
import { test, expect } from "@playwright/test";
import { PRODUCTS_URL } from "./utils/constants";
import { CART_URL } from "./utils/constants";
import { LOGIN_URL } from "./utils/constants";
import { ORDERS_URL } from "./utils/constants";
import createAndVerifyAccount from "./utils/createAccount";
import { BASE_URL } from "./utils/constants";
const { generateUniqueEmail } = require("./utils/testDataHelper");

test("Login, add product to card, remove product from cart", async ({
  page,
}) => {
  test.setTimeout(360000);
  // Step 1: Create account
  const firstName = "David";
  const lastName = "John";
  const email = generateUniqueEmail("mailinator.com");
  const password = "Testuser12345";
  console.log("Test email: ", email);
  try {
    await createAndVerifyAccount(page, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    console.log("Account is created and verify successfully!");
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }

  await page.goto(BASE_URL);
  await page.locator('span:has-text("Log in")').click({ force: true });

  await page.screenshot({ path: "login-page.png", fullPage: true });

  console.log("email, password: ", email, password);
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);

  await page.click('button:has-text("Log In")');
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(BASE_URL);

  //Step 2: Access product page
  await page.goto(PRODUCTS_URL, {
    waitUntil: "domcontentloaded",
  });

  const products = page
    .locator("a[href*='/products/']")
    .locator("div")
    .filter({ hasText: "$" });
  await expect(products.first()).toBeVisible({ timeout: 30000 });

  //Step 3: Clip on first product
  await products.first().click();

  //Step 4: Add product to cart
  const addToCartBtn = page.locator("button:has-text('Add to Cart')");
  await expect(addToCartBtn).toBeVisible({ timeout: 60000 });
  await addToCartBtn.click();

  // Step 5: Check error message
  const errorMessage = page.locator("text=Only 0 remaining in stock");
  await errorMessage.waitFor({ timeout: 10000 }).catch(() => {});
  const isErrorVisible = await errorMessage.isVisible();

  if (isErrorVisible) {
    const msg = await errorMessage.textContent();
    console.warn("⚠️ Can not add items:", msg);
    test.skip("❌ Product out of stock");
    return;
  }

  const countText = await page.textContent(
    "div.bg-neutral-900.text-white.text-xs.font-medium"
  );
  const match = countText?.match(/\d+/);
  const itemCount = match ? Number(match[0]) : 0;
  expect(itemCount).toBeGreaterThan(0);

  console.log("Add product to cart successfully");

  //Step 6: Access the cart
  await page.click("a[href='/default-channel/cart']");
  await expect(page).toHaveURL(CART_URL);

  //Step 7: Remove product from cart
  await page.locator("button >> text=Delete").first().click();

  console.log("Removed product from cart successfully");
});

// test("Login, add product to cart, check total price, checkout", async ({
//   page,
// }) => {
//   test.setTimeout(240000);
//   await page.goto(LOGIN_URL);
//   await page.fill('input[name="email"]', "ngothanhloc.22102003@gmail.com");
//   await page.fill('input[name="password"]', "Loc22102005");
//   await page.click('button:has-text("Log in")');
//   await page.waitForURL("**/default-channel");

//   await page.goto(PRODUCTS_URL);
//   await page.locator("a[href*='/products/']").first().click();
//   await page.click('button:has-text("Add to Cart")');
//   await page.click("a[href='/default-channel/cart']");

//   // Check total price
//   const totalLocator = page.locator("div.font-medium.text-neutral-900");
//   const priceText = await totalLocator.textContent({ timeout: 300000 });

//   const match = priceText?.match(/\$([\d.]+)/);
//   expect(match).not.toBeNull();

//   const totalValue = parseFloat(match[1]);
//   expect(totalValue).toBeGreaterThan(0);

//   console.log(`Total price: $${totalValue}`);

//   // Click Checkout button
//   await Promise.all([
//     page.waitForURL(/\/checkout\?checkout=/, { timeout: 60000 }),
//     page.locator('[data-testid="CheckoutLink"]').click(),
//   ]);

//   console.log("Current URL:", page.url());

//   const ShippingDropdown = page.locator('select[name="deliveryMethod"]');

//   await ShippingDropdown.waitFor({ state: "visible", timeout: 60000 });

//   await expect(ShippingDropdown).toBeVisible();

//   await ShippingDropdown.selectOption({ value: "U2hpcHBpbmdNZXRob2Q6MTA=" });

//   const totalPrice = await page
//     .locator('[data-testid="totalOrderPrice"]')
//     .nth(1)
//     .textContent();
//   console.log(`Tổng giá: ${totalPrice}`);

//   await page.click('button:has-text("Place Order")');

//   // await page.waitForLoadState("networkidle");
//   await expect(page).toHaveURL(ORDERS_URL, {timeout: 30000});
// });
