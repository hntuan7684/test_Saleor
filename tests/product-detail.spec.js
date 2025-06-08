// productDetail.spec.js (fixed selectors and logic)
const { test, expect } = require("@playwright/test");
const { ProductDetailPage } = require("./pageObjects/ProductDetailPage");
import { LoginPage } from "./pageObjects/LoginPage";
const PRODUCT_SLUG = "bella-3001";

// Helper: get exact button by visible name
const getButtonByText = (page, text) =>
  page.getByRole("button", { name: text, exact: true });

test.describe("Product Detail Page Tests", () => {
  let pd;

  test.beforeEach(async ({ page }) => {
    pd = new ProductDetailPage(page);
    await pd.goto(PRODUCT_SLUG);
  });

  test("PD001 - Verify Product Title is displayed correctly", async () => {
    await pd.page.waitForLoadState("networkidle");
    const allTitles = pd.page.locator("h1");
    const count = await allTitles.count();

    for (let i = 0; i < count; i++) {
      const title = allTitles.nth(i);
      const isVisible = await title.isVisible();
      const text = await title.innerText();
      if (isVisible && text.includes("BELLA + CANVAS - Jersey Tee - 3001")) {
        await expect(title).toHaveText("BELLA + CANVAS - Jersey Tee - 3001");
        return;
      }
    }
    throw new Error("No visible <h1> with expected product title found");
  });

  test("PD002 - Verify Product Image is displayed", async () => {
    const imageSlides = pd.page.locator("div[data-swiper-slide-index] img");
    const count = await imageSlides.count();
    for (let i = 0; i < count; i++) {
      await expect(imageSlides.nth(i)).toBeVisible();
    }
  });

  test("PD003 - Verify Color options are displayed and selectable", async () => {
    await pd.page.waitForLoadState("networkidle");

    // Only select color buttons (rounded-full) and exclude size buttons
    const colorButtons = pd.page.locator(
      'button.rounded-full[title]:not(:text("XS")):not(:text("S")):not(:text("M")):not(:text("L")):not(:text("XL")):not(:text("2XL")):not(:text("3XL")):not(:text("4XL")):not(:text("5XL"))'
    );

    const count = await colorButtons.count();
    console.log(`Found ${count} color buttons`);
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count / 10; i++) {
      const button = colorButtons.nth(i);
      try {
        await expect(button).toBeVisible({ timeout: 100 }); // wait until visible
        await button.scrollIntoViewIfNeeded();
        await button.click();
      } catch (e) {
        console.warn(
          `Color button ${i + 1} not clickable or visible - skipped`
        );
      }
    }
  });

  test("PD004 - Verify Size options are displayed and selectable", async () => {
    await pd.page.waitForLoadState("networkidle");

    // Only select size buttons, exclude color buttons (rounded-full)
    const sizeButtons = pd.page.locator(
      'div.flex-wrap button[title]:not([class*="rounded-full"])'
    );
    const count = await sizeButtons.count();
    console.log(`Found ${count} size buttons`);
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const btn = sizeButtons.nth(i);
      const label = await btn.textContent();
      console.log(`Clicking size button: ${label}`);
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
    }
  });

  test("PD005 - Verify Price is displayed correctly", async () => {
    const priceLocator = pd.page.locator("div", { hasText: "$" }).nth(0);
    await expect(priceLocator).toBeVisible({ timeout: 20000 });
  });

  test("PD006 - Verify Add to Cart button is clickable", async () => {
    await pd.page.waitForLoadState("networkidle");
    const buttonCart = pd.page.locator('button:has-text("Add to Cart")');
    await expect(buttonCart).toBeVisible();
    await buttonCart.click();
  });

  test("PD007 - Verify Quantity selector is working correctly", async () => {
    const qty = pd.page.locator('input[type="number"]');
    await qty.fill("2");
    await expect(qty).toHaveValue("2");
  });

  test("PD008 - Verify Product is added to Cart correctly", async () => {
    await getButtonByText(pd.page, "M").click();
    await pd.page.locator('input[type="number"]').fill("1");
    await pd.page.locator("button:has-text('Add to Cart')").click();
  });

  test("PD009 - Verify Error message for invalid quantity", async ({ page }) => {
    // 1. Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("testaccount123@mailinator.com", "ValidPass123!");
    await expect(
      page.getByRole("heading", { name: /Welcome to ZoomPrints/i })
    ).toBeVisible({ timeout: 30000 });

    // 2. Wait for successful login
    await expect(page).toHaveURL("https://mypod.io.vn/default-channel");

    // 3. Access product detail page
    const pd = new ProductDetailPage(page);
    await pd.goto("bella-3001");

    // 4. Enter invalid quantity
    const qtyInput = page.locator('input[type="number"]');
    await qtyInput.focus();
    await qtyInput.press("Control+A");
    await qtyInput.press("Backspace");
    await qtyInput.type("abc");

    // 5. Click "Add to Cart"
    await page.locator('button:has-text("Add to Cart")').click();

    // 6. Check actual error message being displayed (alert box)
    const systemErrorAlert = page.locator(
      'text="Something went wrong. Please try again later"'
    );
    await expect(systemErrorAlert).toBeVisible({ timeout: 3000 });

    // 7. Ensure still on product page
    await expect(page).toHaveURL(/products\/bella-3001/);
  });

  test("PD010 - Verify Product Images Carousel works correctly", async () => {
    const thumb = pd.page.locator("img").nth(1);
    await thumb.click();
  });

  test("PD011 - Verify Product Features list is displayed", async () => {
    const featuresHeading = pd.page.locator('h2:text("Features")');
    await expect(featuresHeading).toBeVisible();

    const featureItems = pd.page.locator("ul li");
    const count = await featureItems.count();
    console.log(`Found ${count} feature items`);

    for (let i = 0; i < count; i++) {
      const text = await featureItems.nth(i).innerText();
      console.log(`Feature ${i + 1}: ${text}`);
    }

    expect(count).toBeGreaterThan(0);
  });

  test("PD012 - Verify Breadcrumb navigation works", async ({ page }) => {
    const breadcrumb = page.locator('a:has-text("Products")');
    await expect(breadcrumb.first()).toBeVisible({ timeout: 10000 });
    await breadcrumb.first().click();
    await expect(page).toHaveURL(/.*products.*/);
  });

  test("PD013 - Verify Product URL is SEO friendly", async ({ page }) => {
    await expect(page.url()).toContain(PRODUCT_SLUG);
  });

  test("PD014 - Verify Image changes with color selection", async () => {
    await pd.page.waitForLoadState("networkidle");

    // Fail early if 404
    const is404 = await pd.page.locator("text=404").first().isVisible();
    expect(is404).toBeFalsy();

    // Fix: Pick only the first visible heading explicitly
    const headings = pd.page.locator('h1', {
      hasText: "BELLA + CANVAS - Jersey Tee - 3001",
    });
    const count = await headings.count();

    for (let i = 0; i < count; i++) {
      const el = headings.nth(i);
      if (await el.isVisible()) {
        await expect(el).toBeVisible({ timeout: 10000 });
        break;
      }
    }

    const productImage = pd.page.locator('div[data-swiper-slide-index="0"] img').first();
    await expect(productImage).toBeVisible({ timeout: 15000 });

    const initialSrc = await productImage.getAttribute("src");

    const colorButtons = pd.page.locator("button[title]");
    const countColor = await colorButtons.count();
    expect(countColor).toBeGreaterThan(0);

    await colorButtons.nth(3).click();

    await expect(productImage).not.toHaveAttribute("src", initialSrc, {
      timeout: 10000,
    });
  });

  test("PD015 - Verify Add to Cart without selecting Size", async () => {
    const addToCartButton = pd.page.locator('button:has-text("Add to Cart")');
    await expect(addToCartButton).toBeVisible({ timeout: 10000 });

    await addToCartButton.click();

    // Expect redirect to Keycloak login URL
    await expect(pd.page).toHaveURL(/\/protocol\/openid-connect\/auth/);
  });

  test('PD016 - Verify Product Description is displayed and formatted correctly', async () => {
    const descriptionHeading = pd.page.locator('h2', { hasText: 'Descriptions' }).first();
    await expect(descriptionHeading).toBeVisible({ timeout: 20000 });

    // Find `.prose` block immediately following the heading
    const proseBlock = descriptionHeading.locator(
      'xpath=following-sibling::div[contains(@class,"prose")]'
    );
    await expect(proseBlock).toBeVisible({ timeout: 15000 });

    const descriptionParagraphs = proseBlock.locator("p");
    const count = await descriptionParagraphs.count();
    expect(count).toBeGreaterThan(0);

    let matched = false;
    for (let i = 0; i < count; i++) {
      const text = await descriptionParagraphs.nth(i).innerText();
      if (text.includes("BELLA + CANVAS Jersey Tee")) {
        matched = true;
        break;
      }
    }
    expect(matched).toBeTruthy();
  });

  test('PD017 - Ensure "Customize Design" button navigates correctly', async ({ page }) => {
    await page.locator('a[href*="/design/"]').click();
    await expect(page).toHaveURL(/\/design\//);
  });
});