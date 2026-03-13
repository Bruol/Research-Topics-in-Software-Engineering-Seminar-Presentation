#!/usr/bin/env bun

import { spawn } from "bun";
import { mkdir } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const root = process.cwd();
const outputDir = path.join(root, "exports");
const pdfPath = path.join(outputDir, "sica-rtse-slides.pdf");
const port = 4173;
const host = "127.0.0.1";
const url = `http://${host}:${port}/?export=pdf`;

async function waitForServer(target: string, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(target);
      if (response.ok) return;
    } catch {}
    await Bun.sleep(250);
  }
  throw new Error(`Timed out waiting for server at ${target}`);
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const server = spawn({
    cmd: ["bun", "run", "start", "--host", host, "--port", String(port)],
    cwd: root,
    stdout: "inherit",
    stderr: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });

  try {
    await waitForServer(url);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1600, height: 900 },
      deviceScaleFactor: 1,
    });

    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: pdfPath,
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      margin: {
        top: "0in",
        right: "0in",
        bottom: "0in",
        left: "0in",
      },
    });

    await browser.close();
    console.log(`\nPDF exported to ${pdfPath}\n`);
  } finally {
    server.kill();
    try {
      await server.exited;
    } catch {}
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
