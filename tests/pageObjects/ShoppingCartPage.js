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

async getTotalItemPrices() {
  const priceTexts = await this.page.locator('p.text-left.font-semibold').allTextContents();

  const quantityInputs = await this.page.locator('input[type="number"]').evaluateAll(inputs =>
    inputs.map(input => parseInt(input.value, 10))
  );

  let total = 0;
  for (let i = 0; i < priceTexts.length; i++) {
    const price = parseFloat(priceTexts[i].replace(/[^0-9.]/g, ""));
    const quantity = quantityInputs[i];
    total += price * quantity;
  }

  return parseFloat(total.toFixed(2));
}


async getSubtotal() {
  const text = await this.page.locator('div.font-medium.text-neutral-900').first().textContent();
  const match = text?.match(/\$([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
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
