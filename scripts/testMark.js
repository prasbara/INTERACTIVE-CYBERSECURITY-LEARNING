/**
 * Test & visual inspect the aperture mark SVG
 */
const fs = require('fs');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" fill="none">
  <!-- Outer Rounded Tech Badge -->
  <rect x="2" y="2" width="28" height="28" rx="7" fill="#1c061e" />
  
  <!-- 4 Dynamic LAPS Analytical Aperture Blades -->
  <!-- Blade N (Understand) -->
  <path d="M16,5.5 L24.5,8.5 L18.5,13.5 L16,10 Z" fill="#f4ede4" />
  <!-- Blade E (Plan) -->
  <path d="M26.5,16 L23.5,24.5 L18.5,18.5 L22,16 Z" fill="#a78bfa" />
  <!-- Blade S (Execute) -->
  <path d="M16,26.5 L7.5,23.5 L13.5,18.5 L16,22 Z" fill="#f4ede4" />
  <!-- Blade W (Review) -->
  <path d="M5.5,16 L8.5,7.5 L13.5,13.5 L10,16 Z" fill="#a78bfa" />

  <!-- Center Evidence Focus Core (Security Green) -->
  <rect x="13.5" y="13.5" width="5" height="5" rx="1.2" transform="rotate(45 16 16)" fill="#007a5a" stroke="#34d399" stroke-width="1.2"/>
  <circle cx="16" cy="16" r="1.2" fill="#ffffff" />
</svg>`;

console.log("SVG Length:", svg.length);
