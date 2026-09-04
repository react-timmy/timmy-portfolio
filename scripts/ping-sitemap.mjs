#!/usr/bin/env node
// Runs automatically after `npm run build` via the postbuild hook.
// 1. Rewrites public/sitemap.xml with today's lastmod date.
// 2. Pings Google to notify it of the updated sitemap.

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL =
  process.env.VITE_SITE_URL || "https://solo-devtimmy.vercel.app";
const SITEMAP_PATH = resolve(__dirname, "../public/sitemap.xml");
const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// --- 1. Update lastmod dates in sitemap.xml ---
let sitemap = readFileSync(SITEMAP_PATH, "utf-8");
sitemap = sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${TODAY}</lastmod>`);
writeFileSync(SITEMAP_PATH, sitemap, "utf-8");
console.log(`sitemap.xml lastmod updated to ${TODAY}`);

// --- 2. Ping Google ---
const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`;
console.log(`Pinging Google: ${pingUrl}`);
try {
  const res = await fetch(pingUrl);
  console.log(`Google ping status: ${res.status} ${res.statusText}`);
} catch (err) {
  console.error("Ping failed:", err.message);
  process.exit(1);
}
