import { test, expect } from "@playwright/test";
import { RegisterPage } from "./pageObjects/RegisterPage.js";
import { generateUniqueEmail } from "./utils/testDataHelper.js";
import { openExcelAfterSave } from "./utils/testResultLogger.js";
import { getVerificationLinkFromMailinator } from "./utils/mailHelper.js";
import { BASE_URL } from "./utils/constants.js";
import {
  initExcel,
  logTestResult,
  saveExcel,
} from "./utils/testResultLogger.js";

test.describe("Registration Flow", () => {
  test.beforeAll(async () => {
    await initExcel();
  });

  const testcaseForRegister = [
    {
      field: "Password and confirm password mismatch",
      input: { password: "Password123!", confirmPassword: "Different123!" },
      expectedError: "Passwords do not match",
      shouldPass: false,
    },
    {
      field: "Password too short",
      input: { password: "Ab1@", confirmPassword: "Ab1@" },
      expectedError: "Password must be at least 8 characters",
      shouldPass: false,
    },
    {
      field: "Password missing special character",
      input: { password: "Password123", confirmPassword: "Password123" },
      expectedError: "Password must contain a special character",
      shouldPass: false,
    },

    { field: "Successfull", omit: "", shouldPass: true },
    { field: "First Name is empty", omit: "firstName", shouldPass: false },
    { field: "Last Name is empty", omit: "lastName", shouldPass: false },
    { field: "Email is empty", omit: "email", shouldPass: false },
    { field: "Password is empty", omit: "password", shouldPass: false },
    {
      field: "Confirm Password is empty",
      omit: "confirmPassword",
      shouldPass: false,
    },

    {
      field: "First Name, Last Name is empty",
      omit: ["firstName", "lastName"],
      shouldPass: false,
    },
    {
      field: "Email, Password is empty",
      omit: ["email", "password"],
      shouldPass: false,
    },
    {
      field: "Password, Confirm Password is empty",
      omit: ["password", "confirmPassword"],
      shouldPass: false,
    },
    {
      field: "First Name, Email, Password is empty",
      omit: ["firstName", "email", "password"],
      shouldPass: false,
    },
    {
      field: "First Name, Last Name, Confirm Password is empty",
      omit: ["firstName", "lastName", "confirmPassword"],
      shouldPass: false,
    },
    {
      field: "Last Name, Email, Password is empty",
      omit: ["lastName", "email", "password"],
      shouldPass: false,
    },
    {
      field: "First Name, Last Name, Email, Password is empty",
      omit: ["firstName", "lastName", "email", "password"],
      shouldPass: false,
    },
    {
      field: "First Name, Confirm Password is empty",
      omit: ["firstName", "confirmPassword"],
      shouldPass: false,
    },
    {
      field: "First Name, Last Name, Email is empty",
      omit: ["firstName", "lastName", "email"],
      shouldPass: false,
    },
    {
      field: "First Name, Last Name, Email, Confirm Password is empty",
      omit: ["firstName", "lastName", "email", "confirmPassword"],
      shouldPass: false,
    },

    {
      field: "Email invalid",
      input: { email: "invalid-email" },
      expectedError: "Email is invalid",
      shouldPass: false,
    },
  ];

  testcaseForRegister.forEach((testCase, index) => {
    test(`${(index + 1) < 10 ? `RG00${index + 1}` : `RG0${index + 1}`} - Register account: ${testCase.field}`, async ({
      page,
      context,
    }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.navigate();

      const defaultFormData = {
        firstName: "A",
        lastName: "B",
        email: generateUniqueEmail(),
        password: "@Valid123",
        confirmPassword: "@Valid123",
      };

      const formData = { ...defaultFormData };

      if (testCase.input) {
        Object.assign(formData, testCase.input);
      }

      if (testCase.omit) {
        const fieldsToOmit = Array.isArray(testCase.omit)
          ? testCase.omit
          : [testCase.omit];
        fieldsToOmit.forEach((field) => delete formData[field]);
      }

      let actual = "";
      let status = "Fail";
      let expected =
        testCase.expectedError ||
        (testCase.shouldPass ? "Register success" : "Show error message");

      try {
        await registerPage.register(formData);

        if (testCase.shouldPass) {
          await expect(page).toHaveURL(/verify|login/i);
          actual = "Register success";
          status = "Pass";
        } else {
          const errorLocator = page.locator(".error-message").first();
          await expect(errorLocator).toBeVisible({ timeout: 5000 });
          const errorText = await errorLocator.textContent();
          actual = `Show error: ${errorText}`;
          status =
            errorText?.toLowerCase().includes("required") ||
            errorText?.toLowerCase().includes("invalid") ||
            errorText?.toLowerCase().includes("password")
              ? "Pass"
              : "Fail";
        }
      } catch (error) {
        actual = `Exception: ${error.message}`;
      }

      await logTestResult({
        id: `RG${index + 1}`,
        description: testCase.field,
        input: Object.entries(formData)
          .map(([k, v]) => `${k}=${v}`)
          .join("; "),
        expected,
        actual,
        status,
      });
    });
  });
  test.afterAll(async () => {
    await saveExcel();
    // await openExcelAfterSave();
  });
});
