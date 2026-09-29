/**
 * IDS Learning Lab — Brand Logo Component
 * 
 * Scalable, accessible, multi-variant vector brand system.
 * Supported variants: 'primary', 'compact', 'mark', 'light', 'dark'
 * Supported sizes: 'sm', 'md', 'lg', 'xl'
 */

import { createElement } from '../utils/dom.js';

export const BRAND_COLORS = {
  deepPurple: '#1c061e',
  purple: '#4a154b',
  purpleSoft: '#2d0b32',
  securityGreen: '#007a5a',
  securityGreenLight: '#34d399',
  warmNeutral: '#f4ede4',
  white: '#ffffff',
  accentSub: '#6b7280'
};

const SIZE_CONFIG = {
  sm: { markSize: 24, fontSize: 14, gap: 10, subSize: 8.5 },
  md: { markSize: 32, fontSize: 16, gap: 12, subSize: 9.5 },
  lg: { markSize: 42, fontSize: 20, gap: 14, subSize: 10.5 },
  xl: { markSize: 54, fontSize: 26, gap: 18, subSize: 12.5 }
};

/**
 * Generates vector SVG markup for the IDS Learning Lab mark (Faceted Detection Prism)
 * @param {Object} options
 * @param {number} options.size
 * @param {boolean} options.isDarkSurface
 */
export function getLogoMarkSvg({ size = 32, isDarkSurface = false } = {}) {
  const p1 = isDarkSurface ? '#ffffff' : '#1c061e';
  const p2 = isDarkSurface ? '#c084fc' : '#4a154b';
  const p3 = isDarkSurface ? '#e9d5ff' : '#2d0b32';
  const green = isDarkSurface ? '#34d399' : '#007a5a';
  const dot = isDarkSurface ? '#1c061e' : '#ffffff';

  return `
    <svg viewBox="0 0 32 32" width="${size}" height="${size}" fill="none" role="img" aria-label="IDS Learning Lab Logo Mark" class="brand-logo-svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;">
      <title>IDS Learning Lab Mark</title>
      <!-- Top Facets -->
      <path d="M16 2.5 L3.8 9.2 L14.5 15.5 L16 8.5 Z" fill="${p1}" />
      <path d="M16 2.5 L28.2 9.2 L17.5 15.5 L16 8.5 Z" fill="${p2}" />
      <!-- Lower Facets -->
      <path d="M3.8 11.2 L14.5 17.5 L14.5 28.5 L3.8 22.2 Z" fill="${p3}" />
      <path d="M28.2 11.2 L17.5 17.5 L17.5 28.5 L28.2 22.2 Z" fill="${p1}" />
      <!-- Center Radar Diamond & Evidence Focal Node -->
      <path d="M16 11.2 L20.8 16 L16 20.8 L11.2 16 Z" fill="${green}" />
      <circle cx="16" cy="16" r="1.8" fill="${dot}" />
    </svg>
  `.trim();
}

/**
 * Returns HTML string for brand logo
 */
export function renderBrandLogoHtml({
  variant = 'primary',
  size = 'md',
  className = '',
  showSubtitle = true
} = {}) {
  const config = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const isDarkSurface = variant === 'light' || variant === 'reverse';
  const markOnly = variant === 'mark';
  const isCompact = variant === 'compact';

  const markSvg = getLogoMarkSvg({ size: config.markSize, isDarkSurface });

  if (markOnly) {
    return `<span class="brand-logo-mark-wrap brand-logo--mark brand-logo--${size} ${className}" aria-label="IDS Learning Lab">${markSvg}</span>`;
  }

  const textColor = isDarkSurface ? '#ffffff' : '#1c061e';
  const subColor = isDarkSurface ? '#c084fc' : '#4a154b';
  const titleHtml = isCompact
    ? 'IDS'
    : `IDS <span style="font-weight:500;opacity:0.9;">LEARNING LAB</span>`;
  const subtitleText = isCompact ? 'SOC LAB' : 'LAPS–HEURISTIK WORKSTATION';

  return `
    <span class="brand-logo-content brand-logo--${variant} brand-logo--${size} ${className}" style="display:inline-flex;align-items:center;gap:${config.gap}px;text-decoration:none;user-select:none;white-space:nowrap;">
      ${markSvg}
      <span class="brand-logo-text" style="display:inline-flex;flex-direction:column;line-height:1.15;text-align:left;white-space:nowrap;">
        <span class="brand-logo-name" style="font-family:Inter,system-ui,-apple-system,sans-serif;font-weight:800;font-size:${config.fontSize}px;letter-spacing:-0.02em;color:${textColor};white-space:nowrap;">
          ${titleHtml}
        </span>
        ${showSubtitle ? `
          <span class="brand-logo-sub" style="font-family:Inter,system-ui,-apple-system,sans-serif;font-weight:700;font-size:${config.subSize}px;letter-spacing:0.12em;color:${subColor};text-transform:uppercase;white-space:nowrap;margin-top:2px;">
            ${subtitleText}
          </span>
        ` : ''}
      </span>
    </span>
  `.trim();
}

/**
 * DOM Element factory for BrandLogo
 */
export function createBrandLogo({
  variant = 'primary',
  size = 'md',
  href = null,
  className = '',
  showSubtitle = true,
  onClick = null
} = {}) {
  const tag = href ? 'a' : 'div';
  const attributes = href ? { href, 'aria-label': 'IDS Learning Lab Beranda' } : { 'aria-label': 'IDS Learning Lab' };
  
  const element = createElement(tag, {
    className: `brand-logo-container ${className}`.trim(),
    attributes,
    html: renderBrandLogoHtml({ variant, size, showSubtitle }),
    events: onClick ? { click: onClick } : {}
  });

  return element;
}

// Universal export
export const BrandLogo = createBrandLogo;
export default BrandLogo;
