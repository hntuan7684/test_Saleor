export async function getVerificationLinkFromMailinator(page, email) {
  const username = email.split('@')[0];
  try {
    // 1. Mở hộp thư đến của người dùng
    await page.goto(`https://www.mailinator.com/v4/public/inboxes.jsp?to=${username}`, {
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(8000); // chờ mail đến

    // 2. Tìm email có tiêu đề liên quan đến "ZoomPrints"
    const emailRow = page.locator('.ng-binding', { hasText: 'ZoomPrints' });
    await emailRow.first().click();

    // 3. Truy cập iframe chứa nội dung email
    const iframe = page.frameLocator('#html_msg_body');

    // 4. Tìm nút "Confirm Account" bên trong email
    const confirmLinkLocator = iframe.locator('a.button:has-text("Confirm Account")');

    await confirmLinkLocator.waitFor({ timeout: 60000 });

    // 5. Lấy URL từ thuộc tính href
    const link = await confirmLinkLocator.getAttribute('href');
    return link;
  } catch (error) {
    console.error('Failed to get verification link:', error);
    if (!page.isClosed()) {
      await page.screenshot({ path: 'mailinator-error.png' });
    }
    return null;
  }
}
