const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://mypod.io.vn/default-channel/products';

// Recommended performance thresholds (can be adjusted)
const THRESHOLDS = {
  load: 5000, // ms
  domContentLoaded: 3000, // ms
  firstContentfulPaint: 2000, // ms
  largestContentfulPaint: 2500, // ms
  cumulativeLayoutShift: 0.1, // score
  totalBlockingTime: 200, // ms
};

test.describe('Playwright Performance Metrics', () => {
  test('Should log and assert common web performance metrics', async ({ page }) => {
    await page.route('**/*', route => route.continue());
    await page.goto(TARGET_URL);
    await page.waitForLoadState('networkidle');

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
      const fcp = fcpEntry ? fcpEntry.startTime : null;

      // LCP, CLS, TBT
      let lcp = null;
      let cls = 0;
      let tbt = 0;
      if ('PerformanceObserver' in window) {
        try {
          // LCP
          let lcpValue = null;
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            lcpValue = entries[entries.length - 1].startTime;
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
          lcp = lcpValue;

          // CLS
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
          cls = clsValue;

          // TBT (approximate)
          let tbtValue = 0;
          const tbtObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (entry.name === 'longtask') {
                tbtValue += entry.duration;
              }
            }
          });
          tbtObserver.observe({ type: 'longtask', buffered: true });
          tbt = tbtValue;
        } catch (e) {}
      }

      return {
        domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.navigationStart : null,
        load: nav ? nav.loadEventEnd - nav.navigationStart : null,
        firstContentfulPaint: fcp,
        largestContentfulPaint: lcp,
        cumulativeLayoutShift: cls,
        totalBlockingTime: tbt,
      };
    });

    if (!metrics) {
      throw new Error('No navigation performance metrics available!');
    }

    console.log('--- Playwright Performance Metrics ---');
    console.log('DOMContentLoaded:', metrics.domContentLoaded, 'ms');
    console.log('Load Event:', metrics.load, 'ms');
    console.log('First Contentful Paint (FCP):', metrics.firstContentfulPaint, 'ms');
    console.log('Largest Contentful Paint (LCP):', metrics.largestContentfulPaint, 'ms');
    console.log('Cumulative Layout Shift (CLS):', metrics.cumulativeLayoutShift);
    console.log('Total Blocking Time (TBT):', metrics.totalBlockingTime, 'ms');
    console.log('--------------------------------------');

    // Compare with thresholds
    const results = {
      timestamp: new Date().toISOString(),
      metrics,
      thresholds: THRESHOLDS,
      status: {
        load: metrics.load < THRESHOLDS.load,
        domContentLoaded: metrics.domContentLoaded < THRESHOLDS.domContentLoaded,
        firstContentfulPaint: metrics.firstContentfulPaint < THRESHOLDS.firstContentfulPaint,
        largestContentfulPaint: metrics.largestContentfulPaint < THRESHOLDS.largestContentfulPaint,
        cumulativeLayoutShift: metrics.cumulativeLayoutShift < THRESHOLDS.cumulativeLayoutShift,
        totalBlockingTime: metrics.totalBlockingTime < THRESHOLDS.totalBlockingTime,
      }
    };

    // Write to file (append)
    const reportDir = path.join(__dirname, '../performance-reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }
    const resultPath = path.join(reportDir, 'performance-results.json');
    let allResults = [];
    if (fs.existsSync(resultPath)) {
      allResults = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
    }
    allResults.push(results);
    fs.writeFileSync(resultPath, JSON.stringify(allResults, null, 2));

    // Assert performance metrics
    expect(Number.isNaN(metrics.load) ? -1 : metrics.load).toBeLessThan(THRESHOLDS.load);
    expect(Number.isNaN(metrics.domContentLoaded) ? -1 : metrics.domContentLoaded).toBeLessThan(THRESHOLDS.domContentLoaded);
    if (metrics.firstContentfulPaint !== null) {
      expect(Number.isNaN(metrics.firstContentfulPaint) ? -1 : metrics.firstContentfulPaint).toBeLessThan(THRESHOLDS.firstContentfulPaint);
    }
    if (metrics.largestContentfulPaint !== null) {
      expect(Number.isNaN(metrics.largestContentfulPaint) ? -1 : metrics.largestContentfulPaint).toBeLessThan(THRESHOLDS.largestContentfulPaint);
    }
    if (metrics.cumulativeLayoutShift !== null) {
      expect(Number.isNaN(metrics.cumulativeLayoutShift) ? -1 : metrics.cumulativeLayoutShift).toBeLessThan(THRESHOLDS.cumulativeLayoutShift);
    }
    if (metrics.totalBlockingTime !== null) {
      expect(Number.isNaN(metrics.totalBlockingTime) ? -1 : metrics.totalBlockingTime).toBeLessThan(THRESHOLDS.totalBlockingTime);
    }
  });
}); 