import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

let pageHtml = fs.readFileSync(
  path.resolve(process.cwd(), 'src/services/processing/readChaptersFromEpub.html'), 'utf8'
);

// Replace comment to replace with Epub.js with the actual Epub.js code

const epubCode = fs.readFileSync(
  path.resolve(process.cwd(), 'node_modules/epubjs/dist/epub.min.js'),
  'utf8'
);

pageHtml = pageHtml.replace(
  '// INSERT_EPUBJS_HERE',
  epubCode
);

// Using playwright, open the html file into a browser, and then read the html on page as a json
// USE PLAYWRIGHT, DO NOT USE PUPPETEER
export const readChaptersFromEpub = async (params: {
  epubUrl: string,
}): Promise<string[]> => {
  const { epubUrl } = params;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(pageHtml);
  await page.evaluate((epubUrl) => {
    (window as any).readChaptersFromEpub({
      epubUrl
    });
  }, epubUrl);

  // Read text content on the page
  // wait for 10 seconds
  let loadTextAttempts = 0
  let textContent  = ''
  while (loadTextAttempts < 10 && textContent === '') {
    textContent = await page.textContent('div') || '';
    if (!textContent) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    loadTextAttempts++
  }

  const chapters: string[] = JSON.parse(textContent)
  // Replace all whitespace with a single string

  await browser.close();

  return chapters
}




