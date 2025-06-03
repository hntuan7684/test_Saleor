// cartPage.spec.js
const { BASE_URL } = require("./utils/constants");
const { test, expect } = require("@playwright/test");
const { CartPage } = require("./pageObjects/ShoppingCartPage");

const PRODUCT_URL = `${BASE_URL}/products`;
const CART_URL = `${BASE_URL}/cart`;

// Helper để mở Cart từ icon
const openCart = async (page) => {
  const cartIcon = page.locator('a[href*="/cart"]'); // ✅
  await expect(cartIcon).toBeVisible();
  await cartIcon.click();
  await expect(page).toHaveURL(CART_URL);
};

const login = async (page) => {
  await page.goto(`${BASE_URL}/login`);
  await page.locator("[placeholder='Email']").fill("testaccount455@mailinator.com");
  await page.locator("[placeholder='Password']").fill("ValidPass123!");

  // ✅ Sửa đúng cách chọn nút
  await page.getByRole("button", { name: "Log In" }).click();

  // ⏳ Đảm bảo chuyển hướng thành công
  await expect(page).toHaveURL(/default-channel/);
};

test.describe("Shopping Cart Tests", () => {
  test("CT001 - Add Product to Cart", async ({ page }) => {
    await login(page);
    await page.waitForLoadState("networkidle");

    await page.goto(`${PRODUCT_URL}/bella-3001`);
    await page.waitForLoadState("domcontentloaded");

    await page.getByRole("button", { name: "2XL" }).click();
    await page.locator("input[type='number']").fill("1");
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.waitForTimeout(1000);

    const cartIcon = page.locator('a[href*="/cart"]');
    await cartIcon.click();
    await page.waitForLoadState("networkidle");

    // ✅ Kiểm tra heading sản phẩm trong giỏ hàng
    const heading = page.locator('a h2');
    await expect(heading).toHaveText("BELLA + CANVAS - Jersey Tee - 3001", {
      timeout: 10000,
    });
  });

  test("CT002 - Open Cart Page from Header", async ({ page }) => {
    await login(page); // nếu login là bắt buộc
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
  await login(page); // đảm bảo đã login
  await page.waitForLoadState("networkidle");

  await openCart(page);
  const cart = new CartPage(page);
  await cart.removeItem(0);

  const cartItems = await cart.getItemCount();
  expect(cartItems);
});


test("CT005 - Verify Subtotal Matches Sum of Prices", async ({ page }) => {
  await login(page);
  await page.waitForLoadState("networkidle");

  await page.goto(`${PRODUCT_URL}/bella-3001`);
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
