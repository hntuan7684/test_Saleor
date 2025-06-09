const { test, expect } = require("@playwright/test");
const { generateUniqueEmail } = require("./utils/testDataHelper");

const registerURL = "https://zoomprints.com/default-channel/register";
const { BASE_URL } = require("./utils/constants");
test.describe("Registration Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(registerURL, {timeout: 360000});
  });

  test("Verify registration and reuse email", async ({ page }) => {
    const uniqueEmail = generateUniqueEmail("mailinator.com");
    console.log(`Test email first: ${uniqueEmail}`);
    await test.step("RG001-Verify successful registration with valid data", async () => {
      await page.fill('input[name="firstName"]', "John");
      await page.fill('input[name="lastName"]', "Doe");
      await page.fill('input[name="email"]', uniqueEmail);
      await page.fill('input[name="password"]', "Password123!");
      await page.fill('input[name="confirmPassword"]', "Password123!");
      await page.click('button:has-text("Register")');
      // Kiểm tra URL chuyển hướng sau khi đăng ký thành công
      await expect(page).toHaveURL(
        `https://mypod.io.vn/default-channel/login?email=${uniqueEmail}`,
        { timeout: 300000 }
      );
      console.log("✅ Redirected to login page with email after registration.");
    });

    await test.step("RG002-Verify registration with existing email", async () => {
      await page.goto(registerURL);

      await page.fill('input[name="firstName"]', "Existing");
      await page.fill('input[name="lastName"]', "User");
      await page.fill('input[name="email"]', uniqueEmail);
      await page.fill('input[name="password"]', "StrongPass123!");
      await page.fill('input[name="confirmPassword"]', "StrongPass123!");

      await page.click('button:has-text("Register")');

      // Kiểm tra thông báo lỗi (có thể là tiếng Việt)
      const errorMessage = page.locator(
        "text=User with this Email already exists."
      );
      await expect(errorMessage).toBeVisible({ timeout: 10000 });

      console.log("❗ Email already exists error is shown.");
    });
  });

  test("RG003-Verify registration with invalid email format", async ({
    page,
  }) => {
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', "invalidemail");
    await page.fill('input[name="password"]', "StrongPass123!");
    await page.fill('input[name="confirmPassword"]', "StrongPass123!");
    await expect(page.locator("text=Invalid email")).toBeVisible();
  });

  test("RG004-Verify registration with weak password", async ({ page }) => {
    const uniqueEmail = generateUniqueEmail("mailinator.com");
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', "12345");
    await page.fill('input[name="confirmPassword"]', "12345");
    await expect(
      page.locator("text=Password must be at least 8 characters")
    ).toBeVisible();
  });

  test("RG005-Verify registration without mandatory fields", async ({
    page,
  }) => {
    await page.goto(registerURL);
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.click('button:has-text("Register")');

    await expect(
      page.getByText("Email is required", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("Password is required", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText("Confirm password is required", { exact: true })
    ).toBeVisible();
  });

  test("RG006-Verify registration with password mismatch", async ({ page }) => {
    const uniqueEmail = generateUniqueEmail("mailinator.com");
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', "Password123!");
    await page.fill('input[name="confirmPassword"]', "Password321!");

    await page.click('button:has-text("Register")'); // Đảm bảo form được submit để hiện lỗi

    await expect(page.locator("text=Passwords must match")).toBeVisible();
  });

  test("RG007-Verify UI of registration page", async ({ page }) => {
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button:has-text("Register")')).toBeVisible();
  });

  test("RG010-Verify registration with password containing special characters", async ({
    page,
  }) => {
    const specialEmail = generateUniqueEmail("mailinator.com");
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', specialEmail);
    await page.fill('input[name="password"]', "Pass@1234");
    await page.fill('input[name="confirmPassword"]', "Pass@1234");
    await page.click('button:has-text("Register")');
    await expect(
      page.locator(
        "text=Registration successful! Please check your email inbox or spam folder to confirm your account"
      )
    ).toBeVisible();
  });

  // test("RG011-Verify registration with password less than 8 characters", async ({
  //   page,
  // }) => {
  //   const uniqueEmail = generateUniqueEmail("mailinator.com");
  //   await page.fill('input[name="firstName"]', "John");
  //   await page.fill('input[name="lastName"]', "Doe");
  //   await page.fill('input[name="email"]', uniqueEmail);
  //   await page.fill('input[name="password"]', "12345");
  //   await page.fill('input[name="confirmPassword"]', "12345");
  //   await expect(
  //     page.locator("text=Password must be at least 8 characters")
  //   ).toBeVisible();
  // });

  test("RG012-Verify registration with invalid email containing spaces", async ({
    page,
  }) => {
    await page.fill('input[name="email"]', "test mail@mailinator.com");
    await page.click('button:has-text("Register")');
    await expect(page.locator("text=Invalid email")).toBeVisible();
  });

  test("RG013-Verify registration with valid email and password but blank name", async ({
    page,
  }) => {
    const uniqueEmail = generateUniqueEmail("mailinator.com");
    await page.fill('input[name="firstName"]', "");
    await page.fill('input[name="lastName"]', "");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', "Pass@1234");
    await page.fill('input[name="confirmPassword"]', "Pass@1234");
    await expect(page.locator("text=First name is required")).toBeVisible();
    await expect(page.locator("text=Last name is required")).toBeVisible();
  });
});
