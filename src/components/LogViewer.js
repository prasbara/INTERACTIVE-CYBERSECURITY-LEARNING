/**
 * Interactive Log Viewer Component
 * Features:
 * - Line numbers
 * - Syntax highlighting (timestamps, IPs, usernames, failed/success events)
 * - Live keyword search and event filtering
 * - Interactive line selection / evidence marking
 * - Copy to clipboard & filter reset
 * - Centralized evidence state sync
 */

import { createElement } from '../utils/dom.js';
import { showToast } from './Toast.js';
import { store } from '../app/state.js';
import { logEvent } from '../modules/analytics/eventLogger.js';
import { addXP } from '../modules/gamification/xpSystem.js';

export function createLogViewer({
  id = 'default-log',
  title = 'Suricata & Syslog Telemetry Viewer',
  logs = [],
  rawText = '',
  canSelectEvidence = true,
  onEvidenceChange = null
}) {
  const container = createElement('div', {
    className: 'log-viewer-container card',
    attributes: { 'data-log-id': id }
  });

  const parsedLines = logs.length > 0
    ? logs
    : (rawText ? rawText.split('\n').filter(l => l.trim().length > 0) : []);

  let filterKeyword = '';
  let activeFilterTag = 'ALL';
  const state = store.getState();
  let selectedLineIndices = new Set(state.selectedEvidence?.[id] || []);

  // Header Bar
  const header = createElement('div', { className: 'log-viewer-header' });

  const titleGroup = createElement('div', {
    className: 'log-viewer-title-group',
    children: [
      createElement('span', { className: 'terminal-dot dot-red' }),
      createElement('span', { className: 'terminal-dot dot-yellow' }),
      createElement('span', { className: 'terminal-dot dot-green' }),
      createElement('span', { className: 'log-viewer-title', text: title }),
      createElement('span', { className: 'badge badge-subtle', text: `${parsedLines.length} baris log` })
    ]
  });

  const toolbarActions = createElement('div', { className: 'log-toolbar-actions' });

  const copyBtn = createElement('button', {
    className: 'btn btn-xs btn-outline',
    text: 'Salin Log',
    events: {
      click: () => {
        navigator.clipboard.writeText(parsedLines.join('\n')).then(() => {
          showToast({ type: 'success', message: 'Seluruh teks log berhasil disalin.' });
        });
      }
    }
  });

  const clearEvidenceBtn = createElement('button', {
    className: 'btn btn-xs btn-outline',
    text: 'Batal Pilih',
    events: {
      click: () => {
        selectedLineIndices.clear();
        syncEvidence();
        renderLogBody();
      }
    }
  });

  toolbarActions.appendChild(copyBtn);
  if (canSelectEvidence) toolbarActions.appendChild(clearEvidenceBtn);
  header.appendChild(titleGroup);
  header.appendChild(toolbarActions);

  // Filter Bar
  const filterBar = createElement('div', { className: 'log-filter-bar' });

  const searchInput = createElement('input', {
    className: 'form-input log-search-input',
    attributes: {
      type: 'text',
      placeholder: 'Cari IP (192.168...), user, atau kata kunci...'
    },
    events: {
      input: (e) => {
        filterKeyword = e.target.value.toLowerCase();
        renderLogBody();
      }
    }
  });

  const filterTagsRow = createElement('div', { className: 'log-filter-tags' });
  const filterPresets = [
    { label: 'Semua', value: 'ALL' },
    { label: 'Failed Login', value: 'FAILED' },
    { label: 'Port 22 (SSH)', value: '22' },
    { label: 'Alert NIDS', value: 'ALERT' }
  ];

  filterPresets.forEach(preset => {
    const btn = createElement('button', {
      className: `btn btn-xs ${activeFilterTag === preset.value ? 'btn-primary' : 'btn-outline'}`,
      text: preset.label,
      events: {
        click: () => {
          activeFilterTag = preset.value;
          filterTagsRow.querySelectorAll('button').forEach(b => b.className = 'btn btn-xs btn-outline');
          btn.className = 'btn btn-xs btn-primary';
          renderLogBody();
        }
      }
    });
    filterTagsRow.appendChild(btn);
  });

  filterBar.appendChild(searchInput);
  filterBar.appendChild(filterTagsRow);

  // Evidence Status Bar
  const evidenceStatusBar = createElement('div', { className: 'evidence-status-bar' });
  const evidenceCountText = createElement('span', {
    className: 'evidence-count-text',
    text: `${selectedLineIndices.size} baris bukti ditandai`
  });

  const saveEvidenceBtn = createElement('button', {
    className: 'btn btn-xs btn-primary',
    text: 'Tambahkan ke Evidence Board',
    events: {
      click: () => {
        if (selectedLineIndices.size === 0) {
          showToast({ type: 'warning', message: 'Pilih minimal 1 baris log untuk dijadikan bukti.' });
          return;
        }
        syncEvidence();
        addXP(10, `Menandai ${selectedLineIndices.size} Bukti Log Penting`);
        showToast({
          type: 'success',
          message: `Berhasil menambahkan ${selectedLineIndices.size} baris bukti ke Evidence Board!`
        });
      }
    }
  });

  evidenceStatusBar.appendChild(evidenceCountText);
  if (canSelectEvidence) evidenceStatusBar.appendChild(saveEvidenceBtn);

  // Log Body Pre/Code Container
  const logContentWrap = createElement('div', { className: 'log-content-wrap' });

  function renderLogBody() {
    logContentWrap.innerHTML = '';
    const table = createElement('table', { className: 'log-table' });
    const tbody = createElement('tbody');

    let visibleCount = 0;

    parsedLines.forEach((line, idx) => {
      const lower = line.toLowerCase();

      // Check keyword search
      if (filterKeyword && !lower.includes(filterKeyword)) return;

      // Check preset filters
      if (activeFilterTag === 'FAILED' && !lower.includes('failed') && !lower.includes('kegagalan')) return;
      if (activeFilterTag === '22' && !lower.includes(':22') && !lower.includes('port 22')) return;
      if (activeFilterTag === 'ALERT' && !lower.includes('alert') && !lower.includes('sig=')) return;

      visibleCount++;
      const isSelected = selectedLineIndices.has(idx);

      const row = createElement('tr', {
        className: `log-row ${isSelected ? 'log-row-selected' : ''}`,
        attributes: { 'data-line-index': idx }
      });

      const lineNumCell = createElement('td', {
        className: 'log-num-col',
        text: String(idx + 1).padStart(2, '0')
      });

      const textCell = createElement('td', {
        className: 'log-text-col',
        html: highlightLogSyntax(line)
      });

      if (canSelectEvidence) {
        row.style.cursor = 'pointer';
        row.title = isSelected ? 'Klik untuk membatalkan tanda bukti' : 'Klik untuk menandai baris ini sebagai bukti penting';
        row.addEventListener('click', () => {
          if (selectedLineIndices.has(idx)) {
            selectedLineIndices.delete(idx);
          } else {
            selectedLineIndices.add(idx);
          }
          syncEvidence();
          renderLogBody();
        });
      }

      row.appendChild(lineNumCell);
      row.appendChild(textCell);
      tbody.appendChild(row);
    });

    if (visibleCount === 0) {
      const emptyRow = createElement('tr', {
        children: [
          createElement('td', {
            attributes: { colspan: '2' },
            className: 'log-empty-cell',
            text: 'Tidak ada baris log yang cocok dengan filter pencarian saat ini.'
          })
        ]
      });
      tbody.appendChild(emptyRow);
    }

    table.appendChild(tbody);
    logContentWrap.appendChild(table);
    evidenceCountText.textContent = `${selectedLineIndices.size} baris bukti ditandai`;
  }

  function syncEvidence() {
    const selectedArray = Array.from(selectedLineIndices);
    const prev = store.getState().selectedEvidence || {};
    store.setState({
      selectedEvidence: {
        ...prev,
        [id]: selectedArray
      }
    });

    logEvent('evidence_selected', {
      logId: id,
      selectedLines: selectedArray,
      count: selectedArray.length
    });

    if (onEvidenceChange) {
      onEvidenceChange(selectedArray);
    }
  }

  container.appendChild(header);
  container.appendChild(filterBar);
  if (canSelectEvidence) container.appendChild(evidenceStatusBar);
  container.appendChild(logContentWrap);

  renderLogBody();
  return container;
}

/**
 * Syntax Highlighting Helper for Syslog / Suricata
 */
function highlightLogSyntax(raw) {
  let str = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Highlighting IP Addresses
  str = str.replace(/(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?\b)/g, '<span class="hl-ip">$1</span>');

  // Highlighting Timestamps
  str = str.replace(/(\b\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:\s*WIB)?\b|\b[A-Za-z]{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}\b)/g, '<span class="hl-time">$1</span>');

  // Highlighting Failures & Alerts
  str = str.replace(/(Failed password|Authentication Failure|ALERT|ALERT\.CRIT|Potential SSH Brute Force|ET SCAN)/gi, '<span class="hl-danger">$1</span>');

  // Highlighting Success
  str = str.replace(/(Accepted password|Accepted publickey|SUCCESS)/gi, '<span class="hl-success">$1</span>');

  // Highlighting common usernames
  str = str.replace(/(\buser\s+(?:root|admin|test|oracle|budi)\b|\bUSERNAMES=[^\s|]+)/gi, '<span class="hl-user">$1</span>');

  return str;
}
