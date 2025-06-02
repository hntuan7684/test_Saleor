// utils/mailHelper.js
const { MAILINATOR_BASE_URL } = require("./constants");

async function getVerificationLinkFromMailinator(page, emailAddress) {
  const inboxName = emailAddress.split("@")[0];
  await page.goto(`${MAILINATOR_BASE_URL}?to=${inboxName}`, {
    waitUntil: "networkidle",
    timeout: 120000,
  });

  console.log(`Navigated to Mailinator inbox for: ${inboxName}`);

  const firstEmailSubjectCellSelector =
    '//table[contains(@class, "table")]//tbody//tr[1]/td[3]';
  try {
    await page.waitForSelector(firstEmailSubjectCellSelector, {
      timeout: 120000,
    });
    console.log("Email list loaded in Mailinator.");
  } catch (e) {
    console.error(
      "Timeout waiting for email list in Mailinator. Saving screenshot."
    );
    await page.screenshot({
      path: `mailinator_inbox_timeout_${inboxName}.png`,
      fullPage: true,
    });
    throw new Error(
      `Timeout waiting for email list in Mailinator for ${inboxName}.`
    );
  }

  const emailSubjectKeywords = ["Account confirmation e-mail"]; // Ensure this matches the actual email subject
  let clickedEmail = false;
  for (const keyword of emailSubjectKeywords) {
    const specificEmailSelector = `//table[contains(@class, "table")]//tbody//tr/td[contains(text(), "${keyword}")]`;
    try {
      const emailElement = page.locator(specificEmailSelector).first();
      await emailElement.waitFor({ state: "visible", timeout: 10000 });
      await emailElement.click();
      clickedEmail = true;
      console.log(`Clicked email with subject containing: "${keyword}"`);
      break;
    } catch (e) {
      /* Ignore, try next keyword */
    }
  }

  if (!clickedEmail) {
    console.warn(
      "Could not find email with specific subject keywords, clicking the first email's subject cell."
    );
    try {
      await page
        .locator(firstEmailSubjectCellSelector)
        .first()
        .click({ timeout: 20000 });
    } catch (e) {
      console.error("Failed to click even the first email. Saving screenshot.");
      await page.screenshot({
        path: `mailinator_click_fallback_failed_${inboxName}.png`,
        fullPage: true,
      });
      throw new Error(
        `Failed to click any email in Mailinator inbox for ${inboxName}.`
      );
    }
  }

  const iframeEmailBody = page.frameLocator("#html_msg_body");
  if (!iframeEmailBody) {
    console.error(
      "Could not find Mailinator email body iframe. Saving screenshot."
    );
    await page.screenshot({
      path: `mailinator_no_iframe_${inboxName}.png`,
      fullPage: true,
    });
    throw new Error("Mailinator email body iframe not found.");
  }
  console.log("Switched to Mailinator email body iframe.");

  // Adjust this locator if the link structure is different
  const verificationLinkLocator = iframeEmailBody.locator(
    'a[href*="verify"], a[href*="confirm"], a[href*="activate"], a[href*="token"]'
  );
  try {
    await verificationLinkLocator
      .first()
      .waitFor({ state: "visible", timeout: 45000 });
    console.log("Verification link locator found in iframe.");
  } catch (e) {
    console.error(
      "Timeout waiting for verification link in Mailinator email body. Saving screenshot."
    );
    try {
      const iframeContent = await iframeEmailBody.locator(":root").innerHTML();
      console.log(
        "Mailinator iframe content for debugging (first 2000 chars):\n",
        iframeContent.substring(0, 2000)
      );
    } catch (htmlError) {
      console.error("Could not get iframe HTML content.", htmlError);
    }
    await page.screenshot({
      path: `mailinator_no_link_in_iframe_${inboxName}.png`,
      fullPage: true,
    });
    throw new Error(
      "Verification link not found or not visible in Mailinator email body."
    );
  }

  const linkHref = await verificationLinkLocator.first().getAttribute("href");
  if (!linkHref) {
    console.error(
      "Verification link href attribute is null. Saving screenshot."
    );
    await page.screenshot({
      path: `mailinator_null_href_${inboxName}.png`,
      fullPage: true,
    });
    throw new Error("Verification link href attribute was null.");
  }
  console.log(`Verification link extracted: ${linkHref}`);
  return linkHref;
}

module.exports = {
  getVerificationLinkFromMailinator,
};
