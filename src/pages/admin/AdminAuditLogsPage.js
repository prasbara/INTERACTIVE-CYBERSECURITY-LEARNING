/**
 * Admin Audit Logs Page
 * Route: /admin/audit-logs
 * Security & administration trail: timestamps, actions, resources, results.
 */

import { createElement } from '../../utils/dom.js';
import { wrapAdminPage } from './AdminLayout.js';
import { getAdminAuditLogs } from '../../modules/admin/adminAuth.js';

function renderAuditLogs() {
  const content = createElement('div', { className: 'admin-audit-content' });
  const logs = getAdminAuditLogs();

  const toolbar = createElement('div', {
    className: 'admin-table-toolbar card',
    children: [
      createElement('div', {
        children: [
          createElement('h3', { text: `Audit Log Keamanan Administrasi (${logs.length} Log)` }),
          createElement('p', { text: 'Jejak audit permanen aktivitas administrator, otentikasi sesi, dan ekspor dataset penelitian.' })
        ]
      })
    ]
  });

  const tableCard = createElement('div', {
    className: 'admin-table-card card',
    children: [
      createElement('div', {
        className: 'table-responsive-wrapper',
        children: [
          createElement('table', {
            className: 'admin-data-table',
            children: [
              createElement('thead', {
                children: [
                  createElement('tr', {
                    children: [
                      createElement('th', { text: 'TIMESTAMP' }),
                      createElement('th', { text: 'ADMINISTRATOR' }),
                      createElement('th', { text: 'AKSI' }),
                      createElement('th', { text: 'KOMPONEN' }),
                      createElement('th', { text: 'STATUS' }),
                      createElement('th', { text: 'DETAIL' })
                    ]
                  })
                ]
              }),
              createElement('tbody', {
                children: logs.map(l => {
                  const tr = createElement('tr');
                  tr.appendChild(createElement('td', {
                    children: [
                      createElement('span', { className: 'text-caption', text: new Date(l.timestamp).toLocaleString('id-ID') })
                    ]
                  }));
                  tr.appendChild(createElement('td', { text: l.admin }));
                  tr.appendChild(createElement('td', {
                    children: [
                      createElement('span', { className: 'badge badge-primary', text: l.action })
                    ]
                  }));
                  tr.appendChild(createElement('td', { text: l.resource }));

                  const resBadge = l.result === 'SUCCESS' ? 'badge-success' : 'badge-danger';
                  tr.appendChild(createElement('td', {
                    children: [
                      createElement('span', { className: `badge ${resBadge}`, text: l.result })
                    ]
                  }));

                  tr.appendChild(createElement('td', {
                    children: [
                      createElement('span', { className: 'text-caption', text: l.details || '-' })
                    ]
                  }));

                  return tr;
                })
              })
            ]
          })
        ]
      })
    ]
  });

  content.appendChild(toolbar);
  content.appendChild(tableCard);
  return content;
}

export const createAdminAuditLogsPage = wrapAdminPage('audit', renderAuditLogs);
