import { test, expect } from "@playwright/test";
import { BASE_URL } from "./utils/constants";

test.describe("Searching Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("SF001 - Valid keyword search", async ({ page }) => {
    for (const keyword of ["Gildan", "Next Level", "BELLA"]) {
      await page.fill('input[placeholder="Search for products..."]', keyword);
      await page.click('button[type="submit"]');
      await page.waitForURL(`**/search?query=${encodeURIComponent(keyword)}`);
      await expect(page.locator("text=Search results for")).toContainText(
        `Search results for "${keyword}"`
      );
    }
  });

  test("SF002 - Misspelled keyword with suggestions", async ({ page }) => {
    const keyword = "T-shrit";
    await page.fill('input[placeholder="Search for products..."]', keyword);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/search?query=${encodeURIComponent(keyword)}`);
    await expect(page.locator('h1:text("No results found")')).toBeVisible();
    await expect(page.locator("p.text-gray-500")).toContainText(
      `We couldn't find any matches for "${keyword}"`
    );
  });

  test("SF003 - Blank search field", async ({ page }) => {
    await page.fill('input[placeholder="Search for products..."]', " ");
    await page.click('button[type="submit"]');
    await page.waitForURL(`**`);
  });

  test("SF004 - Special characters in query", async ({ page }) => {
    const keyword = "'#$%&'";
    await page.fill('input[placeholder="Search for products..."]', keyword);
    await page.click('button[type="submit"]');
    await page.pause();
    await expect(page.locator('h1:text("No results found")')).toBeVisible();
    await expect(page.locator("p.text-gray-500")).toContainText(
      `We couldn't find any matches for "${keyword}"`
    );
  });

  test("SF005 - Case insensitivity check", async ({ page }) => {
    for (const keyword of ["GilDan", "GILDAN", "gilDAN"]) {
      await page.fill('input[placeholder="Search for products..."]', keyword);
      await page.click('button[type="submit"]');

      await page.waitForURL(/search\?query=/);

      const productList = page.locator('[data-testid="ProductList"]');
      await expect(productList).toBeVisible();

      const products = page.locator('[data-testid="ProductElement"]');

      const count = await products.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const name = await products.nth(i).locator("h3").innerText();
        expect(name.toLowerCase()).toContain(keyword.toLowerCase());
      }
    }
  });

  test("SF006 - Partial keyword search", async ({ page }) => {
    const keyword = "Next";
    await page.fill('input[placeholder="Search for products..."]', keyword);
    await page.click('button[type="submit"]');

    await page.waitForURL(/search\?query=/);

    const productList = page.locator('[data-testid="ProductList"]');
    await expect(productList).toBeVisible();

    const products = page.locator('[data-testid="ProductElement"]');

    const count = await products.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const name = await products.nth(i).locator("h3").innerText();
      expect(name.toLowerCase()).toContain(keyword.toLowerCase());
    }
  });

  test("SF007 - Keyword matching multiple products", async ({ page }) => {
    const keyword = "tee";
    await page.fill('input[placeholder="Search for products..."]', keyword);
    await page.click('button[type="submit"]');

    await page.waitForURL(/search\?query=/);

    const productList = page.locator('[data-testid="ProductList"]');
    await expect(productList).toBeVisible();

    const products = page.locator('[data-testid="ProductElement"]');

    const count = await products.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const name = await products.nth(i).locator("p").nth(1).innerText();
      expect(name.toLowerCase()).toContain(keyword.toLowerCase());
    }
  });

  test("SF008 - Long keyword search", async ({ page }) => {
    const keyword = "Next Level";
    await page.fill('input[placeholder="Search for products..."]', keyword);
    await page.click('button[type="submit"]');

    await page.waitForURL(/search\?query=/);

    const productList = page.locator('[data-testid="ProductList"]');
    await expect(productList).toBeVisible();

    const products = page.locator('[data-testid="ProductElement"]');

    const count = await products.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const name = await products.nth(i).locator("p").nth(1).innerText();
      expect(name.toLowerCase()).toContain(keyword.toLowerCase());
    }
  });

  test("SF009 - SQL Injection check", async ({ page }) => {
    const keyword = "' OR 1=1; --";
    await page.fill('input[placeholder="Search for products..."]', keyword);
    await page.click('button[type="submit"]');
    await page.pause();
    await expect(page.locator('h1:text("No results found")')).toBeVisible();
    await expect(page.locator("p.text-gray-500")).toContainText(
      `We couldn't find any matches for "${keyword}"`
    );
  });

  test("SF010 - XSS attack check", async ({ page }) => {
    const keyword = "alert('XSS');";
    await page.fill('input[placeholder="Search for products..."]', keyword);
    await page.click('button[type="submit"]');
    await expect(page.locator("body")).not.toContainText("alert");
  });

  test("SF011 - High-frequency search", async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.fill('input[placeholder="Search for products..."]', "gildan");
      await page.click('button[type="submit"]');
      await expect(page.locator('[data-testid="ProductList"]')).toBeVisible();
    }
  });
});
