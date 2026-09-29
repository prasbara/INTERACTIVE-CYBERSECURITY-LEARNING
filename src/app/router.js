/**
 * Client-Side SPA Router
 * Supports dynamic path segments (:id), popstate handling, outlet DOM mounting,
 * and data-link interception.
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.currentParams = {};
    this.onRouteChange = null;
    this.outlet = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this.handleRoute(window.location.pathname);
      });

      // Intercept clicks on links with data-link
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-link]');
        if (link) {
          e.preventDefault();
          const href = link.getAttribute('href');
          this.navigate(href);
        }
      });
    }
  }

  setOutlet(element) {
    this.outlet = element;
  }

  init() {
    if (typeof window !== 'undefined') {
      this.handleRoute(window.location.pathname);
    }
  }

  register(path, handler) {
    this.routes.set(path, handler);
  }

  navigate(path) {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    }
    this.handleRoute(path);
  }

  _renderResult(result) {
    if (this.outlet && typeof document !== 'undefined') {
      if (result instanceof Node) {
        this.outlet.replaceChildren(result);
        if (typeof window !== 'undefined' && window.scrollTo) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  }

  handleRoute(pathname = '/') {
    // Normalization
    const path = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

    // Direct match
    if (this.routes.has(path)) {
      this.currentRoute = path;
      this.currentParams = {};
      const handler = this.routes.get(path);
      if (this.onRouteChange) this.onRouteChange(path, this.currentParams);
      const result = handler(this.currentParams);
      this._renderResult(result);
      return;
    }

    // Dynamic match (e.g. /meeting/:id or /ctf/:id)
    for (const [routePattern, handler] of this.routes.entries()) {
      const regexPattern = new RegExp('^' + routePattern.replace(/:[a-zA-Z0-9_]+/g, '([a-zA-Z0-9_-]+)') + '$');
      const match = path.match(regexPattern);

      if (match) {
        const paramNames = (routePattern.match(/:[a-zA-Z0-9_]+/g) || []).map(p => p.slice(1));
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });

        this.currentRoute = routePattern;
        this.currentParams = params;
        if (this.onRouteChange) this.onRouteChange(routePattern, params);
        const result = handler({ params, ...params });
        this._renderResult(result);
        return;
      }
    }

    // 404 Route
    if (this.routes.has('*')) {
      this.currentRoute = '*';
      this.currentParams = { path };
      if (this.onRouteChange) this.onRouteChange('*', this.currentParams);
      const result = this.routes.get('*')(this.currentParams);
      this._renderResult(result);
    }
  }

  getCurrentRoute() {
    return this.currentRoute;
  }
}

export const router = new Router();
