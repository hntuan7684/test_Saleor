import { test, expect } from "@playwright/test";
// import { LoginPage } from "./pageObjects/LoginPage.js";
import { BASE_URL } from "./utils/constants.js";
import {
  initExcel,
  logTestResult,
  saveExcel,
  openExcelAfterSave,
} from "./utils/testResultLogger.js";

test.describe("Login Flow", () => {
  test.beforeAll(async () => {
    await initExcel("Login"); // Initialize Excel with Login sheet
  });

  test.afterAll(async () => {
    await saveExcel();
    // await openExcelAfterSave();
  });

  const loginTestCases = [
    {
      id: "LG001",
      description: "Login with valid credentials",
      input: { email: "tuanhnt7684@gmail.com", password: "@hntTuan2023#" },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG002",
      description: "Incorrect password",
      input: { email: "testuser@example.com", password: "WrongPassword" },
      expected: "Error message indicating invalid credentials",
      shouldPass: false,
      expectedError: "Invalid credentials",
    },
    {
      id: "LG003",
      description: "Empty email field",
      input: { email: "", password: "SecurePass123" },
      expected: "Error message 'Email is required'",
      shouldPass: false,
      expectedError: "Email is required",
    },
    {
      id: "LG004",
      description: "Empty password field",
      input: { email: "testuser@example.com", password: "" },
      expected: "Error message 'Password is required'",
      shouldPass: false,
      expectedError: "Password is required",
    },
    {
      id: "LG005",
      description: "Unregistered email and password",
      input: { email: "unregistered@example.com", password: "ValidPass123!" },
      expected: "Error message indicating account does not exist",
      shouldPass: false,
      expectedError: "Invalid credentials",
    },
    {
      id: "LG006",
      description: "Password does not meet minimum requirements",
      input: { email: "testuser@example.com", password: "short" },
      expected: "Error message indicating password requirements not met",
      shouldPass: false,
      expectedError:
        "Password must be at least 8 characters long and contain at least one lowercase letter",
    },
    {
      id: "LG007",
      description: "Login with invalid email format",
      input: { email: "invalid-email-format", password: "ValidPass123!" },
      expected: "Error message 'Invalid email format'",
      shouldPass: false,
      expectedError: "Invalid email format",
    },
    {
      id: "LG008",
      description: "Email contains leading/trailing whitespaces",
      input: { email: "  testuser@example.com  ", password: "ValidPass123!" },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG009",
      description: "Login using uppercase email",
      input: { email: "TESTUSER@EXAMPLE.COM", password: "ValidPass123!" },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG010",
      description: "Multiple failed login attempts with incorrect password",
      input: { email: "testuser@example.com", password: "WrongPassword" },
      expected: "Error message after multiple failed attempts",
      shouldPass: false,
      expectedError: "Too many failed attempts. Please try again later.",
    },
    {
      id: "LG011",
      description: "Login with a locked user account",
      input: { email: "lockeduser@example.com", password: "ValidPass123!" },
      expected: "Error message 'Your account has been locked'",
      shouldPass: false,
      expectedError: "Your account has been locked",
    },
    {
      id: "LG012",
      description: "Login with email containing special characters",
      input: { email: "test+alias@example.com", password: "ValidPass123!" },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG013",
      description: "Login with invalid email missing '@'",
      input: { email: "invalidemail.com", password: "ValidPass123!" },
      expected: "Error message 'Invalid email format'",
      shouldPass: false,
      expectedError: "Invalid email format",
    },
    {
      id: "LG014",
      description: "Login with invalid email missing domain",
      input: { email: "user@", password: "ValidPass123!" },
      expected: "Error message 'Invalid email format'",
      shouldPass: false,
      expectedError: "Invalid email format",
    },
    {
      id: "LG015",
      description: "Login with password containing special characters",
      input: { email: "testuser@example.com", password: "!@#$%^&*()" },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG016",
      description: "Login with locked account (temporary lock)",
      input: { email: "temp.locked@example.com", password: "ValidPass123!" },
      expected: "Error message 'Account temporarily locked. Try again later.'",
      shouldPass: false,
      expectedError: "Account temporarily locked. Try again later.",
    },
    {
      id: "LG017",
      description: "Login with locked account (permanent lock)",
      input: { email: "perm.locked@example.com", password: "ValidPass123!" },
      expected: "Error message 'Your account has been permanently locked'",
      shouldPass: false,
      expectedError: "Your account has been permanently locked",
    },
    {
      id: "LG018",
      description: "Login without entering email and password",
      input: { email: "", password: "" },
      expected:
        "Error messages for both fields: 'Email is required', 'Password is required'",
      shouldPass: false,
      expectedError: "Email is required",
    },
    {
      id: "LG019",
      description: "Verify login with password reset process",
      input: { email: "testuser@example.com", password: "" },
      expected: "User should receive password reset instructions",
      shouldPass: false,
      expectedError: "Reset password link sent to your email",
    },
    {
      id: "LG020",
      description: "Verify UI of login page",
      input: { email: "", password: "" },
      expected: "Login page should display all essential elements correctly",
      shouldPass: true,
    },
  ];

  loginTestCases.forEach((testCase) => {
    test(`${testCase.id} - ${testCase.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      let actual = "";
      let status = "Fail";

      try {
        await loginPage.login(testCase.input.email, testCase.input.password);

        if (testCase.shouldPass) {
          // Check for successful login
          await expect(page)
            .locator("h1", { hasText: "Welcome to ZoomPrints" })
            .toBeVisible();
          await expect(page).toHaveURL(`${BASE_URL}`);

          actual = "User successfully logged in and redirected to home page";
          status = "Pass";
        } else {
          // Check for error message
          const errorLocator = page.locator(`text=${testCase.expectedError}`);
          await expect(errorLocator).toBeVisible();

          actual = `Error message displayed: '${testCase.expectedError}'`;
          status = "Pass";
        }
      } catch (e) {
        actual = `Exception: ${e.message}`;
      } finally {
        await logTestResult({
          id: testCase.id,
          description: testCase.description,
          input: `email=${testCase.input.email}; password=${testCase.input.password}`,
          expected: testCase.expected,
          actual,
          status,
        });
      }
    });
  });
});
