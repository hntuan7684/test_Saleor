import { test, expect } from "@playwright/test";

import { BASE_URL } from "./utils/constants";

test.describe("ZoomPrints UI Test Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("HP001 - Logo redirects to homepage", async ({ page }) => {
    await page.click('img[alt="SwiftPod Logo"]');
    await expect(page).toHaveURL(BASE_URL);
  });

  test("HP002 - Search with valid product name", async ({ page }) => {
    const keyword = "Gildan";
    await page.fill('input[placeholder="Search for products..."]', keyword);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/search?query=${encodeURIComponent(keyword)}`);
    await expect(page.locator("text=Search results for")).toContainText(
      `Search results for "${keyword}"`
    );
  });

  test("HP003 - Login button redirects to login page", async ({ page }) => {
    await page.click("div.flex.items-center.justify-center.rounded-md.p-2");

    await expect(page).toHaveURL(
      /https:\/\/accounts\.mypodsoftware\.io\.vn\/realms\/keycloak/
    );
  });

  test("HP004 - Sticky header remains visible on scroll", async ({ page }) => {
    const header = page.locator("header");
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(header).toBeVisible();
  });

  test("HP005 - Mobile menu opens on smaller screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.click('button[aria-controls="mobile-menu"]');
    await expect(page.locator("nav")).toBeVisible();
  });

  test("HP006 - Navigation links restricted when logged out", async ({
    page,
  }) => {
    await page.click("div.flex.items-center.justify-center.rounded-md.p-2");

    await expect(page).toHaveURL(
      /https:\/\/accounts\.mypodsoftware\.io\.vn\/realms\/keycloak/
    );
  });

  test("HP007 - Search with invalid product returns no results", async ({
    page,
  }) => {
    const keyword = "T-shrit";
    await page.fill('input[placeholder="Search for products..."]', keyword);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/search?query=${encodeURIComponent(keyword)}`);
    await expect(page.locator('h1:text("No results found")')).toBeVisible();
    await expect(page.locator("p.text-gray-500")).toContainText(
      `We couldn't find any matches for "${keyword}"`
    );
  });

  test("HP008 - Login button disabled when already logged in (mock)", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', "testaccount455@mailinator.com");
    await page.fill('input[name="password"]', "ValidPass123!");
    await page.click('button:has-text("Log in")');
    await page.waitForURL("**/default-channel");
    const loginLink = page.locator('a[href="/default-channel/login"]');
    await expect(loginLink).toHaveCount(0);
  });

  test('HP009 - "Welcome to ZoomPrints" is readable on all screen sizes', async ({
    page,
  }) => {
    const heading = page.locator('h1:has-text("Welcome to ZoomPrints")');
    await expect(heading).toBeVisible();
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(heading).toBeVisible();
  });

  test("HP010 - Service features are displayed correctly", async ({ page }) => {
    const features = [
      "Best Quality",
      "Secure Payment",
      "Professional",
      "Competitive Pricing",
    ];
    for (const text of features) {
      await expect(page.locator(`text=${text}`)).toBeVisible();
    }
  });

  test("HP011 - Resize to small and check text readability", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    const allText = await page.locator("body").textContent();
    expect(allText?.length).toBeGreaterThan(0);
  });

  test("HP012 - Page with JS disabled (manual/headless mode test)", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(BASE_URL);
    await expect(page.locator("body")).toContainText(["Welcome to ZoomPrints"]);
  });

  test("HP013 - Slow network simulation", async ({ browser }) => {
    const context = await browser.newContext({
      offline: false,
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();
    await page.route("**/*", (route) => route.continue({ delay: 2000 }));
    await page.goto(BASE_URL);
    await expect(page.locator('img[alt="SwiftPod Logo"]')).toBeVisible();
  });

  test('HP014 - "Learn More" button is visible and clickable', async ({
    page,
  }) => {
    const button = page.locator("text=Learn More").nth(1);
    await expect(button).toBeVisible();
    await button.first().click();
    await expect(page).toHaveURL(/service/);
  });

  test("HP015 - Each service card shows correct image, title, and description", async ({
    page,
  }) => {
    const cards = page.locator("div.rounded-xl.bg-\\[\\#F9F8FC\\]");
    const cardCount = await cards.count();

    console.log("Number of cards: ", cardCount);

    await expect(cardCount).toBeGreaterThan(0);
    await expect(cards.first().locator("svg")).toBeVisible();
    await expect(cards.first().locator("h3")).toBeVisible();
    await expect(cards.first().locator("p")).toBeVisible();
  });

  test('HP016 - "Learn More" on each card links correctly', async ({
    page,
  }) => {
    const links = page.locator('.service-card a:has-text("Learn More")');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute("href");
      expect(href).toMatch(/\/services\//);
    }
  });

  test("HP017 - Responsive layout", async ({ page }) => {
    const sizes = [
      { width: 320, height: 480 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ];
    for (const size of sizes) {
      await page.setViewportSize(size);
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("HP018 - Fonts and colors match branding", async ({ page }) => {
    const fontFamily = await page.evaluate(
      () => window.getComputedStyle(document.body).fontFamily
    );
    expect(fontFamily).toMatch(/sans-serif|Roboto|Inter|Work_Sans/);
  });
});

test.describe("Home Page Tests", () => {
  test("PS001 - Verify Home Page Elements and Navigation", async ({ page }) => {
    // Navigate to home page
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Verify main navigation elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav li a[href*="/default-channel/products"]')).toBeVisible();
    await expect(page.locator('a[href*="/cart"]')).toBeVisible();

    // Verify hero section
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    await expect(heroSection.locator('h1')).toBeVisible();

    // Verify featured products section
    const featuredProducts = page.locator('section', { hasText: /featured|popular/i });
    await expect(featuredProducts).toBeVisible();

    // Verify search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('test product');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/.*search.*/);

    // Verify responsive design
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile view
    await expect(page.locator('button[aria-label*="menu" i]')).toBeVisible();
  });
});
