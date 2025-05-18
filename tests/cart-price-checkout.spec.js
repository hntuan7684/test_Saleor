import { test, expect } from "@playwright/test";

test("Login, add product to card, remove product from cart", async ({
  page,
}) => {
  // Step 1: Login
  await page.goto("https://mypod.io.vn/default-channel/login", {
    waitUntil: "domcontentloaded",
  });
  await page.fill('input[name="email"]', "ngothanhloc.22102003@gmail.com");
  await page.fill('input[name="password"]', "Loc22102005");
  await page.click('button:has-text("Log in")');
  await page.waitForURL("**/default-channel");

  //Step 2: Access product page
  await page.goto("https://mypod.io.vn/default-channel/products", {
    waitUntil: "domcontentloaded",
  });

  const products = page
    .locator("a[href*='/products/']")
    .locator("div")
    .filter({ hasText: "$" });
  await expect(products.first()).toBeVisible();

  //Step 3: Clip on first product
  await products.first().click();

  //Step 4: Add product to cart
  const addToCartBtn = page.locator("button:has-text('Add to Cart')");
  await expect(addToCartBtn).toBeVisible({ timeout: 5000 });
  await addToCartBtn.click();

  // Step 5: Wait for the cart to display the quantity
  const cartCount = page.locator(
    "a[href='/default-channel/cart'] div:has-text('1')"
  );
  await expect(cartCount).toBeVisible({ timeout: 5000 });

  console.log("Add product to cart successfully");

  //Step 6: Access the cart
  await page.click("a[href='/default-channel/cart']");
  await expect(page).toHaveURL("https://mypod.io.vn/default-channel/cart");

  //Step 7: Remove product from cart
  const deleteButton = page.locator("button .lucide-trash");
  await expect(deleteButton).toBeVisible({ timeout: 5000 });
  await deleteButton.first().click();

  //Step 8: Check empty cart
  const emptyMessage = page.locator("text=Your Shopping Cart is empty");
  await expect(emptyMessage).toBeVisible({ timeout: 5000 });

  console.log("Removed product from cart successfully");
});

test("Login, add product to cart, check total price, checkout", async ({
  page,
}) => {
  await page.goto("https://mypod.io.vn/default-channel/login");
  await page.fill('input[name="email"]', "ngothanhloc.22102003@gmail.com");
  await page.fill('input[name="password"]', "Loc22102005");
  await page.click('button:has-text("Log in")');
  await page.waitForURL("**/default-channel");

  await page.goto("https://mypod.io.vn/default-channel/products");
  await page.locator("a[href*='/products/']").first().click();
  await page.locator("button:has-text('Add to Cart')").click();
  await page.click("a[href='/default-channel/cart']");

  // Check total price
  const totalLocator = page.locator("div.font-medium.text-neutral-900");
  const priceText = await totalLocator.textContent({ timeout: 5000 });

  const match = priceText?.match(/\$([\d.]+)/);
  expect(match).not.toBeNull();

  const totalValue = parseFloat(match[1]);
  expect(totalValue).toBeGreaterThan(0);

  console.log(`Total price: $${totalValue}`);

  // Click Checkout button
  const checkoutBtn = page.locator("text=/.*Checkout.*/i");
  await checkoutBtn.waitFor({ state: "visible", timeout: 10000 });
  await checkoutBtn.click();

  await page.waitForURL(/\/checkout\?checkout=/, { timeout: 15000 });

  const countryDropdown = page.locator(
    'select[name="shippingAddress.country"]'
  );

  await countryDropdown.waitFor({ state: "visible", timeout: 10000 });

  await expect(countryDropdown).toBeVisible();

  await countryDropdown.selectOption({ value: "VN" });

  const provinceSelect = page.locator(
    'select[name="shippingAddress.countryArea"]'
  );
  await expect(provinceSelect).toBeVisible();

  await provinceSelect.selectOption({ label: "An Giang" });

  await page.fill('input[name="shippingAddress.firstName"]', "Lộc");
  await page.fill('input[name="shippingAddress.lastName"]', "Ngô Thành");
  await page.fill('input[name="shippingAddress.company"]', "POD Software");
  await page.fill(
    'input[name="shippingAddress.streetAddress1"]',
    "123 Main Street"
  );
  await page.fill('input[name="shippingAddress.streetAddress2"]', "Suite 4B");
  await page.fill('input[name="shippingAddress.city"]', "CAN THO");
  await page.fill('input[name="shippingAddress.zipCode"]', "94000");
  await page.fill('input[name="shippingAddress.phoneNumber"]', "0788815877");
  await page.locator('input[name="useShippingAsBilling"]').check();

  const totalPriceText = await page
    .locator("text=Total price")
    .locator("..")
    .textContent();
  console.log("Total price checkout:", totalPriceText);

  await page.click('button:has-text("Place Order")');

  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL("https://mypod.io.vn/default-channel/orders");
});
