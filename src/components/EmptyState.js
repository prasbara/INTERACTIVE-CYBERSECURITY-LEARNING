/**
 * Empty State Component
 * Vector SVG iconography, clean typography, zero emojis.
 */

import { createElement } from '../utils/dom.js';
import { renderIcon, icons } from '../utils/icons.js';

export function createEmptyState({
  icon = 'fileText',
  title = 'Belum Ada Data',
  description = '',
  actionButton = null
}) {
  let iconHtml = '';
  if (typeof icon === 'string') {
    if (icon.startsWith('<svg')) {
      iconHtml = icon;
    } else if (icons[icon]) {
      iconHtml = renderIcon(icon, { size: 40 });
    } else {
      iconHtml = renderIcon('fileText', { size: 40 });
    }
  }

  return createElement('div', {
    className: 'empty-state-card card',
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2.5rem 1.5rem'
    },
    children: [
      createElement('div', {
        className: 'empty-state-icon-wrap',
        style: {
          color: 'var(--text-muted, #6b7280)',
          marginBottom: '1rem',
          opacity: 0.8
        },
        html: iconHtml
      }),
      createElement('h3', { className: 'empty-state-title', text: title }),
      description ? createElement('p', { className: 'empty-state-desc text-muted', text: description, style: { maxWidth: '440px', margin: '0.5rem auto 0' } }) : null,
      actionButton ? createElement('div', {
        className: 'empty-state-action',
        style: { marginTop: '1.25rem' },
        children: [actionButton]
      }) : null
    ].filter(Boolean)
  });
}

export default createEmptyState;
