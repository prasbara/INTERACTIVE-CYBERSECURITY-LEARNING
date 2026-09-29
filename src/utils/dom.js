/**
 * DOM Utility Helpers
 * High-performance DOM element creator supporting:
 * - attributes.className, attributes.style, attributes.dataset
 * - attributes.text / attributes.textContent
 * - attributes.html / attributes.innerHTML
 * - attributes.events = { click: fn, ... }
 * - attributes.attributes = { role: '...', ... }
 * - attributes.children = [ ... ] and/or variadic ...children arguments
 */
export function createElement(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  
  if (!attributes || typeof attributes !== 'object') {
    attributes = {};
  }

  const {
    children: attrChildren,
    text,
    textContent,
    html,
    innerHTML,
    events,
    className,
    style,
    dataset,
    attributes: innerAttrs,
    ...restAttrs
  } = attributes;

  // 1. Class name
  if (className) {
    element.className = className;
  }

  // 2. Styles
  if (style) {
    if (typeof style === 'string') {
      element.style.cssText = style;
    } else if (typeof style === 'object') {
      Object.assign(element.style, style);
    }
  }

  // 3. Dataset
  if (dataset && typeof dataset === 'object') {
    Object.assign(element.dataset, dataset);
  }

  // 4. Text content
  if (text !== undefined && text !== null) {
    element.textContent = String(text);
  } else if (textContent !== undefined && textContent !== null) {
    element.textContent = String(textContent);
  }

  // 5. HTML content
  if (html !== undefined && html !== null) {
    element.innerHTML = html;
  } else if (innerHTML !== undefined && innerHTML !== null) {
    element.innerHTML = innerHTML;
  }

  // 6. Events object: { click: fn, change: fn, input: fn, ... }
  if (events && typeof events === 'object') {
    for (const [eventName, handler] of Object.entries(events)) {
      if (typeof handler === 'function') {
        element.addEventListener(eventName, handler);
      }
    }
  }

  // 7. Inner attributes map: attributes: { role: 'main', tabindex: '-1' }
  if (innerAttrs && typeof innerAttrs === 'object') {
    for (const [attrName, attrValue] of Object.entries(innerAttrs)) {
      if (attrValue !== null && attrValue !== undefined) {
        element.setAttribute(attrName, String(attrValue));
      }
    }
  }

  // 8. Standard HTML attributes & inline on* handlers
  for (const [key, value] of Object.entries(restAttrs)) {
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (typeof value === 'boolean') {
      if (value) {
        element.setAttribute(key, '');
      } else {
        element.removeAttribute(key);
      }
    } else if (value !== null && value !== undefined) {
      if (key === 'value' && ('value' in element)) {
        element.value = value;
      } else {
        element.setAttribute(key, String(value));
      }
    }
  }

  // 9. Children: Unify attributes.children and rest parameters
  const allChildren = [];
  if (Array.isArray(attrChildren)) {
    allChildren.push(...attrChildren);
  } else if (attrChildren) {
    allChildren.push(attrChildren);
  }
  if (children && children.length > 0) {
    allChildren.push(...children);
  }

  for (const child of allChildren) {
    if (child === null || child === undefined || child === false) {
      continue;
    }
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      element.appendChild(child);
    } else if (Array.isArray(child)) {
      for (const nestedChild of child) {
        if (nestedChild instanceof Node) {
          element.appendChild(nestedChild);
        } else if (nestedChild !== null && nestedChild !== undefined && nestedChild !== false) {
          element.appendChild(document.createTextNode(String(nestedChild)));
        }
      }
    }
  }

  return element;
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitize(html) {
  if (typeof document === 'undefined') return html;
  const template = document.createElement('template');
  template.innerHTML = html;
  const scripts = template.content.querySelectorAll('script');
  scripts.forEach(s => s.remove());
  return template.innerHTML;
}
