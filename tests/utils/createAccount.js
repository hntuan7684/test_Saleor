import {getVerificationLinkFromMailinator} from "./mailHelper";
import { LOGIN_URL } from "./constants";

async function createAndVerifyAccount(page, userInfo) {
  const { firstName, lastName, email, password } = userInfo;

  // Step 1: Navigate to register page
  await page.goto(LOGIN_URL, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.click("text=Register");
  console.log("Navigated to registration page.");

  // Step 2: Fill register form
  await page.fill('input[name="firstName"]', firstName);
  await page.fill('input[name="lastName"]', lastName);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="password-confirm"]', password);

  // Submit form
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }),
    page.click('input[value="Register"]'),
  ]);
  console.log(`Registration submitted for ${email}`);

  // Step 3: Get verification link from Mailinator
  const verificationLink = await getVerificationLinkFromMailinator(page, email);
  console.log(`Got verification link: ${verificationLink}`);

  // Step 4: Access verification link
  await page.goto(verificationLink, {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  console.log(`Account verified for ${email}`);
}

export default createAndVerifyAccount;
