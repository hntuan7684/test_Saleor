# Quick Fix Guide for Cucumber Test Issues

## 🚨 Critical Issues to Fix Immediately

### 1. Fix Ambiguous Step Definitions (16 scenarios affected)

**Problem**: Multiple step definitions match the same step text.

**Solution**: Make step definitions more specific by adding context.

#### Example Fixes:

**Before (Ambiguous):**
```javascript
// In product-detail.steps.js
When('I view the page on mobile screen', async function() {
  // implementation
});

// In products.steps.js  
When('I view the page on mobile screen', async function() {
  // different implementation
});
```

**After (Specific):**
```javascript
// In product-detail.steps.js
When('I view the product detail page on mobile screen', async function() {
  // implementation
});

// In products.steps.js
When('I view the products page on mobile screen', async function() {
  // implementation
});
```

**Other fixes needed:**
- `all product images should have alt attributes` → `all product detail images should have alt attributes` / `all product list images should have alt attributes`
- `I should see {string} message` → `I should see {string} error message` / `I should see {string} success message`

### 2. Fix Element Selection Issues (Multiple scenarios affected)

**Problem**: Selectors finding multiple elements causing strict mode violations.

**Solution**: Use more specific selectors.

#### Example Fixes:

**Before (Too Generic):**
```javascript
await page.locator('button:has-text("M")').click();
```

**After (More Specific):**
```javascript
await page.locator('[data-testid="size-selector"] button:has-text("M")').first().click();
// OR
await page.locator('button[title*="M"]').first().click();
```

**Before (Too Generic):**
```javascript
await page.locator('h1').expect().toHaveText(expectedTitle);
```

**After (More Specific):**
```javascript
await page.locator('h1').first().expect().toHaveText(expectedTitle);
// OR
await page.locator('[data-testid="product-title"]').expect().toHaveText(expectedTitle);
```

### 3. Fix Timeout Issues (Multiple scenarios affected)

**Problem**: Elements not loading within 5-second timeout.

**Solution**: Increase timeouts and improve waiting strategies.

#### Example Fixes:

**Before:**
```javascript
await page.locator('selector').click();
```

**After:**
```javascript
// Wait for element to be visible first
await page.locator('selector').waitFor({ state: 'visible', timeout: 10000 });
await page.locator('selector').click();
```

**Or use better waiting:**
```javascript
await page.locator('selector').waitFor({ state: 'attached', timeout: 15000 });
await page.locator('selector').click();
```

### 4. Fix Missing UI Elements (Product Detail Page)

**Problem**: Expected UI elements not found (color options, size selectors, quantity inputs).

**Solution**: Verify selectors match actual UI implementation.

#### Check these selectors:

```javascript
// Color options - try these selectors:
await page.locator('[data-testid="color-options"]').count();
await page.locator('.color-selector button').count();
await page.locator('button[title*="color"]').count();

// Size options - try these selectors:
await page.locator('[data-testid="size-options"]').count();
await page.locator('.size-selector button').count();
await page.locator('button[title*="size"]').count();

// Quantity input - try these selectors:
await page.locator('[data-testid="quantity-input"]').count();
await page.locator('input[type="number"]').count();
await page.locator('.quantity-selector input').count();
```

## 🔧 Implementation Steps

### Step 1: Fix Ambiguous Step Definitions
1. Search for duplicate step definitions across all `.steps.js` files
2. Make each step definition unique by adding context
3. Update corresponding feature files if needed

### Step 2: Improve Element Selectors
1. Add `data-testid` attributes to UI elements in the application
2. Update selectors to use more specific identifiers
3. Use `.first()`, `.nth()`, or other methods to handle multiple elements

### Step 3: Increase Timeouts
1. Update `cucumber.config.js` to increase default timeout:
```javascript
module.exports = {
  default: {
    // ... existing config
    timeout: 600000, // Increase from 300000 to 600000 (10 minutes)
  }
};
```

2. Add explicit waits in step definitions where needed

### Step 4: Verify UI Implementation
1. Manually test the application to verify UI elements exist
2. Update test expectations to match actual UI behavior
3. Add missing UI elements if they don't exist

## 📋 Quick Test Commands

### Run specific feature files:
```bash
# Run only products page tests
npm run test:cucumber:products

# Run only product detail tests
cucumber-js --tags "@PD"

# Run only support form tests
cucumber-js --tags "@SP"
```

### Run tests with specific tags:
```bash
# Run only navigation tests
cucumber-js --tags "@navigation"

# Run only layout tests
cucumber-js --tags "@layout"

# Run only interaction tests
cucumber-js --tags "@interaction"
```

### Run tests with increased timeout:
```bash
cucumber-js --timeout 600000
```

## 🎯 Expected Results After Fixes

After implementing these fixes, you should see:

1. **Ambiguous scenarios reduced from 16 to 0**
2. **Failed scenarios reduced significantly**
3. **Test execution time more stable**
4. **Better error messages for debugging**

## 📊 Monitoring Progress

Track your progress by running:
```bash
npm run test:cucumber:all
```

Monitor these metrics:
- Total scenarios: 78
- Passed scenarios: Target > 60
- Failed scenarios: Target < 10
- Ambiguous scenarios: Target 0
- Execution time: Should be consistent

## 🆘 If Issues Persist

1. **Check browser console** for JavaScript errors
2. **Verify network connectivity** to mypod.io.vn
3. **Check application logs** for backend issues
4. **Use Playwright debug mode**:
   ```bash
   cucumber-js --headed --debug
   ```

This will help identify if issues are test-related or application-related. 