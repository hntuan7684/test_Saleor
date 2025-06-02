// pageObjects/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    // Locators for login form elements
    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Log In" });
    
    // Locators for error messages
    this.errorMessage = page.locator(".error-message");
    this.emailRequiredError = page.locator("text=Email is required");
    this.passwordRequiredError = page.locator("text=Password is required");
    this.invalidCredentialsError = page.locator("text=Invalid credentials");
    this.accountLockedError = page.locator("text=Your account has been locked");
    this.tempLockedError = page.locator("text=Account temporarily locked");
    this.permLockedError = page.locator("text=Your account has been permanently locked");
    this.tooManyAttemptsError = page.locator("text=Too many failed attempts");
    this.invalidEmailFormatError = page.locator("text=Invalid email format");
  }

  async navigate() {
    await this.page.goto("https://mypod.io.vn/default-channel/login");
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(email, password) {
    if (email) {
      await this.fillEmail(email);
    }
    if (password) {
      await this.fillPassword(password);
    }
    await this.clickLogin();
  }

  async getErrorMessage() {
    try {
      await this.errorMessage.waitFor({ state: "visible", timeout: 5000 });
      return await this.errorMessage.textContent();
    } catch (error) {
      return "";
    }
  }

  async isEmailRequiredErrorVisible() {
    try {
      await this.emailRequiredError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isPasswordRequiredErrorVisible() {
    try {
      await this.passwordRequiredError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isInvalidCredentialsErrorVisible() {
    try {
      await this.invalidCredentialsError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isAccountLockedErrorVisible() {
    try {
      await this.accountLockedError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isTempLockedErrorVisible() {
    try {
      await this.tempLockedError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isPermLockedErrorVisible() {
    try {
      await this.permLockedError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isTooManyAttemptsErrorVisible() {
    try {
      await this.tooManyAttemptsError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isInvalidEmailFormatErrorVisible() {
    try {
      await this.invalidEmailFormatError.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
} 