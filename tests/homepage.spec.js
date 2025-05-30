import { test, expect } from "@playwright/test";

const BASE_URL = "https://mypod.io.vn/default-channel";

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
    await page.click('a[href="/default-channel/login"]');
    await expect(page).toHaveURL(/login/);
  });

  // test("HP004 - Cart icon shows correct item count", async ({ page }) => {
  //   //login
  //   await page.goto("https://mypod.io.vn/default-channel/login");
  //   await page.fill('input[name="email"]', "ngothanhloc.22102003@gmail.com");
  //   await page.fill('input[name="password"]', "Loc22102005");
  //   await page.click('button:has-text("Log in")');
  //   await page.waitForURL("**/default-channel");

  //   //Add product to cart
  //   await page.goto("https://mypod.io.vn/default-channel/products");
  //   await page.locator("a[href*='/products/']").first().click();
  //   await page.locator("button:has-text('Add to Cart')").click();
  //   await page.click("a[href='/default-channel/cart']");

  //   //check the number on the cart
  //   const countText = await page.textContent(
  //     "div.bg-neutral-900.text-white.text-xs.font-medium"
  //   );
  //   const match = countText?.match(/\d+/);
  //   const itemCount = match ? Number(match[0]) : 0;
  //   console.log("Số sản phẩm:", itemCount);

  //   //navigate to the cart
  //   await page.click("a[href='/default-channel/cart']");

  //   //check the number products in cart
  //   const liCount = await page
  //     .locator('ul[data-testid="CartProductList"] li')
  //     .count();

  //   // expect(cartIconCount).toBe(itemCount);
  // });

  test("HP005 - Sticky header remains visible on scroll", async ({ page }) => {
    const header = page.locator("header");
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(header).toBeVisible();
  });

  test("HP006 - Mobile menu opens on smaller screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.click('button[aria-controls="mobile-menu"]');
    await expect(page.locator("nav")).toBeVisible();
  });

  test("HP008 - Navigation links restricted when logged out", async ({
    page,
  }) => {
    await page.click("a[href='/default-channel/login']");
    await expect(page).toHaveURL(/login/);
  });

  test("HP009 - Search with invalid product returns no results", async ({
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

  test("HP010 - Login button disabled when already logged in (mock)", async ({
    page,
  }) => {
    await page.goto("https://mypod.io.vn/default-channel/login");
    await page.fill('input[name="email"]', "ngothanhloc.22102003@gmail.com");
    await page.fill('input[name="password"]', "Loc22102005");
    await page.click('button:has-text("Log in")');
    await page.waitForURL("**/default-channel");
    const loginLink = page.locator('a[href="/default-channel/login"]');
    await expect(loginLink).toHaveCount(0);
  });

  test('HP011 - "Welcome to ZoomPrints" is readable on all screen sizes', async ({
    page,
  }) => {
    const heading = page.locator('h1:has-text("Welcome to ZoomPrints")');
    await expect(heading).toBeVisible();
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(heading).toBeVisible();
  });

  test("HP015 - Service features are displayed correctly", async ({ page }) => {
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

  test("HP019 - Resize to small and check text readability", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    const allText = await page.locator("body").textContent();
    expect(allText?.length).toBeGreaterThan(0);
  });

  test("HP020 - Page with JS disabled (manual/headless mode test)", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(BASE_URL);
    await expect(page.locator("body")).toContainText(["Welcome to ZoomPrints"]);
  });

  test("HP021 - Slow network simulation", async ({ browser }) => {
    const context = await browser.newContext({
      offline: false,
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();
    await page.route("**/*", (route) => route.continue({ delay: 2000 }));
    await page.goto(BASE_URL);
    await expect(page.locator('img[alt="SwiftPod Logo"]')).toBeVisible();
  });

  test('HP024 - "Learn More" button is visible and clickable', async ({
    page,
  }) => {
    const button = page.locator("text=Learn More").nth(1);
    await expect(button).toBeVisible();
    await button.first().click();
    await expect(page).toHaveURL(/service/);
  });

  test("HP025 - Each service card shows correct image, title, and description", async ({
    page,
  }) => {
    const cards = page.locator("div.rounded-xl.bg-\\[\\#F9F8FC\\]");
    const cardCount = await cards.count();

    console.log("Number of card: ", cardCount);

    await expect(cardCount).toBeGreaterThan(0);
    await expect(cards.first().locator("svg")).toBeVisible();
    await expect(cards.first().locator("h3")).toBeVisible();
    await expect(cards.first().locator("p")).toBeVisible();
  });

  test('HP026 - "Learn More" on each card links correctly', async ({
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

  test("HP027 - Responsive layout", async ({ page }) => {
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

  test("HP028 - Fonts and colors match branding", async ({ page }) => {
    const fontFamily = await page.evaluate(
      () => window.getComputedStyle(document.body).fontFamily
    );
    expect(fontFamily).toMatch(/sans-serif|Roboto|Inter|Work_Sans/);
  });

  test('HP029 - Click "Learn More" when offline', async ({ browser }) => {
    const context = await browser.newContext({ offline: true });
    const page = await context.newPage();
    await page.goto(BASE_URL);
    await page.click("text=Learn More").catch(() => {});
    await expect(page.locator("text=No Internet")).toBeVisible();
  });

  //   test("HP030 - Broken images show fallback content", async ({ page }) => {
  //     await page.evaluate(() => {
  //       document
  //         .querySelectorAll("img")
  //         .forEach((img) => (img.src = "broken-link.jpg"));
  //     });
  //     // Test for alt text or fallback display
  //   });

  //   test("HP031 - Layout handles narrow widths", async ({ page }) => {
  //     await page.setViewportSize({ width: 250, height: 800 });
  //     await expect(page.locator("body")).toBeVisible();
  //   });

  //   test("HP032 - Invalid Learn More link returns 404", async ({ page }) => {
  //     await page.goto(`${BASE_URL}/invalid-service-link`);
  //     await expect(page.locator("text=404")).toBeVisible();
  //   });

  //   test("HP033 - Image loading with slow internet", async ({ browser }) => {
  //     const context = await browser.newContext({
  //       permissions: ["network"],
  //       viewport: { width: 1280, height: 720 },
  //     });
  //     const page = await context.newPage();
  //     await page.route("**/*.{jpg,png}", (route) =>
  //       route.continue({ delay: 3000 })
  //     );
  //     await page.goto(BASE_URL);
  //     // Check if spinner appears
  //   });

  //   test('HP034 - "Your Guide to Our Process" title appears', async ({
  //     page,
  //   }) => {
  //     await expect(
  //       page.locator('h2:has-text("Your Guide to Our Process")')
  //     ).toBeVisible();
  //   });

  //   test("HP035 - Subtitle is clear and readable", async ({ page }) => {
  //     await expect(
  //       page.locator("text=A stepbystep guide to help you move")
  //     ).toBeVisible();
  //   });

  //   test("HP036 - Step order is correct", async ({ page }) => {
  //     const steps = await page.locator(".steps li").allTextContents();
  //     expect(steps[0]).toContain("Pick your product");
  //     expect(steps[1]).toContain("Design");
  //     expect(steps[2]).toContain("Let's us do the rest!");
  //   });

  //   test("HP037 - Images load and are correctly sized", async ({ page }) => {
  //     const images = page.locator("img");
  //     await expect(images.first()).toBeVisible();
  //     const size = await images.first().boundingBox();
  //     expect(size?.width).toBeGreaterThan(50);
  //   });

  //   test("HP038 - Step text is clear for different users", async ({ page }) => {
  //     const steps = page.locator(".steps li");
  //     await expect(steps).toHaveCountGreaterThan(0);
  //     await expect(steps.first()).toContainText(/Pick|Design|rest/i);
  //   });
});
