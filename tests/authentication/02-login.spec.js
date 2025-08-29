const { test } = require("../global-test");
const { expect } = require("@playwright/test");
const { LoginPage } = require("../pageObjects/LoginPage");
const { BASE_URL } = require("../utils/constants");
const { TEST_CREDENTIALS, TEST_EMAILS, TEST_PASSWORDS } = require("../utils/testCredentials");

test.describe("Login Flow", () => {
  const loginTestCases = [
    {
      id: "LG001",
      description: "Login with valid credentials",
      input: {
        email: TEST_CREDENTIALS.VALID_EMAIL,
        password: TEST_CREDENTIALS.VALID_PASSWORD,
      },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG002",
      description: "Incorrect password",
      input: { email: TEST_CREDENTIALS.VALID_EMAIL, password: TEST_PASSWORDS.INVALID },
      expected: "Error message indicating invalid credentials",
      shouldPass: false,
      expectedError: "Invalid credentials",
    },
    {
      id: "LG003",
      description: "Empty email field",
      input: { email: "", password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected: "Error message 'Email is required'",
      shouldPass: false,
      expectedError: "Email is required",
    },
    {
      id: "LG004",
      description: "Empty password field",
      input: { email: TEST_CREDENTIALS.VALID_EMAIL, password: TEST_PASSWORDS.EMPTY },
      expected: "Error message 'Password is required'",
      shouldPass: false,
      expectedError: "Password is required",
    },
    {
      id: "LG005",
      description: "Unregistered email and password",
      input: { email: TEST_EMAILS.UNREGISTERED, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected: "Error message indicating account does not exist",
      shouldPass: false,
      expectedError: "Invalid credentials",
    },
    {
      id: "LG006",
      description: "Password does not meet minimum requirements",
      input: { email: TEST_CREDENTIALS.VALID_EMAIL, password: TEST_PASSWORDS.SHORT },
      expected: "Error message indicating password requirements not met",
      shouldPass: false,
      expectedError:
        "Password must be at least 8 characters long and contain at least one lowercase letter",
    },
    {
      id: "LG007",
      description: "Login with invalid email format",
      input: { email: TEST_EMAILS.INVALID_FORMAT, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected: "Error message 'Invalid email format'",
      shouldPass: false,
      expectedError: "Invalid email format",
    },
    {
      id: "LG008",
      description: "Email contains leading/trailing whitespaces",
      input: { email: TEST_EMAILS.WITH_WHITESPACE, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG009",
      description: "Login using uppercase email",
      input: { email: TEST_EMAILS.UPPERCASE, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG010",
      description: "Multiple failed login attempts with incorrect password",
      input: { email: TEST_CREDENTIALS.VALID_EMAIL, password: TEST_PASSWORDS.INVALID },
      expected: "Error message after multiple failed attempts",
      shouldPass: false,
      expectedError: "Too many failed attempts. Please try again later.",
    },
    {
      id: "LG011",
      description: "Login with a locked user account",
      input: { email: TEST_CREDENTIALS.LOCKED_EMAIL, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected: "Error message 'Your account has been locked'",
      shouldPass: false,
      expectedError: "Your account has been locked",
    },
    {
      id: "LG012",
      description: "Login with email containing special characters",
      input: { email: TEST_EMAILS.WITH_ALIAS, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG013",
      description: "Login with invalid email missing '@'",
      input: { email: TEST_EMAILS.MISSING_AT, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected: "Error message 'Invalid email format'",
      shouldPass: false,
      expectedError: "Invalid email format",
    },
    {
      id: "LG014",
      description: "Login with invalid email missing domain",
      input: { email: TEST_EMAILS.MISSING_DOMAIN, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected: "Error message 'Invalid email format'",
      shouldPass: false,
      expectedError: "Invalid email format",
    },
    {
      id: "LG015",
      description: "Login with password containing special characters",
      input: { email: TEST_CREDENTIALS.VALID_EMAIL, password: TEST_PASSWORDS.SPECIAL_CHARS },
      expected:
        "User should be logged in successfully and redirected to the home page",
      shouldPass: true,
    },
    {
      id: "LG016",
      description: "Login with locked account (temporary lock)",
      input: { email: TEST_CREDENTIALS.TEMP_LOCKED_EMAIL, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected: "Error message 'Account temporarily locked. Try again later.'",
      shouldPass: false,
      expectedError: "Account temporarily locked. Try again later.",
    },
    {
      id: "LG017",
      description: "Login with locked account (permanent lock)",
      input: { email: TEST_CREDENTIALS.PERM_LOCKED_EMAIL, password: TEST_CREDENTIALS.VALID_PASSWORD },
      expected: "Error message 'Your account has been permanently locked'",
      shouldPass: false,
      expectedError: "Your account has been permanently locked",
    },
    {
      id: "LG018",
      description: "Login without entering email and password",
      input: { email: TEST_PASSWORDS.EMPTY, password: TEST_PASSWORDS.EMPTY },
      expected:
        "Error messages for both fields: 'Email is required', 'Password is required'",
      shouldPass: false,
      expectedError: "Email is required",
    },
    {
      id: "LG019",
      description: "Verify login with password reset process",
      input: { email: TEST_CREDENTIALS.VALID_EMAIL, password: TEST_PASSWORDS.EMPTY },
      expected: "User should receive password reset instructions",
      shouldPass: false,
      expectedError: "Reset password link sent to your email",
    },
    {
      id: "LG020",
      description: "Verify UI of login page",
      input: { email: TEST_PASSWORDS.EMPTY, password: TEST_PASSWORDS.EMPTY },
      expected: "Login page should display all essential elements correctly",
      shouldPass: true,
    },
  ];

  loginTestCases.forEach((testCase) => {
    test(`${testCase.id} - ${testCase.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      let actual = "";

      try {
        await loginPage.login(testCase.input.email, testCase.input.password);

        if (testCase.shouldPass) {
          // Check for successful login
          await expect(page)
            .locator("h1", { hasText: "Welcome to ZoomPrints" })
            .toBeVisible();
          await expect(page).toHaveURL(BASE_URL);

          actual = "User successfully logged in and redirected to home page";
        } else {
          // Check for error message
          const errorLocator = page.locator(`text=${testCase.expectedError}`);
          await expect(errorLocator).toBeVisible();

          actual = `Error message displayed: '${testCase.expectedError}'`;
        }
      } catch (e) {
        actual = `Exception: ${e.message}`;
      }
    });

    
  });

});
