/**
 * Accessibility & Keyboard Trap Helpers
 */
export function trapFocus(element) {
  const focusableEls = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusableEls.length) return () => {};

  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  firstEl.focus();

  const handleKeydown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeydown);
  return () => element.removeEventListener('keydown', handleKeydown);
}
