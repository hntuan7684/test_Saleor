const { test, expect } = require('@playwright/test');
const psi = require('psi');
require('dotenv').config();

test.describe('PageSpeed Insights Tests', () => {
  const baseUrl = 'https://mypod.io.vn/default-channel';

  test('should pass PageSpeed Insights test for desktop', async () => {
    const result = await psi(baseUrl, {
      key: '',
      strategy: 'desktop',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Desktop Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Desktop Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Desktop Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Desktop SEO Score:', result.data.lighthouseResult.categories.seo.score);
  });

  test('should pass PageSpeed Insights test for mobile', async () => {
    const result = await psi(baseUrl, {
      key: process.env.PAGESPEED_API_KEY,
      strategy: 'mobile',
      category: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Check overall scores
    expect(result.data.lighthouseResult.categories.performance.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.accessibility.score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories['best-practices'].score).toBeGreaterThanOrEqual(0.8);
    expect(result.data.lighthouseResult.categories.seo.score).toBeGreaterThanOrEqual(0.8);

    // Save detailed results
    console.log('Mobile Performance Score:', result.data.lighthouseResult.categories.performance.score);
    console.log('Mobile Accessibility Score:', result.data.lighthouseResult.categories.accessibility.score);
    console.log('Mobile Best Practices Score:', result.data.lighthouseResult.categories['best-practices'].score);
    console.log('Mobile SEO Score:', result.data.lighthouseResult.categories.seo.score);
  });
}); 
