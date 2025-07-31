# Product Detail Page Tests

## Overview

The Cucumber test suite for the Product Detail page is designed to test all functions and features of the product detail page.

## File Structure

```
features/
├── products/
│   ├── product-detail.feature    # Feature file for product detail
│   └── products.feature          # Feature file for products list
└── step-definitions/
    └── products/
        ├── product-detail.steps.js  # Step definitions for product detail
        └── products.steps.js        # Step definitions for products list
```

## Test Cases

### Content Tests (@content)
- **PD001**: Verify Product Title is displayed correctly
- **PD002**: Verify Product Image is displayed
- **PD005**: Verify Price is displayed correctly
- **PD011**: Verify Product Features list is displayed
- **PD016**: Verify Product Description is displayed and formatted correctly
- **PD022**: Verify product information is complete

### Interaction Tests (@interaction)
- **PD003**: Verify Color options are displayed and selectable
- **PD004**: Verify Size options are displayed and selectable
- **PD006**: Verify Add to Cart button is clickable
- **PD007**: Verify Quantity selector is working correctly
- **PD010**: Verify Product Images Carousel works correctly
- **PD014**: Verify Image changes with color selection
- **PD020**: Verify quantity input accepts valid values
- **PD023**: Verify size selection updates product availability
- **PD024**: Verify color selection updates product appearance

### Cart Tests (@cart)
- **PD008**: Verify Product is added to Cart correctly

### Validation Tests (@validation)
- **PD009**: Verify Error message for invalid quantity
- **PD021**: Verify quantity input rejects invalid values

### Navigation Tests (@navigation)
- **PD012**: Verify Breadcrumb navigation works
- **PD017**: Verify Customize Design button navigates correctly

### SEO Tests (@seo)
- **PD013**: Verify Product URL is SEO friendly

### Authentication Tests (@authentication)
- **PD015**: Verify Add to Cart without selecting Size redirects to login

### Layout Tests (@layout)
- **PD018**: Verify product detail page layout is responsive

### Accessibility Tests (@accessibility)
- **PD019**: Verify product images have alt attributes

### Performance Tests (@performance)
- **PD025**: Verify product detail page loads within acceptable time

## Running Tests

### Run all tests
```bash
npx cucumber-js
```

### Run tests by tag
```bash
# Run only content tests
npx cucumber-js --tags @content

# Run only interaction tests
npx cucumber-js --tags @interaction

# Run only cart tests
npx cucumber-js --tags @cart

# Run only validation tests
npx cucumber-js --tags @validation
```

### Run specific test
```bash
# Run test PD001
npx cucumber-js --tags @PD001

# Run multiple tests
npx cucumber-js --tags "@PD001 or @PD002"
```

## Configuration

### Background
Each scenario will automatically navigate to the product detail page of product "bella-3001" before running the test.

### Timeouts
- Default timeout: 120 seconds
- Network idle wait: 90 seconds
- Element visibility timeout: 20 seconds

### Browser Configuration
- Browser: Chromium
- Headless: false (can be changed in Before hook)
- SlowMo: 1000ms (for easy monitoring)

## Dependencies

These tests use:
- `@cucumber/cucumber`: Testing framework
- `@playwright/test`: Browser automation
- `@babel/register`: ES6+ support

## Troubleshooting

### Common Issues

1. **Element not found**: Check if the selector is correct
2. **Timeout errors**: Increase timeout in configuration
3. **Network issues**: Check internet connection
4. **Login failures**: Check login credentials

### Debug

To debug, you can:
1. Run with `headless: false` to see the browser
2. Add `await this.page.pause()` in step to pause
3. Take screenshot when there's an error
4. Log to console for monitoring

## Maintenance

### Adding new tests
1. Add scenario to `product-detail.feature`
2. Implement step definitions in `product-detail.steps.js`
3. Run test to verify

### Updating selectors
If UI changes, update selectors in corresponding step definitions.

### Updating test data
Tests use product "bella-3001" - if you need to change it, update in Background step. 