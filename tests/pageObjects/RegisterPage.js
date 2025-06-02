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
