/**
 * Centralized Icon Component
 * 
 * Consistent 24px-grid Lucide-style vector SVG iconography.
 * Fully accessible with aria-hidden or aria-label.
 * 
 * Example:
 * const searchIcon = createIcon({ name: 'search', size: 20 });
 */

import { createElement } from '../utils/dom.js';
import { renderIcon, icons } from '../utils/icons.js';

export function createIcon({
  name = 'shield',
  size = 18,
  className = '',
  ariaLabel = '',
  ariaHidden = !ariaLabel,
  onClick = null
} = {}) {
  const container = createElement('span', {
    className: `app-icon app-icon--${name} ${className}`.trim(),
    attributes: {
      'style': `display:inline-flex;align-items:center;justify-content:center;line-height:0;vertical-align:middle;${onClick ? 'cursor:pointer;' : ''}`
    },
    html: renderIcon(name, { size, className: 'svg-icon', ariaLabel, ariaHidden }),
    events: onClick ? { click: onClick } : {}
  });

  return container;
}

export { renderIcon, icons };
export const Icon = createIcon;
export default createIcon;
