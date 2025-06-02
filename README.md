# Playwright Test Automation

This repository contains automated end-to-end (E2E) tests using [Playwright](https://playwright.dev/), designed to validate the core features and flows of the Saleor application.

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

---

## ✅ Running Tests

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
npx playwright test tests/register.spec.ts
```

---
