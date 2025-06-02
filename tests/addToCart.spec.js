import { test, expect } from "@playwright/test";
import { initExcel, logTestResult, saveExcel } from "./utils/testResultLogger.js";

test.describe("Thêm sản phẩm vào giỏ hàng", () => {
  test.beforeAll(async () => {
    await initExcel();
  });

  test.afterAll(async () => {
    await saveExcel();
  });

  test("TC018 - Chọn màu, size và thêm vào giỏ hàng", async ({ page }) => {
    let actual = "";
    let status = "Fail";

    try {
      // Truy cập trang sản phẩm cụ thể
      await page.goto("https://mypod.io.vn/default-channel/products/bella-3001");

      // Chọn màu (button có attribute title)
      const colorButton = page.locator('button[title^="WHITE"]'); // hoặc chọn màu bất kỳ
      await expect(colorButton).toBeVisible({ timeout: 5000 });
      await colorButton.click();

      // Chọn size
      const sizeButton = page.locator('button[title="M"]'); // có thể chọn size khác
      await expect(sizeButton).toBeVisible({ timeout: 5000 });
      await sizeButton.click();

      // (Tùy chọn) Chọn biến thể sản phẩm nếu có (role="option")
      const option = page.locator('[role="option"]').first();
      if (await option.isVisible()) {
        await option.click();
      }

      // Click "Add to Cart"
      const addToCartBtn = page.locator('#add-to-cart-button');
      await expect(addToCartBtn).toBeVisible({ timeout: 5000 });
      await addToCartBtn.click();

      // Kiểm tra xác nhận (giả sử có toast hoặc redirect)
      await expect(page.locator("text=Đã thêm vào giỏ")).toBeVisible({ timeout: 5000 });

      actual = "Sản phẩm được thêm vào giỏ thành công";
      status = "Pass";
    } catch (e) {
      actual = "Không thêm được sản phẩm vào giỏ";
    } finally {
      await logTestResult({
        id: "TC018",
        description: "Chọn màu, size và thêm vào giỏ hàng",
        input: "Chọn màu WHITE, size M",
        expected: "Thêm sản phẩm vào giỏ thành công",
        actual,
        status,
      });
    }
  });
});
