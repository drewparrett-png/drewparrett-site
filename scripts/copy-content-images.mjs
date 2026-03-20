import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");
const publicDir = path.join(process.cwd(), "public", "content");

function copyImages(src, dest) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyImages(srcPath, destPath);
    } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(entry.name)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean and recopy
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true });
}
copyImages(contentDir, publicDir);
console.log("Copied content images to public/content/");
