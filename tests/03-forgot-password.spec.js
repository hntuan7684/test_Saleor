import { test } from './global-test.js';
import { expect } from "@playwright/test";
import { ForgotPasswordPage } from "./pageObjects/ForgotPasswordPage.js";
import { generateUniqueEmail } from "./utils/testDataHelper.js";
import { BASE_URL, MAILINATOR_URL } from "./utils/constants.js";

test.describe("Forgot Password Flow", () => {
  // test.beforeAll(async () => {
  //   await initExcel("ForgotPassword");
  // });

  const testCases = [
    { id: "FP001", desc: "Valid email", email: "existing-user@mailinator.com", shouldPass: true },
    { id: "FP002", desc: "Invalid email format", email: "invalid-email", shouldPass: false },
    { id: "FP003", desc: "Verify Forgot Password heading is visible" },
    { id: "FP004", desc: "Incorrect email syntax", email: "not-an-email", shouldPass: false },
    { id: "FP005", desc: "Empty email field", email: "", shouldPass: false },
    { id: "FP006", desc: "Non-existent email", email: generateUniqueEmail(), shouldPass: true },
    { id: "FP007", desc: "Security - no email existence disclosure", email: generateUniqueEmail(), shouldPass: true },
    { id: "FP008", desc: "Multiple submissions in a row", email: "existing-user@mailinator.com", multiple: true },
    { id: "FP009", desc: "Reset email is sent to inbox", email: "existing-user@mailinator.com", checkInbox: true },
    { id: "FP010", desc: "Email with leading/trailing spaces", email: "  existing-user@mailinator.com  ", shouldPass: true },
    { id: "FP011", desc: "Email in uppercase", email: "EXISTING-USER@MAILINATOR.COM", shouldPass: true },
    { id: "FP012", desc: "Email with alias (+)", email: "existing-user+alias@mailinator.com", shouldPass: true },
    { id: "FP013", desc: "Mobile viewport rendering", email: "existing-user@mailinator.com", mobile: true },
    { id: "FP014", desc: "Accessibility with keyboard navigation" },
    { id: "FP015", desc: "Rate limiting after multiple requests", email: "existing-user@mailinator.com", repeat: 6 },
    { id: "FP016", desc: "SQL Injection in email field", email: "' OR '1'='1@mailinator.com", shouldPass: false },
    { id: "FP017", desc: "XSS attack in email field", email: "<script>alert(1)</script>@mail.com", shouldPass: false },
    { id: "FP018", desc: "Reload after email entry", email: "existing-user@mailinator.com", reload: true },
  ];

  for (const tc of testCases) {
    test(`${tc.id} - ${tc.desc}`, async ({ page, context }) => {
      const forgotPage = new ForgotPasswordPage(page);
      await forgotPage.navigate();
      let actual = "", status = "Fail";

      try {
        if (tc.mobile) await page.setViewportSize({ width: 375, height: 667 });
        if (tc.id === "FP003") {
          const heading = await forgotPage.isHeadingVisible();
          actual = heading ? "Heading is visible" : "Heading not found";
          status = heading ? "Pass" : "Fail";
        } else if (tc.id === "FP014") {
          const tabbable = [forgotPage.emailInput, forgotPage.submitButton];
          let accessible = true;
          for (const el of tabbable) {
            await el.focus();
            const active = await page.evaluate(() => document.activeElement?.tagName);
            if (!["INPUT", "BUTTON"].includes(active)) { accessible = false; break; }
          }
          actual = accessible ? "Accessible via keyboard" : "Not accessible via keyboard";
          status = accessible ? "Pass" : "Fail";
        } else if (tc.multiple) {
          await forgotPage.fillEmail(tc.email);
          const promises = Array.from({ length: 3 }, () => forgotPage.clickSubmit());
          await Promise.all(promises);
          const isOk = await forgotPage.isFormStillFunctional();
          actual = isOk ? "Handled multiple submits gracefully" : "Form error on multiple submits";
          status = isOk ? "Pass" : "Fail";
        } else if (tc.checkInbox) {
          await forgotPage.fillEmail(tc.email);
          await forgotPage.clickSubmit();
          const success = await forgotPage.isSuccessMessageVisible();
          if (success) {
            const inbox = await context.newPage();
            await inbox.goto(`${MAILINATOR_URL}/v4/public/inboxes.jsp?to=${tc.email.split('@')[0]}`);
            await inbox.waitForTimeout(8000);
            const visible = await inbox.locator("tr", { hasText: "Password Reset" }).isVisible();
            actual = visible ? "Email found in inbox" : "Email not found";
            status = visible ? "Pass" : "Fail";
            await inbox.close();
          } else {
            actual = "Success message not shown";
            status = "Fail";
          }
        } else if (tc.id === "FP007") {
          await forgotPage.fillEmail(tc.email);
          await forgotPage.clickSubmit();
          const message = await forgotPage.getSuccessMessageText();
          const isGeneric = !/(not found|doesn't exist|no account)/i.test(message);
          actual = isGeneric ? "No email disclosure" : `Message reveals existence: ${message}`;
          status = isGeneric ? "Pass" : "Fail";
        } else if (tc.repeat) {
          await forgotPage.fillEmail(tc.email);
          for (let i = 0; i < tc.repeat; i++) {
            await forgotPage.clickSubmit();
            await page.waitForTimeout(120000);
          }
          const msg = await forgotPage.getErrorMessageText();
          const limited = /too many|rate limit|try again/i.test(msg);
          actual = limited ? "Rate limit triggered" : `No rate limit error (${msg})`;
          status = limited ? "Pass" : "Fail";
        } else if (tc.reload) {
          await forgotPage.fillEmail(tc.email);
          await page.reload();
          const val = await forgotPage.emailInput.inputValue();
          actual = val === "" ? "Form reset after reload" : `Form retains: ${val}`;
          status = val === "" ? "Pass" : "Fail";
        } else {
          if (tc.email !== undefined) await forgotPage.fillEmail(tc.email);
          await forgotPage.clickSubmit();
          if (tc.shouldPass) {
            const visible = await forgotPage.isSuccessMessageVisible();
            actual = visible ? "Success message shown" : "No success message";
            status = visible ? "Pass" : "Fail";
          } else {
            const error = await forgotPage.getErrorMessageText();
            actual = error ? `Error shown: ${error}` : "No error message";
            status = /invalid|required/i.test(error || "") ? "Pass" : "Fail";
          }
        }
      } catch (e) {
        actual = `Exception: ${e.message}`;
        status = "Fail";
      }
    });
  }
});
