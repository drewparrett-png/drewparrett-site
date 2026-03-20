#!/usr/bin/env node
/**
 * Copies images from content directories to public/images
 * so they can be served statically by Next.js.
 */

import { cpSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const CONTENT_DIR = join(process.cwd(), "content");
const PUBLIC_IMAGES_DIR = join(process.cwd(), "public", "images");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"]);

function copyImages(srcDir, destDir) {
  if (!existsSync(srcDir)) return;

  const entries = readdirSync(srcDir);
  for (const entry of entries) {
    const srcPath = join(srcDir, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyImages(srcPath, join(destDir, entry));
    } else if (IMAGE_EXTENSIONS.has(extname(entry).toLowerCase())) {
      mkdirSync(destDir, { recursive: true });
      cpSync(srcPath, join(destDir, entry));
    }
  }
}

mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
copyImages(CONTENT_DIR, PUBLIC_IMAGES_DIR);

console.log("Content images copied to public/images/");
