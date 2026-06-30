import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";

// "Moved Out" mark: two chevron strokes forming an M (blue -> purple gradient),
// converging at a shared base point, with a faint winding road in the gap —
// echoing "new place, new start" without needing fine detail at small sizes.
const markPaths = `
  <path d="M 120,380 L 120,150 L 256,290" stroke="url(#blue)" stroke-width="84" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M 392,380 L 392,150 L 256,290" stroke="url(#purple)" stroke-width="84" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M 256,300 C 240,340 270,360 250,400" stroke="white" stroke-opacity="0.35" stroke-width="8" stroke-linecap="round" fill="none"/>
`;

const gradients = `
  <linearGradient id="blue" x1="120" y1="150" x2="256" y2="380" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#3B9DFF"/>
    <stop offset="100%" stop-color="#1657D6"/>
  </linearGradient>
  <linearGradient id="purple" x1="392" y1="150" x2="256" y2="380" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#A35BFF"/>
    <stop offset="100%" stop-color="#6B2FD9"/>
  </linearGradient>
`;

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradients}</defs>
  <rect width="512" height="512" rx="112" fill="#08080C"/>
  ${markPaths}
</svg>`;

const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>${gradients}</defs>
  <rect width="512" height="512" fill="#08080C"/>
  <g transform="translate(256 256) scale(0.72) translate(-256 -256)">
    ${markPaths}
  </g>
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
