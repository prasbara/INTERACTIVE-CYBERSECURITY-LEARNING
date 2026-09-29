/**
 * Pure Node.js PNG Generator
 * Generates transparent PNG assets for IDS Learning Lab without native binary dependencies.
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPng(width, height, drawFn) {
  // RGBA buffer: 4 bytes per pixel + 1 filter byte per row
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const color = drawFn(x, y, width, height); // returns [r, g, b, a]
      rawData[pxOffset] = color[0];
      rawData[pxOffset + 1] = color[1];
      rawData[pxOffset + 2] = color[2];
      rawData[pxOffset + 3] = color[3];
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // Helper to build chunk
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal >>> 0, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: 0
  ihdr[11] = 0; // Filter: 0
  ihdr[12] = 0; // Interlace: 0

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Color palettes
const DEEP_PURPLE = [28, 6, 30, 255];    // #1c061e
const PURPLE = [74, 21, 75, 255];        // #4a154b
const ACCENT_GREEN = [0, 122, 90, 255];  // #007a5a
const WHITE = [255, 255, 255, 255];      // #ffffff
const TRANSPARENT = [0, 0, 0, 0];

// Mark renderer: Analytical diamond hexagon with focal center node
function drawMark(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.42;

  const dx = Math.abs(x - cx);
  const dy = Math.abs(y - cy);
  const dist = Math.hypot(x - cx, y - cy);

  // Center evidence focal point (green circle with white core)
  const nodeRadius = r * 0.35;
  if (dist <= nodeRadius * 0.4) return WHITE;
  if (dist <= nodeRadius) return ACCENT_GREEN;

  // Coordinate axes
  const axisThick = Math.max(1, Math.round(w * 0.04));
  if ((dx <= axisThick && dy <= r * 0.95 && dy >= nodeRadius * 0.9) ||
      (dy <= axisThick && dx <= r * 0.95 && dx >= nodeRadius * 0.9)) {
    return PURPLE;
  }

  // Hex-diamond outer border
  const normX = dx / (r * 0.9);
  const normY = dy / r;
  const edgeDist = normX + normY * 0.65;
  if (edgeDist >= 0.88 && edgeDist <= 1.05 && dy <= r * 0.95) {
    return DEEP_PURPLE;
  }

  return TRANSPARENT;
}

// Full lockup renderer: Mark on the left, geometric bars on the right representing typography
function drawLockup(x, y, w, h) {
  const markSize = h * 0.8;
  const markXOffset = h * 0.1;
  const markYOffset = h * 0.1;

  if (x >= markXOffset && x <= markXOffset + markSize &&
      y >= markYOffset && y <= markYOffset + markSize) {
    return drawMark(x - markXOffset, y - markYOffset, markSize, markSize);
  }

  // Simulated wordmark typography bands (Deep Purple title bar & Muted subtitle bar)
  const textXStart = markSize + markXOffset + 12;
  if (x >= textXStart && x <= w * 0.88) {
    // Title row
    if (y >= h * 0.28 && y <= h * 0.52) {
      return DEEP_PURPLE;
    }
    // Subtitle row
    if (y >= h * 0.62 && y <= h * 0.74 && x <= w * 0.72) {
      return [111, 102, 112, 255]; // #6f6670
    }
  }

  return TRANSPARENT;
}

const outDir = path.resolve('public', 'assets', 'brand');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'logo-mark.png'), createPng(64, 64, drawMark));
fs.writeFileSync(path.join(outDir, 'logo-mark@2x.png'), createPng(128, 128, drawMark));
fs.writeFileSync(path.join(outDir, 'logo.png'), createPng(240, 40, drawLockup));
fs.writeFileSync(path.join(outDir, 'logo@2x.png'), createPng(480, 80, drawLockup));

console.log('✓ Successfully generated brand PNG assets in public/assets/brand/');
