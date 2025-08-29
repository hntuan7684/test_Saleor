# ZoomPrints Test Automation Suite Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Test Frameworks](#test-frameworks)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Test Categories](#test-categories)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

The **ZoomPrints Test Automation Suite** is a comprehensive testing solution for the ZoomPrints e-commerce platform, built with modern testing frameworks and best practices. This suite covers end-to-end testing, performance testing, and accessibility testing to ensure the highest quality of the ZoomPrints application.

### Key Features
- ✅ **Multi-framework Support**: Playwright + Cucumber BDD
- ✅ **Cross-browser Testing**: Chromium, Firefox, WebKit
- ✅ **Performance Testing**: PageSpeed API integration
- ✅ **Accessibility Testing**: ARIA labels, Keyboard navigation
- ✅ **Responsive Testing**: Mobile, Tablet, Desktop
- ✅ **CI/CD Ready**: Parallel execution, HTML reports
- ✅ **Business Focused**: E-commerce specific test scenarios

## 🏗️ Project Structure

```
zoomprints-test-automation/
├── tests/                           # Playwright test files
│   ├── authentication/              # User authentication tests
│   │   ├── 01-auth.spec.ts         # Main authentication flow
│   │   ├── 02-login.spec.js        # Login functionality
│   │   └── 03-forgot-password.spec.js # Password recovery
│   ├── products/                    # Product management tests
│   │   ├── 01-zoomprints-ui.spec.ts # Main UI tests
│   │   ├── 02-products.spec.js     # Product listing
│   │   ├── 03-product-detail.spec.js # Product detail
│   │   ├── 04-design-functionality.spec.ts # Design tool
│   │   ├── 05-homepage.spec.js     # Homepage functionality
│   │   └── 06-service-page.spec.js # Service page tests
│   ├── checkout/                    # Checkout process tests
│   │   ├── 01-multi-product-pricing.spec.ts # Multi-product pricing
│   │   ├── 02-pricing-order-management.spec.ts # Pricing management
│   │   ├── 03-payment-checkout.spec.ts # Payment checkout
│   │   ├── 03-payment-checkout-random-product.spec.ts # Random product checkout
│   │   └── 04-pricing-verification.spec.ts # Pricing verification
│   ├── cart/                        # Shopping cart tests
│   │   └── 01-order-quantity-validation.spec.js # Quantity validation
│   ├── support/                     # Support system tests
│   │   └── 01-support-form.spec.js # Support form
│   ├── performance/                 # Performance testing
│   │   ├── pagespeed-api.spec.js   # PageSpeed API tests
│   │   └── simple-pagespeed.spec.js # Simple PageSpeed tests
│   ├── pageObjects/                 # Page Object Models
│   │   ├── LoginPage.js            # Login page interactions
│   │   ├── RegisterPage.js         # Registration page
│   │   ├── ForgotPasswordPage.js   # Password recovery page
│   │   ├── ProductsPage.js         # Products listing page
│   │   ├── ProductDetailPage.js    # Product detail page
│   │   ├── ShoppingCartPage.js     # Shopping cart page
│   │   └── OrderQuantityPage.js    # Order quantity page
│   ├── utils/                       # Utility functions
│   │   ├── constants.js             # Test constants and URLs
│   │   ├── testCredentials.js       # Test user credentials
│   │   ├── testData.js              # Test data management
│   │   ├── testDataHelper.js        # Dynamic test data generation
│   │   ├── testResultLogger.js      # Test result logging
│   │   ├── mailHelper.js            # Email utilities
│   │   └── run-test-and-send-mail.js # Test execution with email
│   └── global-test.js               # Global test configuration
├── features/                        # Cucumber BDD features
│   ├── products/                    # Product-related features
│   │   ├── products.feature         # Product listing (27 scenarios)
│   │   ├── product-detail.feature  # Product detail features
│   │   └── README.md               # Product features documentation
│   ├── design-tool/                 # Design tool features
│   │   └── design-tool.feature
│   ├── order-quantity/              # Order quantity validation
│   │   └── order-quantity-validation.feature
│   ├── payment/                     # Payment integration
│   │   └── payment-integration.feature
│   ├── pricing/                     # Pricing system
│   │   └── pricing-system.feature
│   ├── promotion/                   # Promotion system
│   │   └── promotion-system.feature
│   ├── shipping/                    # Shipping management
│   │   └── shipping-management.feature
│   └── support/                     # Support features
│       └── support-form.feature
├── features/step-definitions/       # Cucumber step definitions
│   ├── products/                    # Product step definitions
│   │   ├── products.steps.js        # Product listing steps
│   │   └── product-detail.steps.js  # Product detail steps
│   ├── design-tool/                 # Design tool steps
│   │   └── design-tool.steps.js
│   ├── order-quantity/              # Order quantity steps
│   │   └── order-quantity-validation.steps.js
│   ├── payment/                     # Payment steps
│   │   └── payment-integration.steps.js
│   ├── pricing/                     # Pricing steps
│   │   └── pricing-system.steps.js
│   ├── promotion/                   # Promotion steps
│   │   └── promotion-system.steps.js
│   ├── shipping/                    # Shipping steps
│   │   └── shipping-management.steps.js
│   └── support/                     # Support steps
│       ├── support-form.steps.js
│       ├── hooks.js                 # Cucumber hooks
│       └── shared-steps.js          # Shared step definitions
├── results/                         # Test execution results
│   ├── screenshots/                 # Test screenshots
│   ├── cucumber-report.html         # Cucumber HTML reports
│   └── reports/                     # Additional reports
│       ├── dashboard.html           # Performance dashboard
│       └── performance-results.json # Performance metrics
├── docs/                            # Documentation
│   └── README.md                    # This file
├── playwright-report/               # Playwright HTML reports
├── test-results/                    # Test results directory
├── screenshots/                     # Screenshot directory
├── package.json                     # Project dependencies
├── package-lock.json                # Dependency lock file
├── playwright.config.ts             # Playwright configuration
├── cucumber.config.js               # Cucumber configuration
├── env.example                      # Environment variables template
└── README.md                        # Main project README
```

## 🧪 Test Frameworks

### 1. Playwright Tests
Traditional Playwright test files using the Page Object Model pattern.

**Key Features:**
- **Cross-browser Support**: Chromium, Firefox, WebKit
- **Page Object Model**: Reusable page objects
- **Parallel Execution**: Configurable worker processes
- **Screenshot Capture**: Automatic on test failures
- **Video Recording**: Optional test recording

### 2. Cucumber BDD Tests
Behavior-Driven Development tests using Cucumber framework.

**Key Features:**
- **Gherkin Syntax**: Human-readable test scenarios
- **Tag-based Execution**: Selective test running
- **HTML Reports**: Rich test reports
- **Step Reusability**: Shared step definitions

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

4. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your test credentials
   ```

### Environment Configuration

Create a `.env` file with the following variables:

```env
# Environment Configuration
TEST_ENV=dev

# PageSpeed Insights API Key
PAGESPEED_API_KEY=your_pagespeed_api_key_here

# Test Credentials
TEST_EMAIL=test@example.com
TEST_PASSWORD=testpassword123

# Base URLs
BASE_URL_DEV=https://storefront-dev.mypodsoftware.io.vn/us

# Email Configuration (for test reports)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
REPORT_EMAIL=reports@example.com
```

## 🏃‍♂️ Running Tests

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
npx playwright test tests/authentication/01-auth.spec.ts
```

#### Run Tests in Headless Mode
```bash
npx playwright test --headed=false
```

#### Run Tests in Debug Mode
```bash
npx playwright test --debug
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
npm run test:pagespeed
```

### Utility Scripts
```bash
# Verify development URLs
npm run verify:urls

# Update credentials
npm run update:credentials

# Debug cart errors
npm run debug:cart

# Debug quantity issues
npm run debug:quantity
```

## 📊 Test Categories

### 1. Authentication Tests
- **User Registration**: Account creation flow
- **User Login**: Valid/invalid credential handling
- **Password Recovery**: Forgot password functionality
- **Session Management**: Login/logout flows

### 2. Product Tests
- **Product Listing**: Grid layout, pagination, filtering
- **Product Details**: Specifications, variants, images
- **Product Search**: Search functionality and results
- **Product Navigation**: Breadcrumbs, categories

### 3. Shopping Cart Tests
- **Add to Cart**: Product addition with variants
- **Cart Management**: Update quantities, remove items
- **Cart Validation**: Price calculations, quantity limits
- **Cart Persistence**: Session storage, data retention

### 4. Checkout Tests
- **Payment Flow**: Payment method selection
- **Price Calculation**: Dynamic pricing, discounts
- **Order Processing**: Order confirmation, tracking
- **Error Handling**: Payment failures, validation errors

### 5. Performance Tests
- **Page Load Times**: Core Web Vitals measurement
- **API Performance**: Backend response times
- **Resource Optimization**: Image loading, caching
- **User Experience**: Time to interactive metrics

### 6. Accessibility Tests
- **ARIA Labels**: Screen reader compatibility
- **Keyboard Navigation**: Tab order, focus management
- **Color Contrast**: Visual accessibility
- **Alt Text**: Image accessibility

### 7. Responsive Tests
- **Mobile Layout**: Mobile-specific functionality
- **Tablet Layout**: Tablet viewport testing
- **Desktop Layout**: Desktop optimization
- **Cross-device**: Consistent experience

## 📈 Test Reports

### Playwright Reports
- **Location**: `playwright-report/` directory
- **Format**: Interactive HTML reports
- **Features**: Test results, screenshots, videos, traces

### Cucumber Reports
- **Location**: `results/cucumber-report.html`
- **Format**: Rich HTML reports with scenarios
- **Features**: Step-by-step execution, tags, statistics

### Performance Reports
- **Location**: `results/reports/dashboard.html`
- **Format**: Interactive performance dashboard
- **Features**: Core Web Vitals, performance trends

## 🛠️ Best Practices

### Test Organization
1. **Use Descriptive Names**: Clear test and scenario names
2. **Follow Page Object Model**: Separate UI logic from test logic
3. **Implement Proper Waiting**: Use appropriate wait strategies
4. **Handle Test Data**: Use dynamic data generation
5. **Clean Up Resources**: Proper test cleanup

### Code Quality
1. **Write Maintainable Code**: Follow DRY principles
2. **Include Error Handling**: Comprehensive error management
3. **Use Meaningful Assertions**: Clear validation logic
4. **Document Complex Logic**: Add comments for clarity
5. **Follow Naming Conventions**: Consistent naming patterns

### Performance Optimization
1. **Parallel Execution**: Configure appropriate worker count
2. **Efficient Selectors**: Use reliable and fast selectors
3. **Resource Management**: Optimize memory and CPU usage
4. **Test Isolation**: Ensure tests don't interfere with each other
5. **Timeout Management**: Set appropriate timeouts

## 🔧 Troubleshooting

### Common Issues

#### 1. Browser Installation
```bash
npx playwright install
```

#### 2. Environment Variables
- Verify `.env` file exists and contains correct values
- Check BASE_URL accessibility
- Ensure test credentials are valid

#### 3. Test Failures
- Check test reports for detailed error information
- Verify application state and data
- Review screenshots for visual debugging

#### 4. Performance Issues
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

### Screenshot Debugging
- Screenshots are automatically captured on test failures
- Location: `screenshots/` directory
- Use for visual debugging and issue reporting

## 🤝 Contributing

### Development Workflow

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/new-test`
3. **Write Your Tests**: Follow existing patterns
4. **Ensure All Tests Pass**: `npm test && npm run test:cucumber:all`
5. **Submit a Pull Request**: With detailed description

### Code Standards
- Follow existing naming conventions
- Include appropriate comments and documentation
- Write comprehensive test scenarios
- Ensure proper error handling
- Maintain test isolation

### Test Writing Guidelines
- Use descriptive test names
- Implement proper setup and teardown
- Handle edge cases and error scenarios
- Use appropriate assertions
- Follow the Page Object Model pattern

## 📞 Support

### Getting Help
- **Create an Issue**: Use GitHub issues for bug reports
- **Review Documentation**: Check existing documentation
- **Check Test Reports**: Use reports for debugging
- **Contact Team**: Reach out to the development team

### Resources
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Test Automation Best Practices](https://martinfowler.com/articles/practical-test-pyramid.html)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


**Last Updated**: August 2025
**Version**: 1.0.0  
**Maintainer**: ZoomPrints Test Team
