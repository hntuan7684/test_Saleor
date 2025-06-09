const { test, expect } = require('@playwright/test');
const psi = require('psi');
import { LoginPage } from "../pageObjects/LoginPage";
import { BASE_URL, LOGIN_URL, PRODUCTS_URL, SERVICE_URL, SUPPORT_URL } from "../utils/constants";
require('dotenv').config();

test.describe('PS001 - Home Page Performance Tests', () => {
  // const baseUrl = 'https://mypod.io.vn/default-channel';

  test('should pass PageSpeed Insights test for desktop', async () => {
    const result = await psi(BASE_URL, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'desktop',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Desktop Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Desktop Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Desktop Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Desktop SEO Score:', result.data.lighthouseResult.categories.seo.score);
  }, 60000);

  test('should pass PageSpeed Insights test for mobile', async () => {
    const result = await psi(BASE_URL, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'mobile',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Mobile Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Mobile Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Mobile Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Mobile SEO Score:', result.data.lighthouseResult.categories.seo.score);
  }, 60000);
}); 

test.describe('PS002 - Service Page Performance Tests', () => {
  // const serviceUrl = 'https://mypod.io.vn/default-channel/service';

  test('should pass PageSpeed Insights test for desktop', async () => {
    const result = await psi(SERVICE_URL, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'desktop',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Service Page - Desktop Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Service Page - Desktop Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Service Page - Desktop Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Service Page - Desktop SEO Score:', result.data.lighthouseResult.categories.seo.score);
  }, 60000);

  test('should pass PageSpeed Insights test for mobile', async () => {
    const result = await psi(SERVICE_URL, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'mobile',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Service Page - Mobile Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Service Page - Mobile Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Service Page - Mobile Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Service Page - Mobile SEO Score:', result.data.lighthouseResult.categories.seo.score);
  }, 60000);
}); 

test.describe('PS003 - Products Page Performance Tests', () => {
  // const productsUrl = 'https://mypod.io.vn/default-channel/products';

  test('should pass PageSpeed Insights test for desktop', async () => {
    const result = await psi(PRODUCTS_URL, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'desktop',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Products Page - Desktop Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Products Page - Desktop Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Products Page - Desktop Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Products Page - Desktop SEO Score:', result.data.lighthouseResult.categories.seo.score);
  }, 60000);

  test('should pass PageSpeed Insights test for mobile', async () => {
    const result = await psi(productsUrl, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'mobile',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Products Page - Mobile Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Products Page - Mobile Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Products Page - Mobile Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Products Page - Mobile SEO Score:', result.data.lighthouseResult.categories.seo.score);
  },60000);
}); 

test.describe('PS004 - Support Page Performance Tests', () => {
  // const supportUrl = 'https://mypod.io.vn/default-channel/support';

  test('should pass PageSpeed Insights test for desktop', async () => {
    const result = await psi(SUPPORT_URL, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'desktop',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Support Page - Desktop Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Support Page - Desktop Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Support Page - Desktop Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Support Page - Desktop SEO Score:', result.data.lighthouseResult.categories.seo.score);
  }, 60000);

  test('should pass PageSpeed Insights test for mobile', async () => {
    const result = await psi(SUPPORT_URL, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'mobile',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Support Page - Mobile Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Support Page - Mobile Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Support Page - Mobile Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Support Page - Mobile SEO Score:', result.data.lighthouseResult.categories.seo.score);
  }, 60000);
}); 

test.describe('PS005 - Login Page Performance Tests', () => {
  // const loginUrl = 'https://accounts.mypodsoftware.io.vn/realms/keycloak/protocol/openid-connect/auth?response_type=code&client_id=zoomprints-saleor-client&redirect_uri=https%3A%2F%2Fmypod.io.vn%2Fdefault-channel%2Fauth%2Fkeycloak-callback&scope=openid+profile+email+offline_access&state=eyJyZWRpcmVjdFVyaSI6Imh0dHBzOi8vbXlwb2QuaW8udm4vZGVmYXVsdC1jaGFubmVsL2F1dGgva2V5Y2xvYWstY2FsbGJhY2sifQ%3A1uNoRN%3AfvsuqZVfKRWhkYTiKvbmrR8XcsFatTBJ9VGlYACaFz0';

  test('should pass PageSpeed Insights test for desktop', async () => {
    const result = await psi(LOGIN_URL, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'desktop',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Login Page - Desktop Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Login Page - Desktop Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Login Page - Desktop Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Login Page - Desktop SEO Score:', result.data.lighthouseResult.categories.seo.score);
  }, 60000);

  test('should pass PageSpeed Insights test for mobile', async () => {
    const result = await psi(LOGIN_URL, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'mobile',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Login Page - Mobile Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Login Page - Mobile Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Login Page - Mobile Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Login Page - Mobile SEO Score:', result.data.lighthouseResult.categories.seo.score);
  }, 60000);
}); 

test.describe('PS006 - Authenticated Product Detail Page Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before running test
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("trungdt1718@gmail.com", "123456Aa@");
    await expect(
      page.getByRole("heading", { name: /Welcome to ZoomPrints/i })
    ).toBeVisible({ timeout: 60000 });

    // Verify successful login
    await expect(page).toHaveURL(BASE_URL);
  });

  test("should pass PageSpeed Insights test for authenticated product detail page (desktop)", async ({ page }) => {
    await page.goto(`${PRODUCTS_URL}/bella-3001`, { timeout: 60000 });

    const priceLocator = page.locator("div", { hasText: "$" }).nth(0);
    await expect(priceLocator).toBeVisible({ timeout: 20000 });

    page.pause();

    const result = await psi(`${PRODUCTS_URL}/bella-3001`, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'desktop',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    }, 60000);

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    console.log('Authenticated Product Detail Page - Desktop Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Authenticated Product Detail Page - Desktop Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Authenticated Product Detail Page - Desktop Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Authenticated Product Detail Page - Desktop SEO Score:', result.data.lighthouseResult.categories.seo.score);
    
  }, 120000);

}); 
