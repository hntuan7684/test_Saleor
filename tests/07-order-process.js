import { test, expect } from "@playwright/test";
import { PRODUCTS_URL } from "./utils/constants";


test.describe("Add product to cart", () => {

  test("TC018 - Selece color, size and add to cart", async ({ page }) => {
    let actual = "";
    let status = "Fail";

    try {
      // Truy cập trang sản phẩm cụ thể
      await page.goto(`${PRODUCTS_URL}/bella-3001`);

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
    } 
  });

   test("TC019 - Login and add product to cart", async ({ page }) => {
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
        '.toast-message, [role="alert"], text=Added to cart'
      );
      if (await confirmationToast.isVisible({ timeout: 5000 })) {
        await expect(confirmationToast).toContainText("Added to cart");
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
        "Login, add product to cart and verify add to cart successful";
      status = "Pass";
    } catch (e) {
      console.error("❌ Error in TC019:", e);
      actual = `Could not complete the process of adding products and verifying the cart. Error: ${e.message}`;
    } 
  });
});
