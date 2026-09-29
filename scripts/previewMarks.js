/**
 * Generate visual test HTML to preview the refined brand logos
 */
const fs = require('fs');

const markA = `
<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Option A: Faceted Isometric Detection Shield with Precision Negative-Space Crosshair and Emerald Core -->
  <!-- Top Left Facet -->
  <path d="M16 2.5 L3.5 9.5 L14 15.5 L16 8 Z" fill="#1c061e" />
  <!-- Top Right Facet -->
  <path d="M16 2.5 L28.5 9.5 L18 15.5 L16 8 Z" fill="#4a154b" />
  <!-- Bottom Left Facet -->
  <path d="M3.5 12 L14 18 L14 28.5 L3.5 22.5 Z" fill="#2d0b30" />
  <!-- Bottom Right Facet -->
  <path d="M28.5 12 L18 18 L18 28.5 L28.5 22.5 Z" fill="#3b113d" />
  <!-- Center Analytical Radar Node -->
  <path d="M16 11 L21 16 L16 21 L11 16 Z" fill="#007a5a" />
  <circle cx="16" cy="16" r="2" fill="#ffffff" />
</svg>
`.trim();

const markB = `
<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Option B: Bold Modern Monolithic Hexagon with 3 Interlocking Detection Chevrons & Central Emerald Diamond -->
  <!-- Wing 1 (Top) -->
  <path d="M16 2 L29 9.5 L23.5 12.5 L16 8 L8.5 12.5 L3 9.5 Z" fill="#1c061e" />
  <!-- Wing 2 (Bottom-Right) -->
  <path d="M29 12 L29 27 L23.5 23.8 L23.5 15.2 L17 19 L17 12.5 Z" fill="#4a154b" />
  <!-- Wing 3 (Bottom-Left) -->
  <path d="M3 12 L15 12.5 L15 19 L8.5 15.2 L8.5 23.8 L3 27 Z" fill="#2e0832" />
  <!-- Center Precision Evidence Diamond -->
  <path d="M16 13 L19.5 16.5 L16 20 L12.5 16.5 Z" fill="#007a5a" />
  <circle cx="16" cy="16" r="1.5" fill="#ffffff" />
</svg>
`.trim();

const markC = `
<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Option C: Pure Technical Radar Aperture (LAPS 4 Quadrants Inward Sweep) -->
  <path d="M16 3 L27 8 L20 13 L16 7 Z" fill="#1c061e" />
  <path d="M29 16 L24 27 L19 20 L25 16 Z" fill="#4a154b" />
  <path d="M16 29 L5 24 L12 19 L16 25 Z" fill="#1c061e" />
  <path d="M3 16 L8 5 L13 12 L7 16 Z" fill="#4a154b" />
  <!-- Center Core -->
  <rect x="13.5" y="13.5" width="5" height="5" rx="1" transform="rotate(45 16 16)" fill="#007a5a" />
  <circle cx="16" cy="16" r="1.2" fill="#ffffff" />
</svg>
`.trim();

const markD = `
<svg viewBox="0 0 32 32" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Option D: Sleek Modern Geometric Shield with Interlocking "I-D-S" Data Lattice & Emerald Focal Core -->
  <!-- Outer Shield Contour -->
  <path d="M16 2.5 L28 8 V18 C28 24.5 22.8 28.8 16 30.5 C9.2 28.8 4 24.5 4 18 V8 Z" fill="#1c061e" />
  <!-- Internal Diamond Cutouts / Heuristic Channels -->
  <path d="M16 6 L25 10.5 V17.5 C25 22.2 21 25.8 16 27.5 C11 25.8 7 22.2 7 17.5 V10.5 Z" fill="#ffffff" />
  <!-- Inner Dynamic Geometric Core -->
  <path d="M16 8.5 L22.5 12 V16.5 L16 13 L9.5 16.5 V12 Z" fill="#4a154b" />
  <path d="M9.5 18.5 L16 15 L22.5 18.5 V20.5 C22.5 22.8 19.5 24.8 16 25.8 C12.5 24.8 9.5 22.8 9.5 20.5 Z" fill="#1c061e" />
  <!-- Luminous Evidence Node -->
  <circle cx="16" cy="15" r="3" fill="#007a5a" />
  <circle cx="16" cy="15" r="1.2" fill="#ffffff" />
</svg>
`.trim();

console.log("Marks generated successfully.");
