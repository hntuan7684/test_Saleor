// global-test.js
// Global test configuration and utilities

// Load environment variables for all tests
require('dotenv').config();

const { test } = require('@playwright/test');

// Export test for use in other files
module.exports = { test };