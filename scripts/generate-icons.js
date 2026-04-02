#!/usr/bin/env node
/**
 * Kotlin Master – PWA Icon Generator
 * 
 * Führe aus: node scripts/generate-icons.js
 * Benötigt: npm install sharp
 * 
 * Erstellt alle benötigten Icon-Größen aus einem SVG-Source-Icon.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const OUT_DIR = path.resolve('./public/icons');

// Kotlin Master Icon SVG (lila Hintergrund, weißes K)
const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7F52FF"/>
      <stop offset="100%" style="stop-color:#5B30E8"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <!-- K letter -->
  <text
    x="256" y="360"
    font-family="'JetBrains Mono', monospace"
    font-size="300"
    font-weight="700"
    fill="white"
    text-anchor="middle"
    dominant-baseline="auto"
  >K</text>
  <!-- Kotlin accent line -->
  <rect x="80" y="400" width="352" height="8" rx="4" fill="rgba(255,255,255,0.3)"/>
</svg>
`;

// Maskable icon (more padding for safe zone)
const MASKABLE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7F52FF"/>
      <stop offset="100%" style="stop-color:#5B30E8"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <text
    x="256" y="320"
    font-family="monospace"
    font-size="240"
    font-weight="700"
    fill="white"
    text-anchor="middle"
    dominant-baseline="auto"
  >K</text>
</svg>
`;

// Inline SVG icon (no external fonts needed)
const ICON_SVG_FILE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#7F52FF"/>
  <text x="16" y="23" font-family="monospace" font-size="20" font-weight="700" fill="white" text-anchor="middle">K</text>
</svg>`;

async function generate() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // Write SVG icon
  fs.writeFileSync(path.join(OUT_DIR, 'icon.svg'), ICON_SVG_FILE);
  console.log('✓ icon.svg geschrieben');

  // Generate PNG icons
  for (const size of SIZES) {
    const isMaskable = size === 192 || size === 512;
    const svg = isMaskable ? MASKABLE_SVG : ICON_SVG;

    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(OUT_DIR, `icon-${size}.png`));

    console.log(`✓ icon-${size}.png (${isMaskable ? 'maskable' : 'any'})`);
  }

  console.log('\n✅ Alle Icons erstellt in:', OUT_DIR);
  console.log('\nNächster Schritt: npm run build');
}

generate().catch(console.error);
