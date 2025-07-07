# Playwright Test Automation with Cucumber

This repository contains automated end-to-end (E2E) tests using [Playwright](https://playwright.dev/) and [Cucumber](https://cucumber.io/), designed to validate the core features and flows of the Saleor application.

## Project Overview

This test automation suite covers the following key areas of the Saleor application:

- **User Authentication** (Login, Register, Forgot Password)
- **Product Management** (Listing, Details, Search)
- **Shopping Cart Operations** (Add, Remove, Update)
- **Checkout Process** (Price calculation, Payment flow)
- **Search Functionality** (Product search, Filtering)
- **Support System** (Contact forms, Error handling)
- **Performance Testing** (Page load times, Metrics)
- **Responsive Design Testing** (Mobile, Tablet, Desktop)
- **Accessibility Testing** (ARIA labels, Keyboard navigation)
- **SEO Testing** (Meta tags, URL structure)

## Project Structure

```
├── tests/                               # Playwright test files
│   ├── pageObjects/                     # Page Object Models
│   │   ├── LoginPage.js                 # Login page interactions
│   │   ├── RegisterPage.js              # Registration page
│   │   ├── ProductDetailPage.js         # Product detail page
│   │   ├── ShoppingCartPage.js          # Shopping cart page
│   │   └── ForgotPasswordPage.js        # Password recovery page
│   ├── utils/                           # Utility functions
│   │   ├── constants.js                 # Test constants
│   │   ├── testData.js                  # Test data management
│   │   ├── testResultLogger.js          # Result logging
│   │   ├── mailHelper.js                # Email utilities
│   │   └── run-test-and-send-mail.js    # Test execution with email
│   ├── performance/                     # Performance test cases
│   │   └── pagespeed-api.spec.js        # PageSpeed API tests
│   ├── 01-register.spec.js              # User registration tests
│   ├── 02-login.spec.js                 # User login tests
│   ├── 03-forgot-password.spec.js       # Password recovery tests
│   ├── 04-products.spec.js              # Product listing tests
│   ├── 05-product-detail.spec.js        # Product details tests
│   ├── 07-order-process.spec.js         # Order processing tests
│   ├── 08-shopping-cart.spec.js         # Cart management tests
│   ├── 09-design-page.spec.js           # Design page tests
│   ├── 10-search-functionality.spec.js  # Search feature tests
│   ├── 11-support-form.spec.js          # Support system tests
│   ├── 12-homepage.spec.js              # Homepage tests
│   ├── 13-service-page.spec.js          # Service page tests
│   ├── 14-add-product-to-cart.spec.js   # Add to cart tests
│   └── 15-cart-price-checkout.spec.js   # Checkout tests
├── features/                            # Cucumber feature files
│   ├── products/                        # Product-related features
│   │   ├── products.feature             # Product listing features
│   │   ├── product-detail.feature       # Product detail features
│   │   └── README.md                    # Product features documentation
│   └── support/                         # Support-related features
│       └── support-form.feature         # Support form features
├── features/step-definitions/           # Cucumber step definitions
│   ├── products/                        # Product step definitions
│   │   ├── products.steps.js            # Product listing steps
│   │   └── product-detail.steps.js      # Product detail steps
│   └── support/                         # Support step definitions
│       ├── support-form.steps.js        # Support form steps
│       └── hooks.js                     # Cucumber hooks
├── results/                             # Test execution results
│   ├── screenshots/                     # Test screenshots
│   └── cucumber-report.html             # Cucumber HTML reports
├── performance-reports/                 # Performance analysis reports
│   ├── dashboard.html                   # Performance dashboard
│   └── performance-results.json         # Performance metrics
├── cucumber.config.js                   # Cucumber configuration
├── playwright.config.js                 # Playwright configuration
└── package.json                         # Project dependencies
```

## Test Frameworks

### 1. Playwright Tests
Traditional Playwright test files with Page Object Model pattern.

### 2. Cucumber BDD Tests
Behavior-Driven Development tests using Cucumber framework.

## Cucumber Features

### Product Features (`features/products/`)

#### Products Listing (`products.feature`)
- **Navigation Tests**: Breadcrumb navigation, Home link functionality
- **Layout Tests**: Grid layout, Responsive design, Product cards display
- **Content Tests**: Product names, Prices, Images, Descriptions
- **Interaction Tests**: Hover effects, Click actions, Keyboard navigation
- **Accessibility Tests**: ARIA labels, Alt attributes, Tab navigation
- **Performance Tests**: Page load times, Image loading, Grid adaptation

#### Product Detail (`product-detail.feature`)
- **Content Verification**: Product title, Images, Price, Description
- **Interaction Features**: Color selection, Size selection, Quantity input
- **Cart Integration**: Add to cart, Cart validation, Price calculation
- **Navigation**: Breadcrumb navigation, Design page redirection
- **Responsive Design**: Mobile layout, Tablet layout, Desktop layout
- **Accessibility**: Alt attributes, Keyboard navigation, Focus management
- **Performance**: Page load times, Image loading, Resource optimization

### Support Features (`features/support/`)

#### Support Form (`support-form.feature`)
- **Form Validation**: Required fields, Field length validation
- **Error Handling**: Database errors, Network errors, Validation errors
- **User Experience**: Form submission, Success messages, Error messages
- **Data Integrity**: Input sanitization, Data persistence

## Test Cases

### 1. Authentication Tests
- `01-register.spec.js`: User registration flow with validation
- `02-login.spec.js`: User login functionality and error handling
- `03-forgot-password.spec.js`: Password recovery process

### 2. Product Tests
- `04-products.spec.js`: Product listing, filtering, and pagination
- `05-product-detail.spec.js`: Product details, specifications, and variants
- `10-search-functionality.spec.js`: Product search and filtering features

### 3. Shopping Cart Tests
- `08-shopping-cart.spec.js`: Cart management and item operations
- `14-add-product-to-cart.spec.js`: Adding products with variants
- `15-cart-price-checkout.spec.js`: Price calculation and checkout flow

### 4. Performance Tests
- Located in `tests/performance/` directory
- **Performance Metrics**:
  - Page Load Time (PLT)
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Time to Interactive (TTI)
  - Total Blocking Time (TBT)
  - Cumulative Layout Shift (CLS)
  - First Input Delay (FID)

### 5. Additional Features
- `07-order-process.spec.js`: Complete order processing workflow
- `09-design-page.spec.js`: Design customization features
- `11-support-form.spec.js`: Customer support system
- `12-homepage.spec.js`: Homepage functionality and layout
- `13-service-page.spec.js`: Service page features and content

## Getting Started

Follow the steps below to set up and run the tests locally.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/hntuan7684/test_Saleor
cd test_Saleor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Playwright Browsers
```bash
npx playwright install
```

### 4. Environment Setup
Create a `.env` file in the root directory:
```env
BASE_URL=https://your-saleor-instance.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPass123!
```

## Running Tests

### Playwright Tests

#### Run All Playwright Tests
```bash
npm test
```

#### Run Tests with Interactive UI
```bash
npx playwright test --ui
```

#### Run Specific Test File
```bash
npx playwright test tests/01-register.spec.js
```

#### Run Tests in Headless Mode
```bash
npx playwright test --headed=false
```

### Cucumber Tests

#### Run All Cucumber Tests
```bash
npm run test:cucumber:all
```

#### Run Cucumber Tests with GUI
```bash
npm run test:cucumber:headed
```

#### Run Specific Feature
```bash
npm run test:cucumber:products
```

#### Run Tests by Tags
```bash
# Run only content tests
npx cucumber-js --tags @content

# Run only interaction tests
npx cucumber-js --tags @interaction

# Run only accessibility tests
npx cucumber-js --tags @accessibility

# Run only performance tests
npx cucumber-js --tags @performance
```

### Performance Tests
```bash
npm run test:performance
```

## Test Reports

### Playwright Reports
- **HTML Reports**: Generated in `playwright-report/` directory
- **JSON Reports**: Available for CI/CD integration
- **Screenshots**: Captured on test failures

### Cucumber Reports
- **HTML Reports**: Generated in `results/cucumber-report.html`
- **JSON Reports**: Available for CI/CD integration
- **Summary Reports**: Console output with test statistics

### Performance Reports
- **Dashboard**: Interactive HTML dashboard in `performance-reports/`
- **Metrics**: Detailed performance metrics in JSON format
- **Charts**: Visual representation of performance trends

## Browser Support

Tests are configured to run on:
- Chromium
- Firefox
- WebKit (Safari)

## Configuration

### Playwright Configuration (`playwright.config.js`)
- Browser settings and launch options
- Test timeouts and retry logic
- Screenshot and video capture settings
- Parallel execution configuration

### Cucumber Configuration (`cucumber.config.js`)
- Step definition paths
- Report formats and output locations
- Parallel execution settings
- Tag filtering options

## Best Practices

### Test Organization
- Use descriptive test names and scenarios
- Follow Page Object Model (POM) pattern
- Implement proper test data management
- Use appropriate waiting strategies

### Code Quality
- Write maintainable and readable code
- Include comprehensive error handling
- Use meaningful assertions and validations
- Implement proper test cleanup

### Performance
- Optimize test execution time
- Use efficient selectors and locators
- Implement parallel test execution
- Monitor and optimize resource usage

## Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install
   ```

2. **Environment Variables**
   - Verify `.env` file exists and contains correct values
   - Check BASE_URL accessibility

3. **Test Failures**
   - Check test reports for detailed error information
   - Verify application state and data
   - Review screenshots for visual debugging

4. **Performance Issues**
   - Clear browser cache: `npx playwright clear-cache`
   - Check network connectivity
   - Verify application performance

### Debug Mode
```bash
# Run tests in debug mode
npx playwright test --debug

# Run Cucumber tests with headed browser
npm run test:cucumber:headed
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-test`
3. **Write your tests** following existing patterns
4. **Ensure all tests pass**: `npm test && npm run test:cucumber:all`
5. **Submit a pull request** with detailed description

### Code Standards
- Follow existing naming conventions
- Include appropriate comments and documentation
- Write comprehensive test scenarios
- Ensure proper error handling

## CI/CD Integration

### GitHub Actions
```yaml
name: Test Automation
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install
      - run: npm test
      - run: npm run test:cucumber:all
```

## Support

For questions and support:
- Create an issue in the repository
- Review existing documentation
- Check test reports for debugging information

## License

This project is licensed under the MIT License - see the LICENSE file for details.
