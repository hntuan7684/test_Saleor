# Playwright Test Automation

This repository contains automated end-to-end (E2E) tests using [Playwright](https://playwright.dev/), designed to validate the core features and flows of the Saleor application.

## Project Overview

This test automation suite covers the following key areas of the Saleor application:

- User Authentication (Login, Register, Forgot Password)
- Product Management
- Shopping Cart Operations
- Checkout Process
- Search Functionality
- Support System
- Performance Testing
- Responsive Design Testing

## Project Structure

```
├── tests/                      # Test files
│   ├── pageObjects/           # Page Object Models
│   ├── utils/                 # Utility functions
│   ├── performance/           # Performance test cases
│   ├── performance-reports/   # Performance test results
│   ├── register.spec.js       # User registration tests
│   ├── login.spec.js          # User login tests
│   ├── forgot-password.spec.js # Password recovery tests
│   ├── products.spec.js       # Product listing tests
│   ├── product-detail.spec.js # Product details tests
│   ├── search-functionality.spec.js # Search feature tests
│   ├── shopping-cart.spec.js  # Cart management tests
│   ├── add-product-to-cart.spec.js # Add to cart tests
│   ├── cart-price-checkout.spec.js # Checkout tests
│   ├── homepage.spec.js       # Homepage tests
│   ├── support-form.spec.js   # Support system tests
│   ├── service-page.spec.js   # Service page tests
│   └── design-page.spec.js    # Design page tests
├── results/                   # Test execution results
├── playwright-report/        # HTML test reports
├── performance-reports/      # Performance analysis reports
├── playwright.config.js      # Playwright configuration
└── package.json             # Project dependencies
```

## Test Cases

The project includes the following test suites:

1. **Authentication Tests**
   - `register.spec.js`: User registration flow
   - `login.spec.js`: User login functionality
   - `forgot-password.spec.js`: Password recovery process

2. **Product Tests**
   - `products.spec.js`: Product listing and filtering
   - `product-detail.spec.js`: Product details and specifications
   - `search-functionality.spec.js`: Product search features

3. **Shopping Cart Tests**
   - `shopping-cart.spec.js`: Cart management
   - `add-product-to-cart.spec.js`: Adding products to cart
   - `cart-price-checkout.spec.js`: Price calculation and checkout

4. **Performance Tests**
   - Located in `tests/performance/` directory
   - Performance metrics include:
     - Page load time
     - First Contentful Paint (FCP)
     - Largest Contentful Paint (LCP)
     - Time to Interactive (TTI)
     - Total Blocking Time (TBT)
     - Cumulative Layout Shift (CLS)

5. **Other Features**
   - `homepage.spec.js`: Homepage functionality
   - `support-form.spec.js`: Customer support system
   - `service-page.spec.js`: Service page features
   - `design-page.spec.js`: Design page elements

## Getting Started

Follow the steps below to set up and run the tests locally.

### 1. Clone the Repository

```bash
git clone https://github.com/hntuan7684/test_Saleor
cd test_Saleor
```

### 2. Install Required Packages

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Environment Setup

Create a `.env` file in the root directory with the following variables:
```env
BASE_URL=your_saleor_url
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Tests with Interactive UI

```bash
npx playwright test --ui
```

### Run a Specific Test File

```bash
npx playwright test tests/register.spec.js
```

### Run Performance Tests

```bash
npm run test:performance
```

## Test Reports

- HTML reports are generated in the `playwright-report` directory
- Performance reports are stored in `performance-reports`
- Test results are stored in `results` directory

## Browser Support

Tests are configured to run on:
- Chromium
- Firefox
- WebKit (Safari)

## Contributing

1. Create a new branch for your feature
2. Write your tests following the existing patterns
3. Ensure all tests pass
4. Submit a pull request

## Best Practices

- Use Page Object Model (POM) for better maintainability
- Write descriptive test names
- Include appropriate assertions
- Handle test data cleanup
- Use appropriate waiting strategies

## Troubleshooting

If you encounter issues:
1. Check browser installation
2. Verify environment variables
3. Clear test cache: `npx playwright clear-cache`
4. Check test reports for detailed error information
