const { test, expect } = require("@playwright/test");

const SERVICE_URL = "https://mypod.io.vn/default-channel/service";

const services = [
  {
    name: "Silk Screening",
    imgAlt: "Silk Screening",
    descriptions: [
      /Facility for any sized order/i,
      /High-end M&R 8 and 12 head machines/i,
      /Specialized in 500\+ piece orders/i,
    ],
  },
  {
    name: "Direct-To-Garment",
    imgAlt: "Direct-To-Garment",
    descriptions: [
      /Top of the line Brother DL DTG machines/i,
      /No pretreatment stains/i,
      /Leading digital printing innovation/i,
    ],
  },
  {
    name: "Embroidery",
    imgAlt: "Embroidery",
    descriptions: [
      /Single headed machines for custom orders/i,
      /Dedicated quality embroidery staff/i,
      /Tajima machines with 15 thread colors/i,
    ],
  },
  {
    name: "Hard Goods",
    imgAlt: "Hard Goods",
    descriptions: [
      /Premium drinkware options/i,
      /Mimaki and Grando machines/i,
      /Professional finishing/i,
    ],
  },
  {
    name: "Custom Boxes",
    imgAlt: "Custom Boxes",
    descriptions: [
      /Eye-catching designs/i,
      /Perfect for executive kits/i,
      /Premium packaging solutions/i,
    ],
  },
  {
    name: "Canvas Print",
    imgAlt: "Canvas Print",
    descriptions: [
      /Latex HP printers/i,
      /Vibrant colors/i,
      /Durable materials/i,
    ],
  },
];

test.describe("Service Page Test Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SERVICE_URL, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
  });

  test("SV001 - Verify that clicking the link redirects the user to the default channel as expected", async ({ page }) => {
    const navHome = await page.locator('nav').getByRole('link', { name: 'Home' });
    await navHome.first().click();
    await expect(page).toHaveURL(/default-channel/);
  });

  test("SV002 - Check that the home link is displayed correctly and is recognizable to users", async ({ page }) => {
    const homeLink = page.locator('nav').getByRole('link', { name: 'Home' }).first();
    await expect(homeLink).toBeVisible();
  });

  test("SV003 - Ensure that the text 'Service' is visible and legible in the designated area", async ({ page }) => {
    const serviceLink = page.locator('nav').getByRole('link', { name: 'Service' }).first();
    await expect(serviceLink).toBeVisible();
  });

  test("SV004 - Confirm that the hover effect on the Service link changes the appearance as intended", async ({ page }) => {
    const serviceLink = page.locator('nav').getByRole('link', { name: 'Service' }).first();
    await serviceLink.hover();
    const cursorAfter = await serviceLink.evaluate(el => getComputedStyle(el).cursor);
    expect(cursorAfter).toBe('pointer');
  });

  test("SV005 - Test that the navigation works correctly when the user is on different pages", async ({ page }) => {
    const orderLink = page.locator('nav').getByRole('link', { name: 'Order' }).first();
    await orderLink.click();
    await expect(page).toHaveURL(/products/);
    const serviceLink = page.locator('nav').getByRole('link', { name: 'Service' }).first();
    await serviceLink.click();
    await expect(page).toHaveURL(/service/);
  });

  test("SV006 - Attempt to click the link when offline and verify error message", async ({ page }) => {
    await page.route("**/*", route => route.abort());
    
    const serviceLink = page.locator('nav').getByRole('link', { name: 'Service' }).first();
    await serviceLink.click();
    
    const errorMsg = page.getByText(/offline|no internet|connection error/i);
    await expect(errorMsg).toBeVisible();
  });

  test("SV007 - Check behavior with invalid URL", async ({ page }) => {
    await page.goto(SERVICE_URL + "-invalid", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/couldn[']t find the page|404/i)).toBeVisible();
  });

  test("SV008 - Check behavior when user does not have permission to access the page", async ({ page }) => {
    // Mock response 403 Forbidden
    await page.route("**/*", route => route.fulfill({
      status: 403,
      body: "Access Denied"
    }));
    
    await page.goto(SERVICE_URL);
    const errorMsg = page.getByText(/access denied|forbidden|permission denied/i);
    await expect(errorMsg).toBeVisible();
  });

  test("SV009 - Check behavior when the server is down", async ({ page }) => {
    // Mock response 500 Internal Server Error
    await page.route("**/*", route => route.fulfill({
      status: 500,
      body: "Internal Server Error"
    }));
    
    await page.goto(SERVICE_URL);
    const errorMsg = page.getByText(/server error|internal error|try again later/i);
    await expect(errorMsg).toBeVisible();
  });

  test("SV010 - Check behavior when the request times out", async ({ page }) => {
    // Mock response timeout
    await page.route("**/*", route => route.fulfill({
      status: 504,
      body: "Gateway Timeout"
    }));
    
    await page.goto(SERVICE_URL);
    const errorMsg = page.getByText(/timeout|request timeout|try again/i);
    await expect(errorMsg).toBeVisible();
  });

  test("SV011 - Verify Explore Services button appearance and behavior", async ({ page }) => {
    const exploreBtn = page.getByRole('button', { name: 'Explore Services' });
    
    // Check visibility and accessibility
    await expect(exploreBtn).toBeVisible();
    
    // Check background color
    const bgColor = await exploreBtn.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgColor).toMatch(/rgb\(253, 140, 110\)/i);
    
    // Check text color
    const textColor = await exploreBtn.evaluate(el => getComputedStyle(el).color);
    expect(textColor).toMatch(/rgb\(255, 255, 255\)/i);
    
    // Check hover effect
    const colorBefore = await exploreBtn.evaluate(el => getComputedStyle(el).backgroundColor);
    await exploreBtn.hover();
    const colorAfter = await exploreBtn.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(colorBefore).not.toBe(colorAfter);
  });

  test("SV012 - Verify Service link behavior with missing Services section", async ({ page }) => {
    await page.evaluate(() => {
      const el = document.querySelector('h1');
      if (el) el.remove();
    });
    const serviceLink = page.locator('nav').getByRole('link', { name: 'Service', exact: true }).first();
    await serviceLink.click();
    const errorMsg = page.getByText(/error|not found/i);
    await expect(errorMsg).not.toBeVisible();
  });

  test("SV013 - Check multiple rapid clicks on Service link", async ({ page }) => {
    const serviceLink = page.locator('nav').getByRole('link', { name: 'Service', exact: true }).first();
    for (let i = 0; i < 5; i++) {
      await serviceLink.click();
    }
    await expect(page).toHaveURL(/service/);
  });

  test("SV014 - Test Service link with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(SERVICE_URL);
    const fallback = page.getByText(/enable javascript|not available/i);
    await expect(fallback).toBeVisible();
    await context.close();
  });

  test("SV015 - Verify service display with images and descriptions", async ({ page }) => {
    for (const service of services) {
      const heading = page.locator('h2', { hasText: service.name }).first();
      await expect(heading).toBeVisible();
      const card = heading.locator('..');
      const img = card.getByAltText(service.imgAlt);
      await expect(img).toBeVisible();
      for (const desc of service.descriptions) {
        const descSpans = await card.locator('ul li span').allTextContents();
        expect(descSpans.some(text => desc.test(text))).toBeTruthy();
      }
    }
  });

  test("SV016 - Check service images load correctly", async ({ page }) => {
    for (const service of services) {
      const img = page.getByAltText(service.imgAlt);
      await expect(img).toBeVisible();
      const src = await img.getAttribute('src');
      expect(src).toContain(service.imgAlt.replace(/ /g, '_').toLowerCase());
    }
  });

  test("SV017 - Ensure service titles are properly formatted", async ({ page }) => {
    for (const service of services) {
      const heading = page.locator('h2', { hasText: service.name }).first();
      await expect(heading).toBeVisible();
      const fontWeight = await heading.evaluate(el => getComputedStyle(el).fontWeight);
      expect(Number(fontWeight)).toBeGreaterThanOrEqual(700);
    }
  });

  test("SV018 - Validate service descriptions clarity", async ({ page }) => {
    for (const service of services) {
      const heading = page.locator('h2', { hasText: service.name }).first();
      const card = heading.locator('..');
      for (const desc of service.descriptions) {
        const descSpans = await card.locator('ul li span').allTextContents();
        expect(descSpans.some(text => desc.test(text))).toBeTruthy();
      }
    }
  });

  test("SV019 - Test image hover scale effect", async ({ page }) => {
    for (const service of services) {
      const heading = page.locator('h2', { hasText: service.name }).first();
      const card = heading.locator('..');
      const img = card.getByAltText(service.imgAlt);
      const transformBefore = await img.evaluate(el => getComputedStyle(el).transform);
      await card.hover();
      const transformAfter = await img.evaluate(el => getComputedStyle(el).transform);
      expect(transformBefore).not.toBe(transformAfter);
    }
  });

  test("SV020 - Confirm responsive layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
  });

  test("SV021 - Ensure text contrast with background", async ({ page }) => {
    const allText = page.locator('body *');
    const count = await allText.count();
    for (let i = 0; i < count; i++) {
      const el = allText.nth(i);
      const color = await el.evaluate(e => getComputedStyle(e).color);
      const bg = await el.evaluate(e => getComputedStyle(e).backgroundColor);
      if (color === 'rgba(0, 0, 0, 0)' || bg === 'rgba(0, 0, 0, 0)') continue;
      expect(color).not.toBe(bg);
    }
  });

  test("SV022 - Check broken image handling", async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach(img => img.src = 'broken.jpg');
    });
    const brokenImgs = await page.locator('img[src="broken.jpg"]').count();
    expect(brokenImgs).toBeGreaterThan(0);
  });

  test("SV023 - Validate empty data source handling", async ({ page }) => {
    await page.route("**/service**", route => route.fulfill({ status: 200, body: "[]", contentType: "application/json" }));
    await page.reload();
    const cards = await page.locator('h2').count();
    expect(cards).toBe(0);
  });

  test("SV025 - Verify layout with invalid data formats", async ({ page }) => {
    await page.evaluate(() => {
      document.querySelectorAll('.service-description').forEach(el => el.textContent = '{bad:json');
    });
    await expect(page.getByRole('heading', { name: 'Services' })).toBeVisible();
  });

  test("SV027 - Test image display in low bandwidth mode", async ({ page }) => {
    await page.route('**/*.jpg', route => setTimeout(() => route.continue(), 2000));
    await page.reload();
    const images = page.locator('img');
    await expect(images.first()).toBeVisible();
  });

  test("SV028 - Verify Learn More button functionality", async ({ page }) => {
    const learnMoreLinks = page.getByRole('link', { name: 'Learn More' });
    const count = await learnMoreLinks.count();
    for (let i = 0; i < count; i++) {
      const link = learnMoreLinks.nth(i);
      await expect(link).toHaveAttribute('href', /service/);
    }
  });

  test("SV029 - Verify service order", async ({ page }) => {
    const serviceTitles = await page.locator('.grid h2').allTextContents();
    const expectedOrder = services.map(s => s.name);
    expect(serviceTitles).toEqual(expectedOrder);
  });

  test("SV030 - Verify Direct-To-Garment service details", async ({ page }) => {
    const dtg = page.getByText('Direct-To-Garment');
    await expect(dtg).toBeVisible();
    await expect(dtg.locator('..')).toContainText(/Brother DL DTG|No pretreatment stains|digital printing/i);
  });

  test("SV031 - Verify Silk Screening service details", async ({ page }) => {
    const silk = page.getByText('Silk Screening');
    await expect(silk).toBeVisible();
    await expect(silk.locator('..')).toContainText(/M\&R|500\+ piece orders|Facility/i);
  });
}); 