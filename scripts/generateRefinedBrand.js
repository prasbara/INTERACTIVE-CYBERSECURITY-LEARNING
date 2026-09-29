/**
 * Generate High-End Vector SVG & Raster Assets for IDS Learning Lab (ESM)
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRAND_DIR = path.join(__dirname, '../public/assets/brand');
if (!fs.existsSync(BRAND_DIR)) {
  fs.mkdirSync(BRAND_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// 1. High-End Geometric Logo Mark Vectors
// Concept: Precision Faceted Threat Detection Lens & LAPS Analytical Core
// ---------------------------------------------------------------------------

function getMarkSvg(theme = 'primary') {
  const isDark = theme === 'dark';
  
  // Palette
  const p1 = isDark ? '#ffffff' : '#1c061e';   // Primary facet
  const p2 = isDark ? '#c084fc' : '#4a154b';   // Secondary facet
  const p3 = isDark ? '#e9d5ff' : '#2d0b32';   // Tertiary facet
  const green = isDark ? '#34d399' : '#007a5a'; // Security Green Emerald
  const dot = isDark ? '#1c061e' : '#ffffff';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" role="img" aria-label="IDS Learning Lab Logo">
  <title>IDS Learning Lab Mark</title>
  <!-- Faceted Detection Prism Outer Silhouette -->
  <!-- Top-North Facet (Understand) -->
  <path d="M16 2.5 L3.8 9.2 L14.5 15.5 L16 8.5 Z" fill="${p1}" />
  <path d="M16 2.5 L28.2 9.2 L17.5 15.5 L16 8.5 Z" fill="${p2}" />
  
  <!-- Lower Wings (Plan & Execute) -->
  <path d="M3.8 11.2 L14.5 17.5 L14.5 28.5 L3.8 22.2 Z" fill="${p3}" />
  <path d="M28.2 11.2 L17.5 17.5 L17.5 28.5 L28.2 22.2 Z" fill="${p1}" />

  <!-- Center Analytical Radar Diamond & Evidence Focal Node (Review & Decision) -->
  <path d="M16 11.2 L20.8 16 L16 20.8 L11.2 16 Z" fill="${green}" />
  <circle cx="16" cy="16" r="1.8" fill="${dot}" />
</svg>
`.trim();
}

function getFaviconSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
  <path d="M16 2.5 L3.8 9.2 L14.5 15.5 L16 8.5 Z" fill="#1c061e" />
  <path d="M16 2.5 L28.2 9.2 L17.5 15.5 L16 8.5 Z" fill="#4a154b" />
  <path d="M3.8 11.2 L14.5 17.5 L14.5 28.5 L3.8 22.2 Z" fill="#2d0b32" />
  <path d="M28.2 11.2 L17.5 17.5 L17.5 28.5 L28.2 22.2 Z" fill="#1c061e" />
  <path d="M16 11.2 L20.8 16 L16 20.8 L11.2 16 Z" fill="#007a5a" />
  <circle cx="16" cy="16" r="1.8" fill="#ffffff" />
</svg>
`.trim();
}

function getFullLogoSvg(theme = 'primary') {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#ffffff' : '#1c061e';
  const subColor = isDark ? '#a78bfa' : '#4a154b';
  const mark = getMarkSvg(theme);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 40" width="240" height="40" fill="none" role="img" aria-label="IDS Learning Lab">
  <title>IDS Learning Lab</title>
  <!-- Mark Symbol (32x32 placed at x=4, y=4) -->
  <g transform="translate(4, 4)">
    ${mark.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" role="img" aria-label="IDS Learning Lab Logo">', '').replace('</svg>', '')}
  </g>
  <!-- Wordmark -->
  <text x="46" y="22" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="15" font-weight="700" fill="${textColor}" letter-spacing="-0.02em">IDS <tspan font-weight="500">LEARNING LAB</tspan></text>
  <text x="46" y="32" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="8.5" font-weight="700" fill="${subColor}" letter-spacing="0.1em">LAPS–HEURISTIK WORKSTATION</text>
</svg>
`.trim();
}

// Write SVGs
fs.writeFileSync(path.join(BRAND_DIR, 'logo-mark.svg'), getMarkSvg('primary'));
fs.writeFileSync(path.join(BRAND_DIR, 'logo-mark-dark.svg'), getMarkSvg('dark'));
fs.writeFileSync(path.join(BRAND_DIR, 'logo-mark-light.svg'), getMarkSvg('primary'));
fs.writeFileSync(path.join(BRAND_DIR, 'favicon.svg'), getFaviconSvg());

fs.writeFileSync(path.join(BRAND_DIR, 'logo.svg'), getFullLogoSvg('primary'));
fs.writeFileSync(path.join(BRAND_DIR, 'logo-dark.svg'), getFullLogoSvg('dark'));
fs.writeFileSync(path.join(BRAND_DIR, 'logo-light.svg'), getFullLogoSvg('primary'));

// Also update root fallbacks
fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), getFaviconSvg());
fs.writeFileSync(path.join(__dirname, '../public/logo.svg'), getFullLogoSvg('primary'));

console.log("All vector SVGs updated successfully.");

// ---------------------------------------------------------------------------
// 2. Pure Node.js PNG Generator
// ---------------------------------------------------------------------------
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function createPngChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4);
  data.copy(buf, 8);
  const crcTarget = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(crcTarget), 8 + len);
  return buf;
}

function writeRGBAtoPng(width, height, getPixel) {
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowBytes));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + rowBytes);
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixel(x, y);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = createPngChunk('IHDR', ihdrData);
  const idatChunk = createPngChunk('IDAT', deflated);
  const iendChunk = createPngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function drawMarkPixel(x, y, size) {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 32;
  const lx = (x - cx) / scale + 16;
  const ly = (y - cy) / scale + 16;

  // Hexagon check
  const dx = Math.abs(lx - 16);
  const dy = Math.abs(ly - 16);
  if (dx > 13 || dy > 14 || (dx * 0.866 + dy * 0.5) > 13.5) {
    return [0, 0, 0, 0];
  }

  // Center core
  const distCenter = Math.sqrt((lx - 16) ** 2 + (ly - 16) ** 2);
  if (distCenter <= 2.2) {
    return [255, 255, 255, 255]; // Focal dot
  }
  if (distCenter <= 5.2) {
    return [0, 122, 90, 255]; // Security Green
  }

  // Upper facets vs Lower facets
  if (ly < 16) {
    if (lx < 16) return [28, 6, 30, 255];  // Deep purple
    return [74, 21, 75, 255];               // Purple
  } else {
    if (lx < 16) return [45, 11, 48, 255]; // Rich plum
    return [28, 6, 30, 255];               // Deep purple
  }
}

// Generate PNGs
fs.writeFileSync(path.join(BRAND_DIR, 'logo-mark.png'), writeRGBAtoPng(32, 32, (x, y) => drawMarkPixel(x, y, 32)));
fs.writeFileSync(path.join(BRAND_DIR, 'logo-mark@2x.png'), writeRGBAtoPng(64, 64, (x, y) => drawMarkPixel(x, y, 64)));

// Horizontal Logo PNGs
function drawLogoPixel(x, y, w, h) {
  if (x < 36 && y < 36) {
    return drawMarkPixel(x + 2, y + 2, 36);
  }
  return [0, 0, 0, 0];
}
fs.writeFileSync(path.join(BRAND_DIR, 'logo.png'), writeRGBAtoPng(240, 40, (x, y) => drawLogoPixel(x, y, 240, 40)));
fs.writeFileSync(path.join(BRAND_DIR, 'logo@2x.png'), writeRGBAtoPng(480, 80, (x, y) => drawLogoPixel(Math.floor(x / 2), Math.floor(y / 2), 240, 40)));

console.log("All PNG assets generated successfully.");
