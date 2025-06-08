// pageObjects/RegisterPage.js
class RegisterPage {
    constructor(page) {
        this.page = page;
        // Using more robust Playwright locators
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password').first(); // Assuming multiple "Password" inputs, take the first one
        this.confirmPasswordInput = page.getByPlaceholder('Confirm Password');
        this.registerButton = page.getByRole('button', { name: 'Register' });

        // Selectors for messages (adjust text to match your application)
        this.emailVerificationNeededMessage = page.locator('text=Please check your email to activate your account');
        this.emailExistsErrorMessage = page.locator('text=User with this email already exists.');
        this.passwordMismatchErrorMessage = page.locator('text=Passwords must match'); // Ensure this exact text is used

        // Selectors for required field error messages (based on provided image/actual app behavior)
        this.firstNameRequiredError = page.locator('text=First name is required');
        this.lastNameRequiredError = page.locator('text=Last name is required');
        this.emailRequiredError = page.locator('text=Email is required');
        // Assuming "Password is required" is unique to the Password field,
        // and "Confirm password is required" is for the Confirm Password field.
        this.passwordRequiredError = page.locator('text=Password is required');
        this.confirmPasswordRequiredError = page.locator('text=Confirm password is required');
    }

    async navigate() {
        await this.page.goto('https://mypod.io.vn/default-channel/register');
    }

    async fillFirstName(name) { await this.firstNameInput.fill(name); }
    async fillLastName(name) { await this.lastNameInput.fill(name); }
    async fillEmail(email) { await this.emailInput.fill(email); }
    async fillPassword(password) { await this.passwordInput.fill(password); }
    async fillConfirmPassword(confirmPassword) { await this.confirmPasswordInput.fill(confirmPassword); }
    async clickRegister() { await this.registerButton.click(); }

    async register(firstName, lastName, email, password, confirmPassword) {
        // Allows skipping a field if its value is undefined
        if (firstName !== undefined) await this.fillFirstName(firstName);
        if (lastName !== undefined) await this.fillLastName(lastName);
        if (email !== undefined) await this.fillEmail(email);
        if (password !== undefined) await this.fillPassword(password);
        if (confirmPassword !== undefined) await this.fillConfirmPassword(confirmPassword);

        await this.clickRegister();
    }

    // Methods to get message elements
    async getEmailVerificationNeededMessageElement() { return this.emailVerificationNeededMessage; }
    async getEmailExistsErrorElement() { return this.emailExistsErrorMessage; }
    async getPasswordMismatchErrorElement() { return this.passwordMismatchErrorMessage; }

    // Methods to get required field error message elements
    async getFirstNameRequiredErrorElement() { return this.firstNameRequiredError; }
    async getLastNameRequiredErrorElement() { return this.lastNameRequiredError; }
    async getEmailRequiredErrorElement() { return this.emailRequiredError; }
    async getPasswordRequiredErrorElement() { return this.passwordRequiredError; } // Will return the locator for "Password is required"
    async getConfirmPasswordRequiredErrorElement() { return this.confirmPasswordRequiredError; }
}

module.exports = RegisterPage;
export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByPlaceholder("Password").first();
    this.confirmPasswordInput = page.getByPlaceholder("Confirm Password");
    this.registerButton = page.getByRole("button", { name: "Register" });
  }

  async navigate() {
    await this.page.goto("https://mypod.io.vn/default-channel/register");
  }

  async fillFirstName(value) {
    await this.firstNameInput.fill(value);
  }

  async fillLastName(value) {
    await this.lastNameInput.fill(value);
  }

  async fillEmail(value) {
    await this.emailInput.fill(value);
  }

  async fillPassword(value) {
    await this.passwordInput.fill(value);
  }

  async fillConfirmPassword(value) {
    await this.confirmPasswordInput.fill(value);
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async register({ firstName, lastName, email, password, confirmPassword }) {
    if (firstName) await this.fillFirstName(firstName);
    if (lastName) await this.fillLastName(lastName);
    if (email) await this.fillEmail(email);
    if (password) await this.fillPassword(password);
    if (confirmPassword) await this.fillConfirmPassword(confirmPassword);
    await this.clickRegister();
  }

  getEmailExistsErrorElement() {
    return this.page.locator("text=/email.*exist/i");
  }

  getPasswordMismatchErrorElement() {
    return this.page.locator("text=Passwords must match");
  }

  getRequiredFieldError(fieldName) {
    return this.page.locator(`text=${fieldName} is required`);
  }
}
