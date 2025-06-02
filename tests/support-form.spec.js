const { test, expect } = require("@playwright/test");
const { generateUniqueEmail } = require("./utils/testDataHelper");
import { SUPPORT_URL } from "./utils/constants";

// Helper function to verify dialog
async function verifyDialog(page, expectedMessage) {
  // Wait for dialog to be visible
  await page.waitForSelector('div[role="dialog"]', { state: "visible" });

  // Check if dialog contains expected message
  const dialogText = await page.evaluate(() => {
    const dialog = document.querySelector('div[role="dialog"]');
    return dialog ? dialog.textContent : "";
  });

  // Verify dialog content
  expect(dialogText).toContain(expectedMessage);

  // Click OK button using various possible selectors
  try {
    // Try finding button by role first
    const okButton = await page.getByRole("button", { name: /ok/i });
    if (await okButton.isVisible()) {
      await okButton.click();
      return;
    }

    // Try finding button by text content
    const buttonByText = await page.getByText(/ok/i);
    if (await buttonByText.isVisible()) {
      await buttonByText.click();
      return;
    }

    // Try finding any visible button in the dialog
    const dialogButton = await page
      .locator('div[role="dialog"] button')
      .first();
    if (await dialogButton.isVisible()) {
      await dialogButton.click();
    }
  } catch (error) {
    console.log("Could not find or click OK button:", error);
  }
}

test.describe("Support Form Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the support form page before each test
    await page.goto(SUPPORT_URL, { timeout: 120000 });
    // Wait for the main support form to be loaded
    await page.waitForSelector("form.w-full.max-w-2xl", { state: "visible" });
  });

  test("SP001 - Check alignment of input fields", async ({ page }) => {
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
      await expect(field).toBeVisible();

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
    await expect(errorMessages).toBeVisible();

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
    await expect(form).toBeVisible();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "mobile-layout.png", fullPage: true });

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(form).toBeVisible();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "desktop-layout.png", fullPage: true });
  });

  // test("SP004 - Autofocus on the first input field", async ({ page }) => {
  //   const form = await page.locator("form.w-full.max-w-2xl");
  //   const firstNameInput = form.locator('input[name="firstName"]');

  //   // Wait for form to be visible and stable
  //   await expect(form).toBeVisible();

  //   // Verify firstName field is focused by default without clicking
  //   await expect(firstNameInput).toBeFocused();

  //   // Additional check: verify other fields are not focused
  //   const otherFields = [
  //     'input[name="lastName"]',
  //     'input[name="email"]',
  //     'input[name="phoneNumber"]',
  //     'input[name="company"]',
  //     'input[name="address"]',
  //     'textarea[name="details"]',
  //   ];

  //   for (const fieldSelector of otherFields) {
  //     const field = form.locator(fieldSelector);
  //     await expect(field).not.toBeFocused();
  //   }
  // });

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
    const uniqueEmail = generateUniqueEmail("mailinator.com");

    // Enable debug logging
    page.on("console", (msg) => console.log(msg.text()));

    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill all fields with valid data
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill(uniqueEmail);
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible();

    //Wait for submitting message to disappear
    await expect(
      page.locator("text=Support request created successfully")
    ).toBeVisible({ timeout: 10000 });


    await page.pause();

    console.log("Current URL:", page.url());

    await page.screenshot({ path: "before-dialog.png" });

    const visibleElements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("*"))
        .filter((el) => {
          const style = window.getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        })
        .map((el) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          textContent: el.textContent.trim(),
        }));
    });
    console.log("Visible elements:", visibleElements);

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
        "Your support request has been submitted successfully"
      );
      if (await dialogByText.isVisible()) {
        console.log("Found dialog by text");
        await dialogByText.screenshot({ path: "dialog-by-text.png" });
      }
    } catch (error) {
      console.log("Error while finding dialog:", error);
    }

    await page.pause();

    // Verify form is cleared after successful submission
    await expect(form.locator('input[name="firstName"]')).toHaveValue("");
    await expect(form.locator('input[name="lastName"]')).toHaveValue("");
    await expect(form.locator('input[name="email"]')).toHaveValue("");
    await expect(form.locator('input[name="phoneNumber"]')).toHaveValue("");
    await expect(form.locator('input[name="company"]')).toHaveValue("");
    await expect(form.locator('input[name="address"]')).toHaveValue("");
    await expect(form.locator('textarea[name="details"]')).toHaveValue("");

    // Verify we're still on the support page
    await expect(page.url()).toContain("/support");
  });

  test("SP008 - Submit form with only mandatory fields filled", async ({
    page,
  }) => {
    const uniqueEmail = generateUniqueEmail("mailinator.com");
    const form = await page.locator("form.w-full.max-w-2xl");

    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill(uniqueEmail);

    // Try to submit empty form
    await form.locator('button[type="submit"]').click();

    // Wait for and verify error messages for each required field
    await expect(page.locator('text="Phone number is required"')).toBeVisible();
    await expect(page.locator('text="Company name is required"')).toBeVisible();
    await expect(page.locator('text="Address is required"')).toBeVisible();
    // await expect(page.locator('text="Details are required"')).toBeVisible();

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test("SP009 - Leave all fields empty and submit", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Try to submit empty form
    await form.locator('button[type="submit"]').click();

    // Wait for and verify error messages for each required field
    await expect(page.locator('text="Email is required"')).toBeVisible();
    await expect(page.locator('text="Phone number is required"')).toBeVisible();
    await expect(page.locator('text="Company name is required"')).toBeVisible();
    await expect(page.locator('text="Address is required"')).toBeVisible();
    // await expect(page.locator('text="Details are required"')).toBeVisible();

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test("SP010 - Submit with First Name empty (assuming mandatory)", async ({
    page,
  }) => {
    const uniqueEmail = generateUniqueEmail("mailinator.com");
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill all fields except First Name
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill(uniqueEmail);
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Simple verification of error message
    const errorText = page.getByText("First name is required");
    await expect(errorText).toBeVisible();
  });

  test("SP011 - Submit with Last Name empty (assuming mandatory)", async ({
    page,
  }) => {
    const uniqueEmail = generateUniqueEmail("mailinator.com");
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill all fields except Last Name
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="email"]').fill(uniqueEmail);
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Simple verification of error message
    const errorText = page.getByText("Last name is required");
    await expect(errorText).toBeVisible();
  });

  test("SP012 - Submit with Details empty (assuming mandatory)", async ({
    page,
  }) => {
    test.setTimeout(120000);
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill all fields except Details
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Verify error message for Details
    // await expect(page.locator('text="Details are required"')).toBeVisible();
    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible();

    //Wait for submitting message to disappear
    await expect(
      page.locator("text=Support request created successfully")
    ).toBeVisible({ timeout: 30000 });

    await page.pause();

    console.log("Current URL:", page.url());

    await page.screenshot({ path: "before-dialog.png" });

    const visibleElements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("*"))
        .filter((el) => {
          const style = window.getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        })
        .map((el) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          textContent: el.textContent.trim(),
        }));
    });
    console.log("Visible elements:", visibleElements);

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
        "Your support request has been submitted successfully"
      );
      if (await dialogByText.isVisible()) {
        console.log("Found dialog by text");
        await dialogByText.screenshot({ path: "dialog-by-text.png" });
      }
    } catch (error) {
      console.log("Error while finding dialog:", error);
    }

    await page.pause();

    // Verify form is cleared after successful submission
    await expect(form.locator('input[name="firstName"]')).toHaveValue("");
    await expect(form.locator('input[name="lastName"]')).toHaveValue("");
    await expect(form.locator('input[name="email"]')).toHaveValue("");
    await expect(form.locator('input[name="phoneNumber"]')).toHaveValue("");
    await expect(form.locator('input[name="company"]')).toHaveValue("");
    await expect(form.locator('input[name="address"]')).toHaveValue("");
    await expect(form.locator('textarea[name="details"]')).toHaveValue("");

    // Verify we're still on the support page
    await expect(page.url()).toContain("/support");
  });

  test("SP013 - Submit with Email empty (assuming mandatory)", async ({
    page,
  }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill all fields except Email
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Verify error message for Email
    await expect(page.locator('text="Email is required"')).toBeVisible();
  });

  // test("SP014 - First Name with numbers", async ({ page }) => {
  //   const uniqueEmail = generateUniqueEmail("mailinator.com");
  //   const form = await page.locator("form.w-full.max-w-2xl");

  //   // Fill First Name with numbers
  //   await form.locator('input[name="firstName"]').fill("John123");

  //   // Fill other required fields
  //   await form.locator('input[name="lastName"]').fill("Doe");
  //   await form.locator('input[name="email"]').fill(uniqueEmail);
  //   await form.locator('input[name="phoneNumber"]').fill("1234567890");
  //   await form.locator('input[name="company"]').fill("ABC Corp");
  //   await form.locator('input[name="address"]').fill("123 Street");
  //   await form.locator('textarea[name="details"]').fill("Hello");

  //   // Submit form
  //   await form.locator('button[type="submit"]').click();

  //   // Simple verification of error message
  //   const errorText = page.getByText("First name cannot contain numbers");
  //   await expect(errorText).toBeVisible();
  // });

  // test("SP015 - Special characters in name fields", async ({ page }) => {
  //   const form = await page.locator("form.w-full.max-w-2xl");

  //   // Fill First Name with special characters
  //   await form.locator('input[name="firstName"]').fill("@John!");

  //   // Fill other required fields
  //   await form.locator('input[name="lastName"]').fill("Doe");
  //   await form.locator('input[name="email"]').fill("john@example.com");
  //   await form.locator('input[name="phoneNumber"]').fill("1234567890");
  //   await form.locator('input[name="company"]').fill("ABC Corp");
  //   await form.locator('input[name="address"]').fill("123 Street");
  //   await form.locator('textarea[name="details"]').fill("Hello");

  //   // Submit form
  //   await form.locator('button[type="submit"]').click();

  //   // Simple verification of error message
  //   const errorText = page.getByText("First name contains invalid characters");
  //   await expect(errorText).toBeVisible();
  // });

  test("SP016 - First Name - Verify maximum length boundary", async ({
    page,
  }) => {
    test.setTimeout(240000);
    const form = await page.locator("form.w-full.max-w-2xl");

    // Create string of maximum length (255 characters)
    const maxLengthName = "A".repeat(255);

    // Fill all required fields
    await form.locator('input[name="firstName"]').fill(maxLengthName);
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for success state
    try {
      // Try to find success message
      await page.waitForSelector('[data-testid="success-message"]', {
        timeout: 20000,
      });
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
    // Enable debug logging
    page.on("console", (msg) => console.log(msg.text()));

    const form = await page.locator("form.w-full.max-w-2xl");

    // Create string exceeding maximum length (256 characters)
    const tooLongName = "A".repeat(256);

    // Fill all required fields
    await form.locator('input[name="firstName"]').fill(tooLongName);
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible();

    // Wait for submitting message to disappear
    await expect(page.getByText("Submitting...")).toBeHidden();

    await page.pause();

    console.log("Current URL:", page.url());

    await page.screenshot({ path: "before-dialog.png" });

    const visibleElements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("*"))
        .filter((el) => {
          const style = window.getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        })
        .map((el) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          textContent: el.textContent.trim(),
        }));
    });
    console.log("Visible elements:", visibleElements);

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
    await expect(form.locator('input[name="email"]')).toHaveValue(
      "john@example.com"
    );
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

  // test("SP018 - Last Name with numbers", async ({ page }) => {
  //   const form = await page.locator("form.w-full.max-w-2xl");

  //   // Fill all required fields with Last Name containing numbers
  //   await form.locator('input[name="firstName"]').fill("John");
  //   await form.locator('input[name="lastName"]').fill("Doe456");
  //   await form.locator('input[name="email"]').fill("john@example.com");
  //   await form.locator('input[name="phoneNumber"]').fill("1234567890");
  //   await form.locator('input[name="company"]').fill("ABC Corp");
  //   await form.locator('input[name="address"]').fill("123 Street");
  //   await form.locator('textarea[name="details"]').fill("Hello");

  //   // Submit form
  //   await form.locator('button[type="submit"]').click();

  //   // Wait for submitting state
  //   await expect(page.getByText("Submitting...")).toBeVisible();

  //   // Verify error dialog
  //   await verifyDialog(page, "Last Name cannot contain numbers");

  //   // Verify form retains the entered data
  //   await expect(form.locator('input[name="lastName"]')).toHaveValue("Doe456");
  // });

  test("SP019 - Last Name - Verify maximum length boundary", async ({
    page,
  }) => {
    test.setTimeout(120000);
    const form = await page.locator("form.w-full.max-w-2xl");

    // Create string of maximum length (255 characters)
    const maxLengthName = "A".repeat(255);

    // Fill all required fields
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill(maxLengthName);
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

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
    page.on("console", (msg) => console.log(msg.text()));

    const form = await page.locator("form.w-full.max-w-2xl");

    // Create string exceeding maximum length (256 characters)
    const tooLongName = "A".repeat(256);

    // Fill all required fields
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill(tooLongName);
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible();

    // Wait for submitting message to disappear
    await expect(page.getByText("Submitting...")).toBeHidden();

    await page.pause();

    console.log("Current URL:", page.url());

    await page.screenshot({ path: "before-dialog.png" });

    const visibleElements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("*"))
        .filter((el) => {
          const style = window.getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        })
        .map((el) => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          textContent: el.textContent.trim(),
        }));
    });
    console.log("Visible elements:", visibleElements);

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
    await expect(form.locator('input[name="email"]')).toHaveValue(
      "john@example.com"
    );
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

    // Fill all required fields with invalid email format
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john.doe@mail.com");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Verify form retains the entered data
    await expect(form.locator('input[name="email"]')).toHaveValue("", {
      timeout: 30000,
    });
  });

  test("SP022 - Invalid email format", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill all required fields with email containing spaces
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john.com");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    // await expect(page.getByText("Submitting...")).toBeVisible();

    // Verify error dialog
    // await verifyDialog(page, "Invalid email address");
    await expect(page.locator("text=Invalid email address")).toBeVisible({
      timeout: 10000,
    });

    // Verify form retains the entered data but might trim spaces
    await expect(form.locator('input[name="email"]')).toHaveValue("john.com");
  });

  test("SP023 - Email format - Spaces are trimmed and accepted", async ({
    page,
  }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill email with spaces that should be trimmed
    await form.locator('input[name="email"]').fill("  test@example.com  ");

    // Fill other required fields
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for submitting state
    await expect(page.getByText("Submitting...")).toBeVisible();

    // Wait for submitting message to disappear
    // await expect(page.getByText("Submitting...")).toBeHidden();

    // Verify form submission was successful
    try {
      await page.waitForSelector('[data-testid="success-message"]', {
        timeout: 10000,
      });
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
    await form.locator('input[name="email"]').fill("test@exa!mple.com");

    // Fill other required fields
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Verify error message appears for invalid email
    await expect(page.locator("text=Invalid email address")).toBeVisible();

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible();

    // Verify form retains the entered data
    await expect(form.locator('input[name="email"]')).toHaveValue(
      "test@exa!mple.com"
    );
  });

  test("SP025 - Valid phone number format", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill form with valid phone number
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="phoneNumber"]').fill("0123456789");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for success state
    try {
      await page.waitForSelector('[data-testid="success-message"]', {
        timeout: 10000,
      });
    } catch {
      const phoneInput = form.locator('input[name="phoneNumber"]');
      await expect(phoneInput).toHaveValue("");
    }
  });

  test("SP026 - Phone number with letters", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill phone number with letters
    await form.locator('input[name="phoneNumber"]').fill("abc123456");

    // Fill other required fields
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Verify error message appears for invalid phone number
    await expect(
      page.locator("text=Please enter a valid 10-digit phone number")
    ).toBeVisible();

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible();

    // Verify form retains the entered data
    await expect(form.locator('input[name="phoneNumber"]')).toHaveValue(
      "abc123456"
    );
  });

  test("SP027 - Phone number with special characters", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill phone number with special characters
    await form.locator('input[name="phoneNumber"]').fill("123456%780");

    // Fill other required fields
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Verify error message appears for invalid phone number
    await expect(
      page.locator('text="Please enter a valid 10-digit phone number"')
    ).toBeVisible();

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible();

    // Verify form retains the entered data
    await expect(form.locator('input[name="phoneNumber"]')).toHaveValue(
      "123456%780"
    );
  });

  test("SP028 - Phone number with incorrect length (too short/long)", async ({
    page,
  }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill phone number with invalid length
    await form.locator('input[name="phoneNumber"]').fill("123");

    // Fill other required fields
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="company"]').fill("ABC Corp");
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Verify error message appears for invalid phone number
    await expect(
      page.locator('text="Please enter a valid 10-digit phone number"')
    ).toBeVisible();

    // Verify that the form was not submitted
    await expect(page.url()).toContain("/support");

    // Verify that the submit button is still present
    await expect(form.locator('button[type="submit"]')).toBeVisible();

    // Verify form retains the entered data
    await expect(form.locator('input[name="phoneNumber"]')).toHaveValue("123");
  });

  test("SP030 - Company field - Accept alphanumeric & common symbols", async ({
    page,
  }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    // Fill company with various valid characters
    await form.locator('input[name="firstName"]').fill("John");
    await form.locator('input[name="lastName"]').fill("Doe");
    await form.locator('input[name="email"]').fill("john@example.com");
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form
      .locator('input[name="company"]')
      .fill('ABC Corp., "X&Y Inc.", Jane\'s Shop (Local)');
    await form.locator('input[name="address"]').fill("123 Street");
    await form.locator('textarea[name="details"]').fill("Hello");

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Wait for success state
    try {
      await page.waitForSelector('[data-testid="success-message"]', {
        timeout: 10000,
      });
    } catch {
      const companyInput = form.locator('input[name="company"]');
      await expect(companyInput).toHaveValue("");
    }
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
      .fill(injectionData.xss.firstName);
    await form
      .locator('input[name="lastName"]')
      .fill(injectionData.xss.lastName);
    await form.locator('input[name="email"]').fill(injectionData.xss.email);
    await form
      .locator('input[name="phoneNumber"]')
      .fill(injectionData.xss.phoneNumber);
    await form.locator('input[name="company"]').fill(injectionData.xss.company);
    await form.locator('input[name="address"]').fill(injectionData.xss.address);
    await form
      .locator('textarea[name="details"]')
      .fill(injectionData.xss.details);

    // Submit form
    await form.locator('button[type="submit"]').click();

    await page.waitForTimeout(1000); // Wait to ensure no alert is triggered
    expect(alertTriggered).toBeFalsy();
  });

  test("SP033 - SQL injection attempt in various fields", async ({ page }) => {
    const form = await page.locator("form.w-full.max-w-2xl");

    const sqlInjection = "OR 1=1";

    // Try SQL injection in all fields
    await form.locator('input[name="firstName"]').fill(sqlInjection);
    await form.locator('input[name="lastName"]').fill(sqlInjection);
    await form
      .locator('input[name="email"]')
      .fill(`test${sqlInjection}@example.com`);
    await form.locator('input[name="phoneNumber"]').fill("1234567890");
    await form.locator('input[name="company"]').fill(sqlInjection);
    await form.locator('input[name="address"]').fill(sqlInjection);
    await form.locator('textarea[name="details"]').fill(sqlInjection);

    // Submit form
    await form.locator('button[type="submit"]').click();

    // Verify form submission fails safely
    await expect(page.url()).toContain("/support");

    // Verify no database errors are exposed
    await expect(page.locator("text=/SQL|database|error/i")).not.toBeVisible();
  });
});
