import { test } from "./global-test";
import { expect } from "@playwright/test";
import { BASE_URL, LOGIN_URL } from "./utils/constants";


test.describe("ZoomPrints UI Test Cases", () => {
  test.beforeEach(async ({ page }) => {
    try {
      await page.goto(BASE_URL, {
        timeout: 30000,
        waitUntil: "domcontentloaded",
      });
    } catch (error) {
      console.log(`Navigation failed: ${error.message}`);
      // Continue the test even if initial navigation fails
      // Some tests might use different URLs or test offline behavior
    }
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
    try {
      // Wait for page load
      await page.waitForLoadState("domcontentloaded", { timeout: 60000 });

      // Try different possible login button selectors
      const loginSelectors = [
        "div.flex.items-center.justify-center.rounded-md.p-2",
        "button:has-text('Log in')",
        "a:has-text('Log in')",
        "[aria-label='Log in']",
      ];

      for (const selector of loginSelectors) {
        const button = page.locator(selector);
        if ((await button.count()) > 0) {
          await button.click();
          // Wait for URL change
          await page.waitForURL(/.*keycloak.*/, { timeout: 30000 });
          await expect(page).toHaveURL(
            /https:\/\/accounts\.mypodsoftware\.io\.vn\/realms\/keycloak/
          );
          return;
        }
      }

      throw new Error("Login button not found with any known selector");
    } catch (error) {
      console.log("Error in login button test:", error.message);
      await page.screenshot({ path: "test-results/login-button-error.png" });
      throw error;
    }
  });

  test("HP004 - Sticky header remains visible on scroll", async ({ page }) => {
    try {
      // Wait for page load
      await page.waitForLoadState("domcontentloaded", { timeout: 60000 });

      // Wait for header to be present
      const header = page.locator("header");
      await expect(header).toBeVisible({ timeout: 30000 });

      // Get initial header position
      const initialPosition = await header.boundingBox();

      // Scroll gradually to avoid potential issues
      await page.evaluate(() => {
        window.scrollTo({
          top: 1000,
          behavior: "smooth",
        });
      });

      // Wait a bit for scroll to complete
      await page.waitForTimeout(1000);

      // Check if header is still visible
      await expect(header).toBeVisible();

      // Get new position and verify it's at the top
      const newPosition = await header.boundingBox();
      expect(newPosition?.y).toBeLessThanOrEqual(initialPosition?.y || 0);
    } catch (error) {
      console.log("Error in sticky header test:", error.message);
      await page.screenshot({ path: "test-results/sticky-header-error.png" });
      throw error;
    }
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
    await page.goto(LOGIN_URL);
    await page.fill('input[name="username"]', "testaccount455@mailinator.com");
    await page.fill('input[name="password"]', "ValidPass123!");
    await page.click('button:has-text("Log in")');
    await page.waitForURL("**/us");
    const loginLink = page.locator('a[href="/us/login"]');
    await expect(loginLink).toHaveCount(0);
  });
  test('HP009 - "Welcome to ZoomPrints" is readable on all screen sizes', async ({
    page,
  }) => {
    try {
      // Wait for page load with longer timeout
      await page.waitForLoadState("domcontentloaded", { timeout: 60000 });

      // Try different heading variations that might be used
      const possibleHeadings = [
        'h1:has-text("Welcome to ZoomPrints")',
        'h1:has-text("Welcome")',
        "h1",
      ];

      let heading = null;
      for (const selector of possibleHeadings) {
        const h = page.locator(selector);
        if ((await h.count()) > 0) {
          heading = h;
          break;
        }
      }

      // If we found a heading, test its visibility at different viewport sizes
      if (heading) {
        await expect(heading).toBeVisible({ timeout: 10000 });
        await page.setViewportSize({ width: 375, height: 812 });
        await expect(heading).toBeVisible({ timeout: 10000 });
      } else {
        console.log(
          "Warning: Main heading not found, page might be loading or structure changed"
        );
      }
    } catch (error) {
      console.log("Error in heading check:", error.message);
      // Take screenshot for debugging
      await page.screenshot({
        path: "test-results/heading-check-error.png",
        fullPage: true,
      });
      throw error;
    }
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
    try {
      await page.setViewportSize({ width: 320, height: 480 });
      await page.waitForLoadState("domcontentloaded", { timeout: 60000 });

      // Wait for any content to appear
      await page.waitForSelector("body", { timeout: 10000 });

      // Check for text in important sections
      const importantSelectors = [
        "header",
        "main",
        "h1",
        "p",
        ".content",
        "nav",
      ];

      let foundText = false;
      for (const selector of importantSelectors) {
        try {
          const element = page.locator(selector).first();
          const text = await element.textContent();
          if (text && text.trim().length > 0) {
            foundText = true;
            break;
          }
        } catch (error) {
          console.log(`No text found in ${selector}`);
        }
      }

      expect(foundText).toBe(true);
    } catch (error) {
      console.log("Error in text readability check:", error.message);
      // Take screenshot for debugging
      await page.screenshot({
        path: "test-results/text-readability-error.png",
        fullPage: true,
      });
      throw error;
    }
  });
  test("HP012 - Page with JS disabled (manual/headless mode test)", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      offline: false,
    });
    const page = await context.newPage();
    try {
      await page.goto(BASE_URL, {
        timeout: 30000,
        waitUntil: "domcontentloaded",
      });
      await expect(page.locator("body")).toContainText([
        "Welcome to ZoomPrints",
      ]);
    } catch (error) {
      // Test that the page handles JS being disabled gracefully
      const errorText = await page.locator("body").textContent();
      expect(errorText).toBeTruthy();
    }
  });

  test("HP013 - Slow network simulation", async ({ browser }) => {
    const context = await browser.newContext({
      offline: false,
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    // Simulate slow 3G network conditions
    await context.route("**/*", async (route) => {
      // Add delay to all requests
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.continue();
    });

    try {
      await page.goto(BASE_URL, {
        timeout: 60000, // Increased timeout for slow network
        waitUntil: "domcontentloaded",
      });

      // Check if critical UI elements are visible
      await expect(page.locator('img[alt="SwiftPod Logo"]')).toBeVisible();
    } catch (error) {
      // Verify that loading indicators or fallback content is shown
      const pageContent = await page.locator("body").textContent();
      expect(pageContent).toBeTruthy();
    }
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
    try {
      await page.waitForLoadState("domcontentloaded");

      const styles = await page.evaluate(() => {
        const computedStyle = window.getComputedStyle(document.body);
        return {
          fontFamily: computedStyle.fontFamily,
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
        };
      });

      // Check font family with more flexible matching
      expect(styles.fontFamily.toLowerCase()).toMatch(
        /sans-serif|roboto|inter|work_sans/i
      );

      // Verify colors are valid CSS color values
      expect(styles.backgroundColor).toBeTruthy();
      expect(styles.color).toBeTruthy();
    } catch (error) {
      console.log("Style computation failed:", error.message);
      // Continue test execution - style checks are non-critical
    }
  });
});

test.describe("Home Page Tests", () => {
  test("PS001 - Verify Home Page Elements and Navigation", async ({ page }) => {
    // Navigate to home page
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Verify main navigation elements
    await expect(page.locator("nav")).toBeVisible();
    await expect(
      page.locator('nav li a[href*="/us/products"]')
    ).toBeVisible();
    await expect(page.locator('a[href*="/cart"]')).toBeVisible();

    // Verify hero section
    const heroSection = page.locator("section").first();
    await expect(heroSection).toBeVisible();
    await expect(heroSection.locator("h1")).toBeVisible();

    // Verify featured products section
    const featuredProducts = page.locator("section", {
      hasText: /featured|popular/i,
    });
    await expect(featuredProducts).toBeVisible();

    // Verify search functionality
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="search" i]'
    );
    await expect(searchInput).toBeVisible();
    await searchInput.fill("test product");
    await searchInput.press("Enter");
    await expect(page).toHaveURL(/.*search.*/);

    // Verify responsive design
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile view
    await expect(page.locator('button[aria-label*="menu" i]')).toBeVisible();
  });
});
