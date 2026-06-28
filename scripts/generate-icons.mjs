import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A84FF"/>
      <stop offset="100%" stop-color="#5E5CE6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="156" fill="none" stroke="white" stroke-width="14" opacity="0.95"/>
  <ellipse cx="256" cy="256" rx="156" ry="62" fill="none" stroke="white" stroke-width="10" opacity="0.85"/>
  <ellipse cx="256" cy="256" rx="62" ry="156" fill="none" stroke="white" stroke-width="10" opacity="0.85"/>
  <line x1="100" y1="256" x2="412" y2="256" stroke="white" stroke-width="10" opacity="0.85"/>
  <line x1="256" y1="100" x2="256" y2="412" stroke="white" stroke-width="10" opacity="0.6"/>
</svg>`;

const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0A84FF"/>
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A84FF"/>
      <stop offset="100%" stop-color="#5E5CE6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg2)"/>
  <circle cx="256" cy="256" r="120" fill="none" stroke="white" stroke-width="12" opacity="0.95"/>
  <ellipse cx="256" cy="256" rx="120" ry="48" fill="none" stroke="white" stroke-width="9" opacity="0.85"/>
  <ellipse cx="256" cy="256" rx="48" ry="120" fill="none" stroke="white" stroke-width="9" opacity="0.85"/>
</svg>`;

mkdirSync("public/icons", { recursive: true });
writeFileSync("public/icons/source.svg", svg);

const sizes = [72, 96, 128, 144, 152, 180, 192, 256, 384, 512];

async function run() {
  for (const size of sizes) {
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/icons/icon-${size}.png`);
  }
  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile("public/icons/maskable-512.png");
  await sharp(Buffer.from(maskableSvg)).resize(192, 192).png().toFile("public/icons/maskable-192.png");
  await sharp(Buffer.from(svg)).resize(180, 180).png().toFile("public/apple-touch-icon.png");
  await sharp(Buffer.from(svg)).resize(32, 32).png().toFile("public/icons/favicon-32.png");
  await sharp(Buffer.from(svg)).resize(16, 16).png().toFile("public/icons/favicon-16.png");
  console.log("Icons generated.");
}

run();
