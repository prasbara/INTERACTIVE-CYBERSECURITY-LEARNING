/**
 * Bottom Navigation Component
 * Optimized for mobile viewport screens (320px–767px).
 * Zero emojis, vector SVG icons.
 */

import { createElement } from '../utils/dom.js';
import { router } from '../app/router.js';
import { createIcon } from './Icon.js';

export function createBottomNav() {
  const bottomNav = createElement('nav', { className: 'bottom-nav' });

  const items = [
    { path: '/dashboard', label: 'Home', iconName: 'home' },
    { path: '/learning-path', label: 'Learning', iconName: 'bookOpen' },
    { path: '/portfolio', label: 'Portfolio', iconName: 'folderKanban' },
    { path: '/leaderboard', label: 'Leaderboard', iconName: 'trophy' },
    { path: '/profile', label: 'Profile', iconName: 'user' }
  ];

  function render() {
    bottomNav.innerHTML = '';
    const currentPath = window.location.pathname;

    items.forEach(item => {
      const isActive = currentPath === item.path;
      const btn = createElement('button', {
        className: `bottom-nav-item ${isActive ? 'active' : ''}`,
        children: [
          createIcon({ name: item.iconName, size: 20, className: 'bottom-nav-icon' }),
          createElement('span', { className: 'bottom-nav-label', text: item.label })
        ],
        events: {
          click: () => router.navigate(item.path)
        }
      });
      bottomNav.appendChild(btn);
    });
  }

  window.addEventListener('popstate', render);
  render();

  return bottomNav;
}

export default createBottomNav;
