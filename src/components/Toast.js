/**
 * Toast Notification System
 * Zero emojis, vector SVG icons.
 */

import { createElement } from '../utils/dom.js';
import { renderIcon } from '../utils/icons.js';

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = createElement('div', {
      className: 'toast-container',
      attributes: { 'aria-live': 'polite', 'aria-atomic': 'true' }
    });
    document.body.appendChild(toastContainer);
  }
}

export function showToast({ type = 'info', message, duration = 3500 }) {
  if (typeof document === 'undefined') return null;
  ensureContainer();

  const iconNameMap = {
    info: 'info',
    success: 'checkCircle',
    warning: 'alertTriangle',
    error: 'xCircle'
  };

  const iconName = iconNameMap[type] || 'info';
  const iconSvg = renderIcon(iconName, { size: 18 });

  const toast = createElement('div', {
    className: `toast toast-${type}`,
    attributes: { role: 'status' },
    style: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
    children: [
      createElement('span', { className: 'toast-icon', style: { display: 'inline-flex', flexShrink: 0 }, html: iconSvg }),
      createElement('span', { className: 'toast-message', style: { flex: 1 }, text: message }),
      createElement('button', {
        className: 'toast-close',
        attributes: { 'aria-label': 'Tutup notifikasi' },
        html: renderIcon('x', { size: 14 }),
        events: {
          click: () => removeToast(toast)
        }
      })
    ]
  });

  toastContainer.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  if (duration > 0) {
    setTimeout(() => {
      removeToast(toast);
    }, duration);
  }

  return toast;
}

function removeToast(toast) {
  if (!toast) return;
  toast.classList.remove('toast-show');
  toast.classList.add('toast-hide');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 250);
}

export default showToast;
