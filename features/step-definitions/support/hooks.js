const { Before, After } = require('@cucumber/cucumber');

let browser, page;

Before(async function() {
  const { chromium } = require('playwright');
  browser = await chromium.launch({ 
    headless: false,        // Faster than headless mode
    slowMo: 0,           // Disable delay completely
    args: [
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-gpu',    // Disable GPU for speed
      '--disable-web-security', // Disable security checks
      '--disable-features=VizDisplayCompositor', // Optimize rendering
      '--disable-extensions', // Disable extensions
      '--disable-plugins', // Disable plugins
      '--disable-background-timer-throttling', // Disable throttling
      '--disable-backgrounding-occluded-windows', // Optimize performance
      '--disable-renderer-backgrounding' // Optimize performance
    ]
  });
  page = await browser.newPage();
  this.page = page;
  
  // 🔧 Reduce timeouts for faster tests
  page.setDefaultTimeout(15000);        // Reduce to 15s
  page.setDefaultNavigationTimeout(30000); // Reduce to 30s
  
  // ✅ Add performance monitoring
  const startTime = Date.now();
  page.on('load', () => {
    console.log(`⏱️ Page loaded in ${Date.now() - startTime}ms`);
  });
  
  page.on('domcontentloaded', () => {
    console.log(`⚡ DOM ready in ${Date.now() - startTime}ms`);
  });
});

After(async function() {
  if (browser) {
    await browser.close();
  }
}); 