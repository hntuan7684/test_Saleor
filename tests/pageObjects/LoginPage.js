import { BASE_URL } from "../utils/constants.js";

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[placeholder="Email"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.loginButton = page.getByRole("button", { name: "Log In" });
    this.errorMessage = page.locator(".error-message");
  }

  /**
   * Navigate to the login page
   */
  async navigate() {
    await this.page.goto(`${BASE_URL}/login`);
  }

  /**
   * Fill login form with provided credentials
   * @param {string} email 
   * @param {string} password 
   */
  async fillLoginForm(email, password) {
    if (email !== undefined) {
      await this.emailInput.fill(email);
    }
    
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
  }

  /**
   * Submit login form
   */
  async submitForm() {
    await this.loginButton.click();
  }

  /**
   * Complete login process
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    await this.fillLoginForm(email, password);
    await this.submitForm();
  }

  /**
   * Check if error message is visible
   * @param {string} errorText Expected error text
   * @returns {Promise<boolean>} True if error message is visible and contains expected text
   */
  async hasError(errorText) {
    const error = this.page.locator(`text=${errorText}`);
    await error.waitFor({ state: 'visible', timeout: 5000 });
    return await error.isVisible();
  }
}