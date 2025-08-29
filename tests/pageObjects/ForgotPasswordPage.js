// pageObjects/ForgotPasswordPage.js
import { FORGOTPASSWORD_URL, LOGIN_URL } from '../utils/constants.js';

export class ForgotPasswordPage {
  constructor(page) {
    this.page = page;
    
    // Updated selectors based on MCP server analysis
    this.emailInput = page.locator('input#username');
    this.submitButton = page.locator('button[type="submit"]');
    this.heading = page.locator('h1.kc-page-title');
    
    // Message selectors
    this.successMessage = page.locator('.kc-message.success');
    this.errorMessage = page.locator('.kc-message.error');
    this.fieldError = page.locator('.kc-field-error');
    
    // Navigation
    this.backToLoginLink = page.locator('a:has-text("Sign In")');
    
    // Login page elements
    this.forgotPasswordLink = page.locator('a.kc-forgot-password');
  }

  async navigate() {
    // First navigate to login page to establish session
    await this.page.goto(LOGIN_URL);
    
    // Wait for page to load completely
    await this.page.waitForLoadState('networkidle');
    
    // Click on Forgot Password link
    await this.forgotPasswordLink.click();
    
    // Wait for forgot password page to load
    await this.page.waitForLoadState('networkidle');
    
    // Verify we're on the correct page
    await this.heading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillEmail(value) {
    // Wait for email input to be ready
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
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

  async isFieldErrorVisible() {
    try {
      await this.fieldError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getFieldErrorText() {
    try {
      await this.fieldError.waitFor({ state: "visible", timeout: 5000 });
      return await this.fieldError.textContent() || "";
    } catch (error) {
      return "";
    }
  }

  async clickBackToLogin() {
    await this.backToLoginLink.click();
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

  // Test keyboard navigation
  async testKeyboardNavigation() {
    try {
      // Test Tab navigation
      await this.emailInput.focus();
      await this.page.keyboard.press('Tab');
      
      // Check if focus moved to submit button
      const activeElement = await this.page.evaluate(() => document.activeElement?.tagName);
      return activeElement === 'BUTTON';
    } catch (error) {
      return false;
    }
  }

  // Test email validation
  async testEmailValidation(email, expectedResult) {
    await this.fillEmail(email);
    await this.clickSubmit();
    
    if (expectedResult === 'success') {
      return await this.isSuccessMessageVisible();
    } else if (expectedResult === 'error') {
      return await this.isErrorMessageVisible() || await this.isFieldErrorVisible();
    }
    
    return false;
  }
}