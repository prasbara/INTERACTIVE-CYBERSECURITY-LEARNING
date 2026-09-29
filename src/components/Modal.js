/**
 * Reusable Modal System
 * Provides keyboard trap, ESC close, accessible dialog structure.
 */

import { createElement } from '../utils/dom.js';
import { trapFocus } from '../utils/accessibility.js';

let activeModal = null;
let cleanupTrap = null;

export function openModal({ title, content, buttons = [] }) {
  closeModal();

  const backdrop = createElement('div', {
    className: 'modal-backdrop',
    attributes: { 'aria-hidden': 'true' }
  });

  const dialog = createElement('div', {
    className: 'modal-dialog',
    attributes: {
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'modal-title'
    }
  });

  const header = createElement('div', {
    className: 'modal-header',
    children: [
      createElement('h3', { id: 'modal-title', className: 'modal-title', text: title }),
      createElement('button', {
        className: 'modal-close',
        attributes: { 'aria-label': 'Tutup modal' },
        text: '×',
        events: { click: closeModal }
      })
    ]
  });

  const body = createElement('div', {
    className: 'modal-body',
    children: [typeof content === 'string' ? createElement('p', { text: content }) : content]
  });

  const footer = createElement('div', {
    className: 'modal-footer',
    children: buttons.map(btn => {
      return createElement('button', {
        className: `btn btn-${btn.variant || 'secondary'}`,
        text: btn.text,
        events: {
          click: () => {
            if (btn.onClick) btn.onClick();
            if (btn.autoClose !== false) closeModal();
          }
        }
      });
    })
  });

  dialog.appendChild(header);
  dialog.appendChild(body);
  if (buttons.length > 0) dialog.appendChild(footer);
  backdrop.appendChild(dialog);

  document.body.appendChild(backdrop);
  document.body.classList.add('modal-open');

  activeModal = backdrop;
  cleanupTrap = trapFocus(dialog);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleKeyDown);
  backdrop._escHandler = handleKeyDown;

  return { close: closeModal };
}

export function closeModal() {
  if (!activeModal) return;

  if (activeModal._escHandler) {
    document.removeEventListener('keydown', activeModal._escHandler);
  }
  if (cleanupTrap) {
    cleanupTrap();
    cleanupTrap = null;
  }

  if (activeModal.parentNode) {
    activeModal.parentNode.removeChild(activeModal);
  }

  document.body.classList.remove('modal-open');
  activeModal = null;
}
