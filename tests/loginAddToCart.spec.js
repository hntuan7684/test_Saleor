import { test, expect } from "@playwright/test";
import { BASE_URL } from "./utils/constants.js";

test.describe("Đăng nhập và thêm sản phẩm vào giỏ hàng", () => {

  test("TC019 - Đăng nhập và thêm sản phẩm vào giỏ hàng", async ({ page }) => {
    const email = "testaccount455@mailinator.com";
    const password = "ValidPass123!";

    let actual = "";
    let status = "Fail";

    try {
      // 1. Đăng nhập
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="username"]', email);
      await page.fill('input[placeholder="Password"]', password);
      await page.getByRole("button", { name: "Log In" }).click();

      await expect(page).toHaveURL(BASE_URL, { timeout: 10000 });
      await expect(
        page.getByRole("heading", { name: /welcome/i })
      ).toBeVisible();

      // 2. Vào trang sản phẩm
      await page.goto(`${BASE_URL}/products/bella-3001`);

      // 3. Chọn màu và size
      await page.locator('button[title^="WHITE"]').click();
      await page.locator('button[title="M"]').click();

      // 4. Nếu có option, chọn option đầu tiên
      const option = page
        .locator('[role="option"][aria-disabled="false"]')
        .first();
      if (await option.isVisible()) {
        await option.click();
      }

      // 5. Kiểm tra input số lượng
      const quantityInput = page.locator(
        'div:has-text("Qty:") input[type="number"]'
      );

      await expect(quantityInput).toBeEnabled({ timeout: 5000 });

      // 6. Thêm vào giỏ
      const addToCartBtn = page.locator("#add-to-cart-button");
      await expect(addToCartBtn).toBeEnabled({ timeout: 5000 });
      await addToCartBtn.scrollIntoViewIfNeeded();
      await addToCartBtn.click();

      // 7. Xác nhận đã thêm vào giỏ (nếu có thông báo)
      const confirmationToast = page.locator(
        '.toast-message, [role="alert"], text=Đã thêm vào giỏ'
      );
      if (await confirmationToast.isVisible({ timeout: 5000 })) {
        await expect(confirmationToast).toContainText("Đã thêm vào giỏ");
      }

      // 8. Mở giỏ hàng
      await page.goto(`${BASE_URL}/cart`);
      await expect(page).toHaveURL(`${BASE_URL}/cart`);

      // 9. Kiểm tra sản phẩm trong giỏ
      const cartItem = page.locator("h2", { hasText: "BELLA + CANVAS" });
      await expect(cartItem).toBeVisible();

      await expect(quantityInput).toBeVisible();
      await expect(quantityInput).toHaveValue("1");

      // ✅ Gán kết quả Pass CHỈ SAU KHI tất cả thành công
      actual =
        "Đăng nhập, thêm sản phẩm vào giỏ và xác minh trong giỏ hàng thành công";
      status = "Pass";
    } catch (e) {
      console.error("❌ Lỗi trong TC019:", e);
      actual = `Không thể hoàn tất quy trình thêm sản phẩm và xác minh giỏ hàng. Lỗi: ${e.message}`;
    } 
  });
});
