const { test, expect } = require('@playwright/test');
const { ProductDetailPage } = require('./pageObjects/ProductDetailPage');

const PRODUCT_SLUG = 'comfort-color-1717'; // You can change the slug to test another product

// Helper: get button by visible name
const getButtonByText = (page, text) =>
  page.getByRole('button', { name: text, exact: true });

// Helper function to setup design page
async function setupDesignPage(page) {
  await page.waitForTimeout(10000);
  const sizeButtons = page.locator('div.flex-wrap button[title]:not([class*="rounded-full"])');
  await sizeButtons.filter({ hasText: 'M' }).first().click();
  await page.locator('a[href*="/design/"]').click();
  await expect(page).toHaveURL(/\/design\//);
}

test.describe.serial('Design Page Flow', () => {
  let pd;
  let page;

  test.beforeEach(async ({ page: testPage }) => {
    pd = new ProductDetailPage(testPage);
    page = testPage;
    await pd.goto(PRODUCT_SLUG);
  });

  test('DP001 - Navigate to product page and verify basic UI', async () => {
    await setupDesignPage(page);

    // Verify main UI elements
    const headings = page.getByText('Choose next step');
    await expect(headings.nth(0)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Colors' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Images' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Text' })).toBeVisible();
    await expect(page.getByText(/front/i).first()).toBeVisible();
    await expect(page.getByText(/back/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Add to Cart/i }).first()).toBeVisible();
  });

  test('DP002 - Verify main design image', async () => {
    // Setup design page first
    await setupDesignPage(page);

    // Verify main design image
    const mainImage = page.locator('#editorImage img');
    await expect(mainImage.first()).toBeVisible();
  });

  test('DP003 - Verify color palette functionality', async () => {
    // Setup design page first
    await setupDesignPage(page);

    // Click Colors button and verify palette
    await page.getByText('Colors', { exact: true }).nth(1).click();
    const paletteContainer = page.locator('div.MuiBox-root.css-1s7qwi5');
    await expect(paletteContainer).toBeVisible();
    const colorCircles = paletteContainer.locator('div.MuiBox-root');
    await expect(await colorCircles.count()).toBeGreaterThan(10);
  });
}); 