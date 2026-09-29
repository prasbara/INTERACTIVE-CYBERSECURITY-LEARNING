/**
 * Root Application Component
 * Assembles Header, Sidebar, Main Content Outlet, and Mobile Bottom Navigation.
 */

import { createElement } from '../utils/dom.js';
import { createHeader } from '../components/Header.js';
import { createSidebar } from '../components/Sidebar.js';
import { createBottomNav } from '../components/BottomNav.js';
import { router } from './router.js';

export function createApp() {
  const root = createElement('div', { className: 'app-root' });

  const header = createHeader();
  const body = createElement('div', { className: 'app-body' });

  const sidebar = createSidebar();
  const mainOutlet = createElement('main', {
    id: 'app-main',
    className: 'app-main',
    attributes: { role: 'main', tabindex: '-1' }
  });

  body.appendChild(sidebar);
  body.appendChild(mainOutlet);

  const bottomNav = createBottomNav();

  root.appendChild(header);
  root.appendChild(body);
  root.appendChild(bottomNav);

  // Set router outlet
  router.setOutlet(mainOutlet);

  // Responsive layout adaptation per route
  const updateLayoutForRoute = (route) => {
    const isNoSidebar = ['/', '/identity', '/onboarding', '/research', '/admin/login'].includes(route) || (typeof route === 'string' && route.startsWith('/admin'));
    if (isNoSidebar) {
      body.classList.add('no-sidebar');
    } else {
      body.classList.remove('no-sidebar');
    }
  };

  router.onRouteChange = (route) => {
    updateLayoutForRoute(route);
  };

  // Check current initial route
  if (typeof window !== 'undefined') {
    updateLayoutForRoute(window.location.pathname);
  }

  return root;
}
