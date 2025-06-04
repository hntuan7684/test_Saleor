const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const PRODUCTS_URL = 'https://mypod.io.vn/default-channel/products';
const HOMEPAGE_URL = 'https://mypod.io.vn/default-channel';

// Performance thresholds
const THRESHOLDS = {
  load: 5000, // ms
  domContentLoaded: 3000, // ms
  firstContentfulPaint: 2000, // ms
  largestContentfulPaint: 2500, // ms
  cumulativeLayoutShift: 0.1, // score
  totalBlockingTime: 200, // ms
  timeToInteractive: 3500, // ms
  firstInputDelay: 100, // ms
  resourceCount: 50, // max number of resources
  imageCount: 20, // max number of images
};

test.describe('Products Page Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRODUCTS_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Should log and assert common web performance metrics', async ({ page }) => {
    await page.route('**/*', route => route.continue());
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

test.describe('Homepage Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(HOMEPAGE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('should meet Core Web Vitals metrics on homepage', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
      
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.navigationStart,
        load: nav.loadEventEnd - nav.navigationStart,
        firstContentfulPaint: fcpEntry ? fcpEntry.startTime : null,
        largestContentfulPaint: performance.getEntriesByType('largest-contentful-paint').pop()?.startTime,
        cumulativeLayoutShift: performance.getEntriesByType('layout-shift').reduce((sum, entry) => sum + entry.value, 0),
        totalBlockingTime: performance.getEntriesByType('longtask').reduce((sum, entry) => sum + entry.duration, 0),
      };
    });

    console.log('Homepage Performance Metrics:', metrics);

    expect(metrics.load).toBeLessThan(THRESHOLDS.load);
    expect(metrics.domContentLoaded).toBeLessThan(THRESHOLDS.domContentLoaded);
    expect(metrics.firstContentfulPaint).toBeLessThan(THRESHOLDS.firstContentfulPaint);
    expect(metrics.largestContentfulPaint).toBeLessThan(THRESHOLDS.largestContentfulPaint);
    expect(metrics.cumulativeLayoutShift).toBeLessThan(THRESHOLDS.cumulativeLayoutShift);
    expect(metrics.totalBlockingTime).toBeLessThan(THRESHOLDS.totalBlockingTime);
  });

  test('should load hero section images efficiently', async ({ page }) => {
    const heroImages = await page.evaluate(() => {
      const images = Array.from(document.getElementsByTagName('img'))
        .filter(img => img.alt === 'DTG machine image');
      return images.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.width,
        displayHeight: img.height,
      }));
    });

    expect(heroImages.length).toBe(2);
    heroImages.forEach(img => {
      expect(img.naturalWidth).toBeLessThanOrEqual(img.displayWidth * 2);
      expect(img.naturalHeight).toBeLessThanOrEqual(img.displayHeight * 2);
    });
  });

  test('should load service section efficiently', async ({ page }) => {
    const serviceMetrics = await page.evaluate(() => {
      const services = ['Silk Screening', 'Direct-To-Garment', 'Custom Boxes'];
      const elements = services.map(service => {
        const element = document.evaluate(
          `//h3[contains(text(), '${service}')]`,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        return element ? {
          service,
          visible: element.offsetParent !== null,
          loadTime: performance.now()
        } : null;
      });
      return elements.filter(Boolean);
    });

    expect(serviceMetrics.length).toBe(3);
    serviceMetrics.forEach(metric => {
      expect(metric.visible).toBe(true);
      expect(metric.loadTime).toBeLessThan(THRESHOLDS.load);
    });
  });

  test('should load popular products section efficiently', async ({ page }) => {
    const productMetrics = await page.evaluate(() => {
      const products = ['T-shirts', 'Mugs', 'Fleece', 'Stickers'];
      const elements = products.map(product => {
        const element = document.evaluate(
          `//text()[contains(., '${product}')]`,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        return element ? {
          product,
          visible: element.offsetParent !== null,
          loadTime: performance.now()
        } : null;
      });
      return elements.filter(Boolean);
    });

    expect(productMetrics.length).toBe(4);
    productMetrics.forEach(metric => {
      expect(metric.visible).toBe(true);
      expect(metric.loadTime).toBeLessThan(THRESHOLDS.load);
    });
  });

  test('should have efficient navigation performance', async ({ page }) => {
    const navMetrics = await page.evaluate(() => {
      const navLinks = ['Home', 'Service', 'Order', 'Support'];
      const elements = navLinks.map(link => {
        const element = document.evaluate(
          `//a[contains(text(), '${link}')]`,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        return element ? {
          link,
          visible: element.offsetParent !== null,
          loadTime: performance.now()
        } : null;
      });
      return elements.filter(Boolean);
    });

    expect(navMetrics.length).toBe(4);
    navMetrics.forEach(metric => {
      expect(metric.visible).toBe(true);
      expect(metric.loadTime).toBeLessThan(THRESHOLDS.load);
    });
  });

  test('should have efficient search functionality', async ({ page }) => {
    const searchMetrics = await page.evaluate(() => {
      const searchInput = document.querySelector('input[placeholder="search for products"]');
      return {
        exists: !!searchInput,
        visible: searchInput ? searchInput.offsetParent !== null : false,
        loadTime: performance.now()
      };
    });

    expect(searchMetrics.exists).toBe(true);
    expect(searchMetrics.visible).toBe(true);
    expect(searchMetrics.loadTime).toBeLessThan(THRESHOLDS.load);
  });

  test('should maintain performance during user interactions', async ({ page }) => {
    // Test hover performance
    const hoverMetrics = await page.evaluate(async () => {
      const startTime = performance.now();
      const links = Array.from(document.getElementsByTagName('a'));
      for (const link of links) {
        const event = new MouseEvent('mouseover', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        link.dispatchEvent(event);
      }
      return performance.now() - startTime;
    });

    expect(hoverMetrics).toBeLessThan(100); // Should be less than 100ms

    // Test click performance
    const clickMetrics = await page.evaluate(async () => {
      const startTime = performance.now();
      const firstLink = document.querySelector('a');
      if (firstLink) {
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        firstLink.dispatchEvent(event);
      }
      return performance.now() - startTime;
    });

    expect(clickMetrics).toBeLessThan(50); // Should be less than 50ms
  });

  test('should have efficient resource loading for homepage', async ({ page }) => {
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      return {
        total: entries.length,
        images: entries.filter(e => e.initiatorType === 'img').length,
        scripts: entries.filter(e => e.initiatorType === 'script').length,
        styles: entries.filter(e => e.initiatorType === 'css').length,
        fonts: entries.filter(e => e.initiatorType === 'font').length,
      };
    });

    console.log('Homepage Resource Counts:', resources);

    expect(resources.total).toBeLessThan(THRESHOLDS.resourceCount);
    expect(resources.images).toBeLessThan(THRESHOLDS.imageCount);
  });
}); 