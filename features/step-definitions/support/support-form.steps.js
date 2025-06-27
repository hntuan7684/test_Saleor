const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { SUPPORT_URL } = require('../../../tests/utils/constants');
const testDataHelper = require('../../../tests/utils/testDataHelper');

let browser, page;

Before(async function() {
  const { chromium } = require('playwright');
  browser = await chromium.launch({ 
    headless: false,
    slowMo: 500,
    args: ['--start-maximized']
  });
  page = await browser.newPage();
  this.page = page;
});

After(async function() {
  if (browser) {
    await browser.close();
  }
});

Given('I am on the support form page', async function() {
  await this.page.goto(SUPPORT_URL, {
    timeout: 30000,
    waitUntil: "domcontentloaded",
  });
});

When('I fill the form with complete valid data', { timeout: 60000 }, async function() {
  const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");
  const form = await this.page.locator("form.w-full.max-w-2xl");
  
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(uniqueEmail);
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I submit the form', async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('button[type="submit"]').click();
});

Then('I should see {string} message', { timeout: 60000 }, async function(message) {
  // Chờ message lỗi xuất hiện
  try {
    await expect(this.page.locator(`text=${message}`)).toBeVisible({ timeout: 30000 });
  } catch (error) {
    // Chụp screenshot khi fail để debug
    await this.page.screenshot({ path: `results/screenshots/error-${Date.now()}.png` });
    console.error(`Không tìm thấy message lỗi: ${message}`);
    throw error;
  }
});

// Layout and alignment steps
Then('all input fields should be visible and properly aligned', async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  const formFields = [
    'input[name="firstName"]',
    'input[name="lastName"]',
    'input[name="email"]',
    'input[name="phoneNumber"]',
    'input[name="company"]',
    'input[name="address"]',
    'textarea[name="details"]',
  ];

  for (const fieldSelector of formFields) {
    const field = form.locator(fieldSelector);
    await expect(field).toBeVisible({ timeout: 10000 });
  }
});

// Then('tất cả các trường nhập liệu phải hiển thị và được căn chỉnh đúng', async function() {
//   const form = await this.page.locator("form.w-full.max-w-2xl");
//   const formFields = [
//     'input[name="firstName"]',
//     'input[name="lastName"]',
//     'input[name="email"]',
//     'input[name="phoneNumber"]',
//     'input[name="company"]',
//     'input[name="address"]',
//     'textarea[name="details"]',
//   ];

//   for (const fieldSelector of formFields) {
//     const field = form.locator(fieldSelector);
//     await expect(field).toBeVisible({ timeout: 10000 });
//   }
// });

Then('no input fields should overlap each other', async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  const formFields = [
    'input[name="firstName"]',
    'input[name="lastName"]',
    'input[name="email"]',
    'input[name="phoneNumber"]',
    'input[name="company"]',
    'input[name="address"]',
    'textarea[name="details"]',
  ];

  const fieldPositions = [];
  for (const fieldSelector of formFields) {
    const field = form.locator(fieldSelector);
    const box = await field.boundingBox();
    fieldPositions.push({ selector: fieldSelector, box: box });
  }

  for (let i = 0; i < fieldPositions.length; i++) {
    for (let j = i + 1; j < fieldPositions.length; j++) {
      const field1 = fieldPositions[i];
      const field2 = fieldPositions[j];

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

      const isOverlapping = horizontalOverlap > 0 && verticalOverlap > 0;
      expect(isOverlapping).toBeFalsy();
    }
  }
});

// Then('không có trường nhập liệu nào bị chồng lên nhau', async function() {
//   const form = await this.page.locator("form.w-full.max-w-2xl");
//   const formFields = [
//     'input[name="firstName"]',
//     'input[name="lastName"]',
//     'input[name="email"]',
//     'input[name="phoneNumber"]',
//     'input[name="company"]',
//     'input[name="address"]',
//     'textarea[name="details"]',
//   ];

//   const fieldPositions = [];
//   for (const fieldSelector of formFields) {
//     const field = form.locator(fieldSelector);
//     const box = await field.boundingBox();
//     fieldPositions.push({ selector: fieldSelector, box: box });
//   }

//   for (let i = 0; i < fieldPositions.length; i++) {
//     for (let j = i + 1; j < fieldPositions.length; j++) {
//       const field1 = fieldPositions[i];
//       const field2 = fieldPositions[j];

//       const horizontalOverlap = Math.max(
//         0,
//         Math.min(
//           field1.box.x + field1.box.width,
//           field2.box.x + field2.box.width
//         ) - Math.max(field1.box.x, field2.box.x)
//       );

//       const verticalOverlap = Math.max(
//         0,
//         Math.min(
//           field1.box.y + field1.box.height,
//           field2.box.y + field2.box.height
//         ) - Math.max(field1.box.y, field2.box.y)
//       );

//       const isOverlapping = horizontalOverlap > 0 && verticalOverlap > 0;
//       expect(isOverlapping).toBeFalsy();
//     }
//   }
// });

Then('all fields should be contained within the form boundaries', async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  const formBox = await form.boundingBox();
  const formFields = [
    'input[name="firstName"]',
    'input[name="lastName"]',
    'input[name="email"]',
    'input[name="phoneNumber"]',
    'input[name="company"]',
    'input[name="address"]',
    'textarea[name="details"]',
  ];

  for (const fieldSelector of formFields) {
    const field = form.locator(fieldSelector);
    const box = await field.boundingBox();
    
    expect(box.x).toBeGreaterThanOrEqual(formBox.x);
    expect(box.x + box.width).toBeLessThanOrEqual(formBox.x + formBox.width);
    expect(box.y).toBeGreaterThanOrEqual(formBox.y);
    expect(box.y + box.height).toBeLessThanOrEqual(formBox.y + formBox.height);
  }
});

// Then('tất cả các trường phải nằm trong phạm vi của biểu mẫu', async function() {
//   const form = await this.page.locator("form.w-full.max-w-2xl");
//   const formBox = await form.boundingBox();
//   const formFields = [
//     'input[name="firstName"]',
//     'input[name="lastName"]',
//     'input[name="email"]',
//     'input[name="phoneNumber"]',
//     'input[name="company"]',
//     'input[name="address"]',
//     'textarea[name="details"]',
//   ];

//   for (const fieldSelector of formFields) {
//     const field = form.locator(fieldSelector);
//     const box = await field.boundingBox();
    
//     expect(box.x).toBeGreaterThanOrEqual(formBox.x);
//     expect(box.x + box.width).toBeLessThanOrEqual(formBox.x + formBox.width);
//     expect(box.y).toBeGreaterThanOrEqual(formBox.y);
//     expect(box.y + box.height).toBeLessThanOrEqual(formBox.y + formBox.height);
//   }
// });

// Validation and mandatory field steps
When('I try to submit the form without filling mandatory fields', async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('button[type="submit"]').click();
});

Then('I should see error messages for mandatory fields', async function() {
  const errorMessages = await this.page.locator('.error-message, [role="alert"]');
  await expect(errorMessages).toBeVisible({ timeout: 30000 });
});

When('I fill all mandatory fields', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill("john@example.com");
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

Then('the form should be submitted successfully', { timeout: 60000 }, async function() {
  await expect(this.page.locator("text=Support request created successfully")).toBeVisible({ timeout: 30000 });
});

When('I fill only mandatory fields', { timeout: 60000 }, async function() {
  const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");
  const form = await this.page.locator("form.w-full.max-w-2xl");
  
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(uniqueEmail);
  await form.locator('input[name="phoneNumber"]').fill("");
  await form.locator('input[name="company"]').fill("");
  await form.locator('input[name="address"]').fill("");
  await form.locator('textarea[name="details"]').fill("");
});

Then('I should see error messages for missing required fields', async function() {
  await expect(this.page.locator('text="Phone number is required"')).toBeVisible({ timeout: 30000 });
  await expect(this.page.locator('text="Company name is required"')).toBeVisible({ timeout: 30000 });
  await expect(this.page.locator('text="Address is required"')).toBeVisible({ timeout: 30000 });
  await expect(this.page.locator('text="Details are required"')).toBeVisible({ timeout: 30000 });
});

Then('the form should not be submitted', async function() {
  await expect(this.page.url()).toContain("/support");
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await expect(form.locator('button[type="submit"]')).toBeVisible({ timeout: 30000 });
});

When('I submit the form without filling any fields', async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('button[type="submit"]').click();
});

Then('I should see error messages for all required fields', async function() {
  await expect(this.page.locator('text="Email is required"')).toBeVisible({ timeout: 30000 });
  await expect(this.page.locator('text="Phone number is required"')).toBeVisible({ timeout: 30000 });
  await expect(this.page.locator('text="Company name is required"')).toBeVisible({ timeout: 30000 });
  await expect(this.page.locator('text="Address is required"')).toBeVisible({ timeout: 30000 });
});

When('I fill all fields except first name', { timeout: 60000 }, async function() {
  const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");
  const form = await this.page.locator("form.w-full.max-w-2xl");
  
  await form.locator('input[name="firstName"]').fill("");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(uniqueEmail);
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill all fields except last name', { timeout: 60000 }, async function() {
  const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");
  const form = await this.page.locator("form.w-full.max-w-2xl");
  
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("");
  await form.locator('input[name="email"]').fill(uniqueEmail);
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill all fields except details', { timeout: 60000 }, async function() {
  const uniqueEmail = testDataHelper.generateUniqueEmail("mailinator.com");
  const form = await this.page.locator("form.w-full.max-w-2xl");
  
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(uniqueEmail);
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("");
});

When('I fill all fields except email', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill("");
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

// Boundary testing steps
When('I fill first name with maximum allowed length', { timeout: 60000 }, async function() {
  const maxLengthName = "A".repeat(255);
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill(maxLengthName);
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(testDataHelper.generateUniqueEmail("mailinator.com"));
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill first name exceeding maximum allowed length', { timeout: 60000 }, async function() {
  const tooLongName = "A".repeat(256);
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill(tooLongName);
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(testDataHelper.generateUniqueEmail("mailinator.com"));
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill last name with maximum allowed length', { timeout: 60000 }, async function() {
  const maxLengthName = "A".repeat(255);
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill(maxLengthName);
  await form.locator('input[name="email"]').fill(testDataHelper.generateUniqueEmail("mailinator.com"));
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill last name exceeding maximum allowed length', { timeout: 60000 }, async function() {
  const tooLongName = "A".repeat(256);
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill(tooLongName);
  await form.locator('input[name="email"]').fill(testDataHelper.generateUniqueEmail("mailinator.com"));
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

Then('I should see an error message about field length', async function() {
  await expect(this.page.locator("text=Error creating support request: value too long for type character varying(255)")).toBeVisible({ timeout: 30000 });
});

// Email validation steps
When('I fill the form with valid email format', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill("john.doe@mail.com");
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill the form with invalid email format', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill("join.com");
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill email with leading and trailing spaces', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill("  test@example.com  ");
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill email with invalid characters in domain', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill("test@exa!mple.com");
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

// Phone validation steps
When('I fill the form with valid phone number format', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(testDataHelper.generateUniqueEmail("mailinator.com"));
  await form.locator('input[name="phoneNumber"]').fill("0123456789");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill phone number with letters', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(testDataHelper.generateUniqueEmail("mailinator.com"));
  await form.locator('input[name="phoneNumber"]').fill("abc123456");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill phone number with special characters', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(testDataHelper.generateUniqueEmail("mailinator.com"));
  await form.locator('input[name="phoneNumber"]').fill("123456%780");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

When('I fill phone number with incorrect length', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(testDataHelper.generateUniqueEmail("mailinator.com"));
  await form.locator('input[name="phoneNumber"]').fill("123");
  await form.locator('input[name="company"]').fill("ABC Corp");
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

// Company field steps
When('I fill company field with alphanumeric and common symbols', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("John");
  await form.locator('input[name="lastName"]').fill("Doe");
  await form.locator('input[name="email"]').fill(testDataHelper.generateUniqueEmail("mailinator.com"));
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill('ABC Corp., "X&Y Inc.", Jane\'s Shop (Local)');
  await form.locator('input[name="address"]').fill("123 Street");
  await form.locator('textarea[name="details"]').fill("Hello");
});

// Responsive layout steps
When('I view the form on mobile screen', async function() {
  await this.page.setViewportSize({ width: 375, height: 667 });
});

Then('the form should be properly displayed on mobile', async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await expect(form).toBeVisible({ timeout: 30000 });
  await this.page.screenshot({ path: "mobile-layout.png", fullPage: true });
});

When('I view the form on desktop screen', async function() {
  await this.page.setViewportSize({ width: 1280, height: 800 });
});

Then('the form should be properly displayed on desktop', async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await expect(form).toBeVisible({ timeout: 30000 });
  await this.page.screenshot({ path: "desktop-layout.png", fullPage: true });
});

// Tab navigation steps
When('I click on the first name field', async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').click();
});

Then('I should be able to navigate through all fields using Tab key', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  const fields = [
    'input[name="firstName"]',
    'input[name="lastName"]',
    'input[name="email"]',
    'input[name="phoneNumber"]',
    'input[name="company"]',
    'input[name="address"]',
    'textarea[name="details"]',
  ];

  for (let i = 0; i < fields.length - 1; i++) {
    await this.page.keyboard.press("Tab", { timeout: 1000 });
    const nextField = form.locator(fields[i + 1]);
    await expect(nextField).toBeFocused();
  }
});

// Security testing steps
When('I fill all fields with HTML\\/JS injection attempts', { timeout: 60000 }, async function() {
  let alertTriggered = false;
  this.page.on("dialog", async (dialog) => {
    alertTriggered = true;
    await dialog.dismiss();
  });

  const form = await this.page.locator("form.w-full.max-w-2xl");
  await form.locator('input[name="firstName"]').fill("<script>alert(1)</script>");
  await form.locator('input[name="lastName"]').fill('<img src=x onerror="alert(2)">');
  await form.locator('input[name="email"]').fill("test@example.com");
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill("<script>alert(3)</script>");
  await form.locator('input[name="address"]').fill('<img src=x onerror="alert(4)">');
  await form.locator('textarea[name="details"]').fill("<script>alert(5)</script>");
  
  this.alertTriggered = alertTriggered;
});

Then('no JavaScript alerts should be triggered', async function() {
  await this.page.waitForTimeout(1000);
  expect(this.alertTriggered).toBeFalsy();
});

Then('the form should handle injection attempts safely', async function() {
  await expect(this.page.url()).toContain("/support");
});

When('I fill all fields with SQL injection attempts', { timeout: 60000 }, async function() {
  const form = await this.page.locator("form.w-full.max-w-2xl");
  const sqlInjection = "OR 1=1";
  
  await form.locator('input[name="firstName"]').fill(sqlInjection);
  await form.locator('input[name="lastName"]').fill(sqlInjection);
  await form.locator('input[name="email"]').fill(`test${sqlInjection}@example.com`);
  await form.locator('input[name="phoneNumber"]').fill("1234567890");
  await form.locator('input[name="company"]').fill(sqlInjection);
  await form.locator('input[name="address"]').fill(sqlInjection);
  await form.locator('textarea[name="details"]').fill(sqlInjection);
});

Then('no database errors should be exposed', async function() {
  await expect(this.page.locator("text=/SQL|database|error/i")).not.toBeVisible({ timeout: 30000 });
}); 