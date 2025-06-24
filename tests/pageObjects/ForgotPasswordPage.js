// pageObjects/ForgotPasswordPage.js
import { FORGOTPASSWORD_URL } from '../utils/constants';
export class ForgotPasswordPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder("you@example.com");
    this.submitButton = page.getByRole("button", { hasText: "Send Reset Link" });
    this.heading = page.locator("h1, h2, h3", { hasText: "Forgot Password" });
    this.instructions = page.locator("p", { hasText: /reset|recover|password/i });
    this.successMessage = page.locator(".success-message, .alert-success", { hasText: /email|instruction|sent/i });
    this.errorMessage = page.locator(".error-message");
  }

  async navigate() {
    await this.page.goto(`${FORGOTPASSWORD_URL}`);
  }

  async fillEmail(value) {
    await this.emailInput.fill(value);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async isHeadingVisible() {
    try {
      await this.heading.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async areInstructionsVisible() {
    try {
      await this.instructions.waitFor({ state: "visible", timeout: 5000 });
      const text = await this.instructions.textContent();
      // Check if instructions are clear (at least 20 characters long)
      return text && text.length > 20;
    } catch (error) {
      return false;
    }
  }

  async isSuccessMessageVisible() {
    try {
      await this.successMessage.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getSuccessMessageText() {
    try {
      await this.successMessage.waitFor({ state: "visible", timeout: 5000 });
      return await this.successMessage.textContent() || "";
    } catch (error) {
      return "";
    }
  }

  async isErrorMessageVisible() {
    try {
      await this.errorMessage.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getErrorMessageText() {
    try {
      await this.errorMessage.waitFor({ state: "visible", timeout: 5000 });
      return await this.errorMessage.textContent() || "";
    } catch (error) {
      return "";
    }
  }

  async isFormStillFunctional() {
    try {
      // Check if the form elements are still interactive
      await this.emailInput.clear();
      await this.emailInput.fill("test@example.com");
      
      // Check if there are no error messages related to rate limiting
      const errorText = await this.getErrorMessageText();
      return !errorText.toLowerCase().includes("too many") && 
             !errorText.toLowerCase().includes("rate limit") &&
             !errorText.toLowerCase().includes("try again");
    } catch (error) {
      return false;
    }
  }
}