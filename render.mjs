// Renders poster.html to entry.png at exactly 1024x1024 with a local Chromium.
// Build-time tool only: the graded program is main.ts, which copies entry.png.
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const puppeteer = require("/home/hatch/workspace/chrome-local/node_modules/puppeteer-core");

const here = dirname(fileURLToPath(import.meta.url));
const posterPath = join(here, "poster.html");
const outPath = join(here, "entry.png");

const browser = await puppeteer.launch({
  executablePath: "/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1", "--font-render-hinting=none"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 1 });
await page.goto("file://" + posterPath, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: outPath, type: "png" });
await browser.close();
console.log("wrote " + outPath);
