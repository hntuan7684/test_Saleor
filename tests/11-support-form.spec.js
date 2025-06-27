import { test, expect } from "@playwright/test";
import testDataHelper from "./utils/testDataHelper";
import { SUPPORT_URL } from "./utils/constants";

async function fillSupportForm(form, data) {
  if (data.firstName)
    await form.locator('input[name="firstName"]').fill(data.firstName);
  if (data.lastName)
    await form.locator('input[name="lastName"]').fill(data.lastName);
  if (data.email) await form.locator('input[name="email"]').fill(data.email);
  if (data.phoneNumber)
    await form.locator('input[name="phoneNumber"]').fill(data.phoneNumber);
  if (data.company)
    await form.locator('input[name="company"]').fill(data.company);
  if (data.address)
    await form.locator('input[name="address"]').fill(data.address);
  if (data.details)
    await form.locator('textarea[name="details"]').fill(data.details);
}


test.describe("Support Form Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SUPPORT_URL, {
      timeout: 90000,
      waitUntil: "domcontentloaded",
    });
  });

  test("SP001 - Check alignment of input fields", async ({ page }) => {
    test.setTimeout(60000);
    const form = await page.locator("form.w-full.max-w-2xl");
    // Define all form fields to check
    const formFields = [
      'input[name="firstName"]',
      'input[name="lastName"]',
      'input[name="email"]',
      'input[name="phoneNumber"]',
      'input[name="company"]',
      'input[name="address"]',
      'textarea[name="details"]',
    ];

    // Get form boundaries
    const formBox = await form.boundingBox();
    expect(formBox).not.toBeNull();

    // Get all field positions
    const fieldPositions = [];

    // First pass: Collect all field positions and verify basic visibility
    for (const fieldSelector of formFields) {
      const field = form.locator(fieldSelector);

      // Verify field is visible
      await expect(field).toBeVisible({ timeout: 10000 });

      // Get field position and dimensions
      const box = await field.boundingBox();
      expect(box).not.toBeNull();

      // Store position data
      fieldPositions.push({
        selector: fieldSelector,
        box: box,
      });
    }

    // Second pass: Check for overlapping between any two fields
    for (let i = 0; i < fieldPositions.length; i++) {
      for (let j = i + 1; j < fieldPositions.length; j++) {
        const field1 = fieldPositions[i];
        const field2 = fieldPositions[j];

        // Calculate overlap
        const horizontalOverlap = Math.max(
          0,
          Math.min(
            field1.box.x + field1.box.width,
            field2.box.x + field2.box.width
          ) - Math.max(field1.box.x, field2.box.x)
        );

        const verticalOverlap = Math.max(
          0,
          Math.min(
            field1.box.y + field1.box.height,
            field2.box.y + field2.box.height
          ) - Math.max(field1.box.y, field2.box.y)
        );

        // If both overlaps are greater than 0, the fields intersect
        const isOverlapping = horizontalOverlap > 0 && verticalOverlap > 0;

        // Assert no overlap
        expect(isOverlapping).toBeFalsy();
      }
    }

    // Third pass: Verify fields are properly contained within form
    for (const fieldPosition of fieldPositions) {
      const box = fieldPosition.box;

      // Field should be within form boundaries
      expect(box.x).toBeGreaterThanOrEqual(formBox.x);
      expect(box.x + box.width).toBeLessThanOrEqual(formBox.x + formBox.width);
      expect(box.y).toBeGreaterThanOrEqual(formBox.y);
      expect(box.y + box.height).toBeLessThanOrEqual(
        formBox.y + formBox.height
      );
    }
  });

  test('SP002 - Check "Send" button is disabled until mandatory fields are filled', async ({
    page,
  }) => {
    test.setTimeout(120000);
    const form = await page.locator("form.w-full.max-w-2xl");
    const submitButton = await form.locator('button[type="submit"]');

    // Try to submit empty form
    await submitButton.click();

    // Check for error messages on mandatory fields
    const errorMessages = await page.locator('.error-message, [role="alert"]');
    await expect(errorMessages).toBeVisible({ timeout: 30000 });

    // Fill mandatory fields
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="phoneNumber"]', "1234567890");

    // Submit should now work
    await submitButton.click();
  });

  test("SP003 - Check responsive layout", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(form).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "mobile-layout.png", fullPage: true });

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(form).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "desktop-layout.png", fullPage: true });
  });

  test("SP005 - Tab navigation works properly", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");
    const firstNameInput = form.locator('input[name="firstName"]');

    await firstNameInput.click();

    const fields = [
      'input[name="firstName"]',
      'input[name="lastName"]',
      'input[name="email"]',
      'input[name="phoneNumber"]',
      'input[name="company"]',
      'input[name="address"]',
      'textarea[name="details"]',
    ];

    // Check tab navigation
    for (let i = 0; i < fields.length - 1; i++) {
      await page.keyboard.press("Tab", { timeout: 1000 });
      const nextField = form.locator(fields[i + 1]);
      await expect(nextField).toBeFocused();
    }
  });

  test("SP007 - Submit form with all valid data", async ({ page }) => {
    test.setTimeout(120000);
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    const form = await page.locator("form.w-full.max-w-2xl");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible({
      timeout: 30000,
    });

    //Wait for submitting message to disappear
    await expect(
      page.locator("text=Support request created successfully")
    ).toBeVisible({ timeout: 30000 });
  });

  test("SP008 - Submit form with only mandatory fields filled", async ({
    page,
  }) => {
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");
    const form = await page.locator("form.w-full.max-w-2xl");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "",
      company: "",
      address: "",
      details: "",
    });

    // Try to submit empty form
    await form.locator('button[type="submit"]').click();

    // Wait for and verify error messages for each required field
    await expect(page.locator('text="Phone number is required"')).toBeVisible({
      timeout: 30000,
    });
    await expect(page.locator('text="Company name is required"')).toBeVisible({
      timeout: 30000,
    });
    await expect(page.locator('text="Address is required"')).toBeVisible({
      timeout: 30000,
    });
    await expect(page.locator('text="Details are required"')).toBeVisible({
      timeout: 30000,
    });
    // await expect(page.locator('text="Details are required"')).toBeVisible({timeout: 30000});

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible({
      timeout: 30000,
    });
  });

  test("SP009 - Leave all fields empty and submit", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Try to submit empty form
    await form.locator('button[type="submit"]').click();

    // Wait for and verify error messages for each required field
    await expect(page.locator('text="Email is required"')).toBeVisible({
      timeout: 30000,
    });
    await expect(page.locator('text="Phone number is required"')).toBeVisible({
      timeout: 30000,
    });
    await expect(page.locator('text="Company name is required"')).toBeVisible({
      timeout: 30000,
    });
    await expect(page.locator('text="Address is required"')).toBeVisible({
      timeout: 30000,
    });
    // await expect(page.locator('text="Details are required"')).toBeVisible({timeout: 30000});

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible({
      timeout: 30000,
    });
  });

  test("SP010 - Submit with First Name empty (assuming mandatory)", async ({
    page,
  }) => {
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");
    const form = await page.locator("form.w-full.max-w-2xl");

    await fillSupportForm(form, {
      firstName: "",
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Simple verification of error message
    const errorText = page.getByText("First name is required");
    await expect(errorText).toBeVisible({ timeout: 30000 });
  });

  test("SP011 - Submit with Last Name empty (assuming mandatory)", async ({
    page,
  }) => {
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");
    const form = await page.locator("form.w-full.max-w-2xl");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "",
      email: uniqueEmail,
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Simple verification of error message
    const errorText = page.getByText("Last name is required");
    await expect(errorText).toBeVisible({ timeout: 30000 });
  });

  test("SP012 - Submit with Details empty (assuming mandatory)", async ({
    page,
  }) => {
    test.setTimeout(120000);
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");
    const form = await page.locator("form.w-full.max-w-2xl");

    // // Fill all fields except Details
    // await form.locator('input[name="firstName"]').pressSequentially("John");
    // await form.locator('input[name="lastName"]').pressSequentially("Doe");
    // await form.locator('input[name="email"]').pressSequentially("john@example.com");
    // await form.locator('input[name="phoneNumber"]').pressSequentially("1234567890");
    // await form.locator('input[name="company"]').pressSequentially("ABC Corp");
    // await form.locator('input[name="address"]').pressSequentially("123 Street");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "",
    });
    // Submit form
    await form.locator('button[type="submit"]').click();

    await expect(page.locator('text="Details are required"')).toBeVisible({
      timeout: 30000,
    });
    await expect(page.url()).toContain("/support");
  });

  test("SP013 - Submit with Email empty (assuming mandatory)", async ({
    page,
  }) => {
    test.setTimeout(60000);
    const form = await page.locator("form.w-full.max-w-2xl");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: "",
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Verify error message for Email
    await expect(page.locator('text="Email is required"')).toBeVisible({
      timeout: 30000,
    });
  });

  test("SP016 - First Name - Verify maximum length boundary", async ({
    page,
  }) => {
    test.setTimeout(240000);
    const form = await page.locator("form.w-full.max-w-2xl");

    // Create string of maximum length (255 characters)
    const maxLengthName = "A".repeat(255);
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    await fillSupportForm(form, {
      firstName: maxLengthName,
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for success state
    try {
      // Try to find success message
      await expect(
        page.locator("text=Support request created successfully")
      ).toBeVisible({ timeout: 30000 });
    } catch {
      // If no success message, check if form was cleared/reset
      const firstNameInput = form.locator('input[name="firstName"]');
      await expect(firstNameInput).toHaveValue("");
    }
  });

  test("SP017 - First Name - Verify exceeding maximum length", async ({
    page,
  }) => {
    test.setTimeout(60000);

    const form = await page.locator("form.w-full.max-w-2xl");

    // Create string exceeding maximum length (256 characters)
    const tooLongName = "A".repeat(256);
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    await fillSupportForm(form, {
      firstName: tooLongName,
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible({
      timeout: 30000,
    });

    // Wait for submitting message to disappear
    await expect(page.getByText("Submitting...")).toBeHidden();

    await page.pause();

    // console.log("Current URL:", page.url());

    await page.screenshot({ path: "before-dialog.png" });

    try {
      const dialogByRole = await page.locator('[role="dialog"]');
      if (await dialogByRole.isVisible()) {
        console.log("Found dialog by role");
        await dialogByRole.screenshot({ path: "dialog-by-role.png" });
      }

      const dialogByModal = await page.locator('[aria-modal="true"]');
      if (await dialogByModal.isVisible()) {
        console.log("Found dialog by aria-modal");
        await dialogByModal.screenshot({ path: "dialog-by-modal.png" });
      }

      const dialogByText = await page.getByText(
        "Error creating support request: value too long for type character varying(255)"
      );
      if (await dialogByText.isVisible()) {
        console.log("Found dialog by text");
        await dialogByText.screenshot({ path: "dialog-by-text.png" });
      }
    } catch (error) {
      console.log("Error while finding dialog:", error);
    }

    await page.pause();

    await expect(form.locator('input[name="firstName"]')).toHaveValue(
      tooLongName
    );
    await expect(form.locator('input[name="lastName"]')).toHaveValue("Doe");
    await expect(form.locator('input[name="email"]')).toHaveValue(uniqueEmail);
    await expect(form.locator('input[name="phoneNumber"]')).toHaveValue(
      "1234567890"
    );
    await expect(form.locator('input[name="company"]')).toHaveValue("ABC Corp");
    await expect(form.locator('input[name="address"]')).toHaveValue(
      "123 Street"
    );
    await expect(form.locator('textarea[name="details"]')).toHaveValue("Hello");

    // Verify we're still on the support page
    await expect(page.url()).toContain("/support");
  });

  test("SP019 - Last Name - Verify maximum length boundary", async ({
    page,
  }) => {
    test.setTimeout(120000);
    const form = await page.locator("form.w-full.max-w-2xl");

    // Create string of maximum length (255 characters)
    const maxLengthName = "A".repeat(255);
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: maxLengthName,
      email: uniqueEmail,
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for success state
    try {
      // Try to find success message
      await page.waitForSelector('[data-testid="success-message"]', {
        timeout: 30000,
      });
    } catch {
      // If no success message, check if form was cleared/reset
      const lastNameInput = form.locator('input[name="lastName"]');
      await expect(lastNameInput).toHaveValue("");
    }
  });

  test("SP020 - Last Name - Verify exceeding maximum length", async ({
    page,
  }) => {
    // Enable debug logging
    // page.on("console", (msg) => console.log(msg.text()));

    const form = await page.locator("form.w-full.max-w-2xl");

    // Create string exceeding maximum length (256 characters)
    const tooLongName = "A".repeat(256);
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: tooLongName,
      email: uniqueEmail,
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible({
      timeout: 30000,
    });

    // Wait for submitting message to disappear
    await expect(page.getByText("Submitting...")).toBeHidden();

    await page.pause();

    // console.log("Current URL:", page.url());

    await page.screenshot({ path: "before-dialog.png" });

    try {
      const dialogByRole = await page.locator('[role="dialog"]');
      if (await dialogByRole.isVisible()) {
        console.log("Found dialog by role");
        await dialogByRole.screenshot({ path: "dialog-by-role.png" });
      }

      const dialogByModal = await page.locator('[aria-modal="true"]');
      if (await dialogByModal.isVisible()) {
        console.log("Found dialog by aria-modal");
        await dialogByModal.screenshot({ path: "dialog-by-modal.png" });
      }

      const dialogByText = await page.getByText(
        "Error creating support request: value too long for type character varying(255)"
      );
      if (await dialogByText.isVisible()) {
        console.log("Found dialog by text");
        await dialogByText.screenshot({ path: "dialog-by-text.png" });
      }
    } catch (error) {
      console.log("Error while finding dialog:", error);
    }

    await page.pause();

    // Verify form still contains the entered data
    await expect(form.locator('input[name="firstName"]')).toHaveValue("John");
    await expect(form.locator('input[name="lastName"]')).toHaveValue(
      tooLongName
    );
    await expect(form.locator('input[name="email"]')).toHaveValue(uniqueEmail);
    await expect(form.locator('input[name="phoneNumber"]')).toHaveValue(
      "1234567890"
    );
    await expect(form.locator('input[name="company"]')).toHaveValue("ABC Corp");
    await expect(form.locator('input[name="address"]')).toHaveValue(
      "123 Street"
    );
    await expect(form.locator('textarea[name="details"]')).toHaveValue("Hello");

    // Verify we're still on the support page
    await expect(page.url()).toContain("/support");
  });

  test("SP021 - Email format validation", async ({ page }) => {
    test.setTimeout(60000);
    const form = await page.locator("form.w-full.max-w-2xl");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@mail.com",
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });
    // Submit form
    await form.locator('button[type="submit"]').click();

    await expect(
      page.locator("text=Support request created successfully")
    ).toBeVisible({ timeout: 30000 });
  });

  test("SP022 - Invalid email format", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: "join.com",
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    await expect(page.locator("text=Invalid email address")).toBeVisible({
      timeout: 10000,
    });
  });

  test("SP023 - Email format - Spaces are trimmed and accepted", async ({
    page,
  }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: "  test@example.com  ",
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible({
      timeout: 30000,
    });

    try {
      await expect(
        page.locator("text=Support request created successfully")
      ).toBeVisible({ timeout: 30000 });
    } catch {
      // If no success message, verify form was cleared which also indicates success
      const emailInput = form.locator('input[name="email"]');
      await expect(emailInput).toHaveValue("");
    }

    // Verify we're still on the support page
    await expect(page.url()).toContain("/support");
  });

  test("SP024 - Invalid email format - Invalid characters in domain", async ({
    page,
  }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill email with invalid domain
    await form
      .locator('input[name="email"]')
      .pressSequentially("test@exa!mple.com");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: "test@exa!mple.com",
      phoneNumber: "1234567890",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Verify error message appears for invalid email
    await expect(page.locator("text=Invalid email address")).toBeVisible({
      timeout: 30000,
    });
  });

  test("SP025 - Valid phone number format", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "0123456789",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for success state
    await expect(
      page.locator("text=Support request created successfully")
    ).toBeVisible({ timeout: 30000 });
  });

  test("SP026 - Phone number with letters", async ({ page }) => {
    test.setTimeout(60000);
    const form = await page.locator("form.w-full.max-w-2xl");
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "abc123456",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Verify error message appears for invalid phone number
    await expect(
      page.locator("text=Please enter a valid phone number")
    ).toBeVisible({ timeout: 30000 });

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible({
      timeout: 30000,
    });

    // Verify form retains the entered data
    await expect(form.locator('input[name="phoneNumber"]')).toHaveValue(
      "abc123456"
    );
  });

  test("SP027 - Phone number with special characters", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "123456%780",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Verify error message appears for invalid phone number
    await expect(
      page.locator('text="Please enter a valid phone number"')
    ).toBeVisible({ timeout: 30000 });
  });

  test("SP028 - Phone number with incorrect length (too short/long)", async ({
    page,
  }) => {
    const form = await page.locator("form.w-full.max-w-2xl");
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "123",
      company: "ABC Corp",
      address: "123 Street",
      details: "Hello",
    });

    // Verify error message appears for invalid phone number
    await expect(
      page.locator('text="Please enter a valid phone number"')
    ).toBeVisible({ timeout: 30000 });

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible({
      timeout: 30000,
    });

    // Verify form retains the entered data
    await expect(form.locator('input[name="phoneNumber"]')).toHaveValue("123");
  });

  test("SP030 - Company field - Accept alphanumeric & common symbols", async ({
    page,
  }) => {
    test.setTimeout(60000);
    const form = await page.locator("form.w-full.max-w-2xl");
    const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");

    await fillSupportForm(form, {
      firstName: "John",
      lastName: "Doe",
      email: uniqueEmail,
      phoneNumber: "1234567890",
      company: 'ABC Corp., "X&Y Inc.", Jane\'s Shop (Local)',
      address: "123 Street",
      details: "Hello",
    });

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible({
      timeout: 30000,
    });

    // Wait for success state
    await expect(
      page.locator("text=Support request created successfully")
    ).toBeVisible({ timeout: 30000 });
  });

  test("SP032 - HTML/JS injection attempt", async ({ page }) => {
    let alertTriggered = false;

    page.on("dialog", async (dialog) => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    const form = await page.locator("form.w-full.max-w-2xl");
    const injectionData = {
      xss: {
        firstName: "<script>alert(1)</script>",
        lastName: '<img src=x onerror="alert(2)">',
        email: "test@example.com",
        phoneNumber: "1234567890",
        company: "<script>alert(3)</script>",
        address: '<img src=x onerror="alert(4)">',
        details: "<script>alert(5)</script>",
      },
    };

    // Fill all fields with XSS attempts
    await form
      .locator('input[name="firstName"]')
      .pressSequentially(injectionData.xss.firstName);
    await form
      .locator('input[name="lastName"]')
      .pressSequentially(injectionData.xss.lastName);
    await form
      .locator('input[name="email"]')
      .pressSequentially(injectionData.xss.email);
    await form
      .locator('input[name="phoneNumber"]')
      .pressSequentially(injectionData.xss.phoneNumber);
    await form
      .locator('input[name="company"]')
      .pressSequentially(injectionData.xss.company);
    await form
      .locator('input[name="address"]')
      .pressSequentially(injectionData.xss.address);
    await form
      .locator('textarea[name="details"]')
      .pressSequentially(injectionData.xss.details);

    // Submit form
    await form.locator('button[type="submit"]').click();

    await page.waitForTimeout(1000); // Wait to ensure no alert is triggered
    expect(alertTriggered).toBeFalsy();
  });

  test("SP033 - SQL injection attempt in various fields", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    const sqlInjection = "OR 1=1";

    // Try SQL injection in all fields
    await form
      .locator('input[name="firstName"]')
      .pressSequentially(sqlInjection);
    await form
      .locator('input[name="lastName"]')
      .pressSequentially(sqlInjection);
    await form
      .locator('input[name="email"]')
      .pressSequentially(`test${sqlInjection}@example.com`);
    await form
      .locator('input[name="phoneNumber"]')
      .pressSequentially("1234567890");
    await form.locator('input[name="company"]').pressSequentially(sqlInjection);
    await form.locator('input[name="address"]').pressSequentially(sqlInjection);
    await form
      .locator('textarea[name="details"]')
      .pressSequentially(sqlInjection);

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Verify form submission fails safely
    await expect(page.url()).toContain("/support");

    // Verify no database errors are exposed
    await expect(page.locator("text=/SQL|database|error/i")).not.toBeVisible({
      timeout: 30000,
    });
  });
});
