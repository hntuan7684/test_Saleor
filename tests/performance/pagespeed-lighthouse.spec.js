const { test, expect } = require('@playwright/test');
const lighthouse = require('lighthouse/core/index.cjs');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://mypod.io.vn/default-channel';
const REPORT_DIR = path.join(__dirname, '../../performance-reports/pagespeed');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Performance thresholds
const THRESHOLDS = {
  performance: 80, // Minimum performance score
  accessibility: 80, // Minimum accessibility score
  bestPractices: 80, // Minimum best practices score
  seo: 80, // Minimum SEO score
  firstContentfulPaint: 1800, // ms
  speedIndex: 3400, // ms
  largestContentfulPaint: 2500, // ms
  timeToInteractive: 3800, // ms
  totalBlockingTime: 200, // ms
  cumulativeLayoutShift: 0.1, // score
};

async function runLighthouse(url, options = {}) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });

  const results = await lighthouse(url, {
    port: chrome.port,
    output: 'html',
    logLevel: 'info',
    ...options
  });

  await chrome.kill();
  return results;
}

test.describe('PageSpeed Insights Tests', () => {
  test('should meet performance requirements for homepage', async () => {
    const results = await runLighthouse(BASE_URL, {
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
    });

    // Save report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(REPORT_DIR, `homepage-${timestamp}.html`);
    fs.writeFileSync(reportPath, results.report);

    // Log scores
    console.log('\nPageSpeed Insights Scores:');
    console.log('Performance:', results.lhr.categories.performance.score * 100);
    console.log('Accessibility:', results.lhr.categories.accessibility.score * 100);
    console.log('Best Practices:', results.lhr.categories['best-practices'].score * 100);
    console.log('SEO:', results.lhr.categories.seo.score * 100);

    // Assertions
    expect(results.lhr.categories.performance.score * 100).toBeGreaterThanOrEqual(THRESHOLDS.performance);
    expect(results.lhr.categories.accessibility.score * 100).toBeGreaterThanOrEqual(THRESHOLDS.accessibility);
    expect(results.lhr.categories['best-practices'].score * 100).toBeGreaterThanOrEqual(THRESHOLDS.bestPractices);
    expect(results.lhr.categories.seo.score * 100).toBeGreaterThanOrEqual(THRESHOLDS.seo);
  }, 120000);

  test('should meet Core Web Vitals requirements', async () => {
    const results = await runLighthouse(BASE_URL, {
      onlyCategories: ['performance']
    });

    const metrics = results.lhr.audits;

    // Log metrics
    console.log('\nCore Web Vitals Metrics:');
    console.log('First Contentful Paint:', metrics['first-contentful-paint'].numericValue);
    console.log('Speed Index:', metrics['speed-index'].numericValue);
    console.log('Largest Contentful Paint:', metrics['largest-contentful-paint'].numericValue);
    console.log('Time to Interactive:', metrics['interactive'].numericValue);
    console.log('Total Blocking Time:', metrics['total-blocking-time'].numericValue);
    console.log('Cumulative Layout Shift:', metrics['cumulative-layout-shift'].numericValue);

    // Assertions
    expect(metrics['first-contentful-paint'].numericValue).toBeLessThan(THRESHOLDS.firstContentfulPaint);
    expect(metrics['speed-index'].numericValue).toBeLessThan(THRESHOLDS.speedIndex);
    expect(metrics['largest-contentful-paint'].numericValue).toBeLessThan(THRESHOLDS.largestContentfulPaint);
    expect(metrics['interactive'].numericValue).toBeLessThan(THRESHOLDS.timeToInteractive);
    expect(metrics['total-blocking-time'].numericValue).toBeLessThan(THRESHOLDS.totalBlockingTime);
    expect(metrics['cumulative-layout-shift'].numericValue).toBeLessThan(THRESHOLDS.cumulativeLayoutShift);
  }, 120000);

  test('should have optimized images', async () => {
    const results = await runLighthouse(BASE_URL, {
      onlyCategories: ['performance']
    });

    const imageAudits = results.lhr.audits;
    
    // Log image optimization metrics
    console.log('\nImage Optimization Metrics:');
    console.log('Image Size:', imageAudits['modern-image-formats'].score * 100);
    console.log('Image Compression:', imageAudits['uses-optimized-images'].score * 100);
    console.log('Image Dimensions:', imageAudits['uses-responsive-images'].score * 100);

    // Assertions
    expect(imageAudits['modern-image-formats'].score * 100).toBeGreaterThanOrEqual(80);
    expect(imageAudits['uses-optimized-images'].score * 100).toBeGreaterThanOrEqual(80);
    expect(imageAudits['uses-responsive-images'].score * 100).toBeGreaterThanOrEqual(80);
  }, 120000);

  test('should have efficient resource loading', async () => {
    const results = await runLighthouse(BASE_URL, {
      onlyCategories: ['performance']
    });

    const resourceAudits = results.lhr.audits;
    
    // Log resource loading metrics
    console.log('\nResource Loading Metrics:');
    console.log('Resource Compression:', resourceAudits['uses-text-compression'].score * 100);
    console.log('Resource Caching:', resourceAudits['uses-long-cache-ttl'].score * 100);
    console.log('Resource Minification:', resourceAudits['unminified-javascript'].score * 100);

    // Assertions
    expect(resourceAudits['uses-text-compression'].score * 100).toBeGreaterThanOrEqual(80);
    expect(resourceAudits['uses-long-cache-ttl'].score * 100).toBeGreaterThanOrEqual(80);
    expect(resourceAudits['unminified-javascript'].score * 100).toBeGreaterThanOrEqual(80);
  }, 120000);

  test('should have good accessibility', async () => {
    const results = await runLighthouse(BASE_URL, {
      onlyCategories: ['accessibility']
    });

    const accessibilityAudits = results.lhr.audits;
    
    // Log accessibility metrics
    console.log('\nAccessibility Metrics:');
    console.log('Color Contrast:', accessibilityAudits['color-contrast'].score * 100);
    console.log('Document Title:', accessibilityAudits['document-title'].score * 100);
    console.log('Image Alt Text:', accessibilityAudits['image-alt'].score * 100);

    // Assertions
    expect(accessibilityAudits['color-contrast'].score * 100).toBeGreaterThanOrEqual(80);
    expect(accessibilityAudits['document-title'].score * 100).toBeGreaterThanOrEqual(80);
    expect(accessibilityAudits['image-alt'].score * 100).toBeGreaterThanOrEqual(80);
  }, 120000);
}); 