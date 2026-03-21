import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import process from "node:process";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "app_dist");
const exportsDir = path.join(rootDir, "exports");
const outputPath = path.join(exportsDir, "rtse-presentation.pdf");
const host = "127.0.0.1";
const port = 4174;

function run(command: string, args: string[], cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

function contentType(filePath: string) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".ttf")) return "font/ttf";
  return "application/octet-stream";
}

async function serveFile(reqPath: string) {
  const sanitized = decodeURIComponent(reqPath.split("?")[0]);
  const relative = sanitized === "/" ? "/index.html" : sanitized;
  const filePath = path.join(distDir, relative);
  const resolved = path.resolve(filePath);

  if (!resolved.startsWith(path.resolve(distDir))) {
    throw new Error("path traversal blocked");
  }

  const fileStat = await stat(resolved);
  if (fileStat.isDirectory()) {
    const nested = path.join(resolved, "index.html");
    return {
      body: await readFile(nested),
      type: contentType(nested),
    };
  }

  return {
    body: await readFile(resolved),
    type: contentType(resolved),
  };
}

async function main() {
  await run("bun", ["run", "build"], rootDir);

  const server = createServer(async (req, res) => {
    try {
      const { body, type } = await serveFile(req.url ?? "/");
      res.writeHead(200, { "Content-Type": type });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve());
  });

  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    });

    await page.goto(`http://${host}:${port}/?print=1`, {
      waitUntil: "networkidle",
    });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: outputPath,
      width: "13.333in",
      height: "7.5in",
      scale: 1,
      margin: { top: "0in", right: "0in", bottom: "0in", left: "0in" },
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log(`PDF written to ${outputPath}`);
  } finally {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
