const { expect } = require("@playwright/test");

class CartPage {
  constructor(page) {
    this.page = page;
  }

  getItem(index = 0) {
    return this.page.locator("li.flex.gap-x-2").nth(index);
  }

  getQuantityInput(index = 0) {
    return this.getItem(index).locator("input[type='number']");
  }

  async changeQuantity(index, quantity) {
    const input = this.getQuantityInput(index);
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill(String(quantity));
  }

  async removeItem(index = 0) {
    const item = this.getItem(index);
    // Định vị nút Delete chính xác theo span chứa text
    const deleteBtn = item.locator("button span:text('Delete')").first();
    await expect(deleteBtn).toBeVisible({ timeout: 30000 });
    await deleteBtn.click({ force: true });
  }

  async getItemCount() {
    return await this.page.locator("li.flex.gap-x-2").count();
  }

  async getSubtotal() {
    const subtotalText = await this.page
      .locator("text=Subtotal")
      .last()
      .innerText();
    return parseFloat(subtotalText.replace(/[^0-9.]/g, ""));
  }

  async getTotalItemPrices() {
    const itemPrices = this.page.locator("li.flex.gap-x-2 p:has-text('$')");
    const count = await itemPrices.count();
    let total = 0;
    for (let i = 0; i < count; i++) {
      const priceText = await itemPrices.nth(i).innerText();
      total += parseFloat(priceText.replace("$", ""));
    }
    return total;
  }

  // Clear all items
  async clearCart() {
    while ((await this.getItemCount()) > 0) {
      await this.removeItem(0);
    }
  }

  // Get item price at index
  async getItemPrice(index = 0) {
    const priceText = await this.getItem(index)
      .locator("p:has-text('$')")
      .innerText();
    return parseFloat(priceText.replace("$", ""));
  }
  async isCartEmpty() {
    return (await this.getItemCount()) === 0;
  }
}

module.exports = { CartPage };
