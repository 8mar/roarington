// Runs on Vercel at deploy time.
// Copies index.html + the photos into "public" and writes images.json
// (a list of the image files, sorted 1, 2, … 10 — not 1, 10, 2).
const fs = require("fs");
const path = require("path");

const OUT = "public";
const IMG_DIR = "images";
const IMG_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, IMG_DIR), { recursive: true });

// Use the "images" folder if it exists, otherwise photos at the top level of the repo
const SRC = fs.existsSync(IMG_DIR) ? IMG_DIR : ".";
const names = fs.readdirSync(SRC)
  .filter(n => IMG_EXT.test(n) && fs.statSync(path.join(SRC, n)).isFile())
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (!names.length) throw new Error("No images found in ./images or the repo root.");

for (const n of names) fs.copyFileSync(path.join(SRC, n), path.join(OUT, IMG_DIR, n));
fs.copyFileSync("index.html", path.join(OUT, "index.html"));
fs.writeFileSync(path.join(OUT, "images.json"), JSON.stringify(names, null, 2));

console.log(`Gallery built with ${names.length} images.`);
