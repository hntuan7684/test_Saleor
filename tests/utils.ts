import { expect, type Page } from "@playwright/test";

// ✅ Cách đúng (nên dùng destructuring)
export async function login({ page }: { page: Page }) {
	await page.goto("https://mypod.io.vn/default-channel/login", {
	  waitUntil: "domcontentloaded",
	});
  
	await page.waitForSelector('input[name="email"]');
	await page.fill('input[name="email"]', "ngothanhloc.22102003@gmail.com");
	await page.fill('input[name="password"]', "Loc22102004");
  
	await Promise.all([
	  page.waitForNavigation({ waitUntil: "networkidle" }),
	  page.click('button:has-text("Log in")'),
	]);
  }
  
  
export async function clickOnRandomProductElement({ page }: { page: Page }) {
	const productLinks = page.locator("[data-testid='ProductElement']");
	await productLinks.first().waitFor({ timeout: 10000 }); // tránh timeout quá dài
	const count = await productLinks.count();
  
	if (count === 0) throw new Error("No products found on the page.");
  
	const nth = Math.floor(Math.random() * count);
	return clickOnNthProductElement({ page, nth });
  }

  export async function clickOnNthProductElement({ page, nth }: { page: Page; nth: number }) {
	const productLinks = page.locator("[data-testid='ProductElement']");
	await productLinks.first().waitFor({ timeout: 10000 });
  
	const randomProductLink = productLinks.nth(nth);
  
	const name = await randomProductLink.getByRole("heading").textContent();
	const priceRange = await randomProductLink.getByTestId("ProductElement_PriceRange").textContent();
	const category = await randomProductLink.getByTestId("ProductElement_Category").textContent();
  
	await randomProductLink.click();
	await page.waitForURL("**/products/*");
  
	expect(name, "Missing product name").toBeTruthy();
	expect(priceRange, "Missing product priceRange").toBeTruthy();
	expect(category, "Missing product category").toBeTruthy();
  
	return { name: name!, priceRange: priceRange!, category: category! };
  }

export async function getCurrentProductPrice({ page }: { page: Page }) {
	const price = await page.locator("span:text('$')").first().textContent();
	expect(price, "Missing product price").toBeTruthy();
	return Number.parseFloat(price!.replace(/[^0-9\.]/g, ""));
}

export async function selectRandomAvailableVariant({ page }: { page: Page }) {
	// nhiều sản phẩm không có biến thể, bỏ qua lỗi
	try {
		const variantSection = page.locator("fieldset").first();
		const variants = variantSection.locator("input[type='radio']:not([disabled])");
		const count = await variants.count();
		if (count > 0) {
			await variants.nth(Math.floor(Math.random() * count)).click();
		}
	} catch {}
	await page.waitForURL(/\?variant=.+/, { timeout: 3000 }).catch(() => {});
}

export async function addCurrentProductToCart({ page }: { page: Page }) {
	expect(page.url()).toContain("/products/");
	const addButton = page.getByRole("button", { name: /add to cart/i });
	await addButton.click();
	await expect(addButton).toBeEnabled();
}

export async function openCart({ page }: { page: Page }) {
	await page.locator("a[href='/cart']").click();
	await page.locator("h1", { hasText: "Your Shopping Cart" }).waitFor();
}
