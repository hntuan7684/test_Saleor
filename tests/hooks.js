// tests/hooks.js
import fs from 'fs';
import path from 'path';
import { test as base } from '@playwright/test';

export const test = base.extend({});

test.afterEach(async ({}, testInfo) => {

  if (testInfo.status !== testInfo.expectedStatus) {
    const baseName = `${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}`;

    // Rename video
    const video = testInfo.attachments.find(att => att.name === 'video');
    if (video?.path) {
      const newVideoPath = path.join(testInfo.outputDir, `${baseName}.webm`);
      fs.renameSync(video.path, newVideoPath);
      console.log('🔴 Video saved:', newVideoPath);
    }

    // Rename screenshot
    const screenshot = testInfo.attachments.find(att => att.name === 'screenshot');
    if (screenshot?.path) {
      const newScreenshotPath = path.join(testInfo.outputDir, `${baseName}.png`);
      fs.renameSync(screenshot.path, newScreenshotPath);
      console.log('📸 Screenshot saved:', newScreenshotPath);
    }
  }
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`❌ Test Failed: ${testInfo.title}`);
  }
});
