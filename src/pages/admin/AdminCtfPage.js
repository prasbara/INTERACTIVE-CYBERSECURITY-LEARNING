/**
 * Admin CTF Challenge Management Page
 * Route: /admin/ctf
 * Inspects all 30 Real-Case CTF challenges, metadata, MITRE mapping, and solve rates.
 */

import { createElement } from '../../utils/dom.js';
import { wrapAdminPage } from './AdminLayout.js';
import { REAL_CASE_CHALLENGES as ctfChallengeBank } from '../../data/ctf/realCases.js';
import { openModal } from '../../components/Modal.js';

function renderCtf() {
  const content = createElement('div', { className: 'admin-ctf-content' });

  let searchQuery = '';
  let selectedCategory = 'all';

  const tbody = createElement('tbody', { id: 'ctf-table-body' });

  // Get distinct categories
  const categories = ['all', ...new Set(ctfChallengeBank.map(c => c.category).filter(Boolean))];

  function updateTable() {
    tbody.innerHTML = '';
    const filtered = ctfChallengeBank.filter(c => {
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const matchSearch = !searchQuery ||
        c.id.toLowerCase().includes(searchQuery) ||
        c.title.toLowerCase().includes(searchQuery) ||
        (c.incidentName && c.incidentName.toLowerCase().includes(searchQuery));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.appendChild(createElement('tr', {
        children: [
          createElement('td', {
            attributes: { colspan: '7' },
            className: 'text-muted text-center',
            style: { padding: '2rem' },
            text: 'Tidak ada kasus CTF yang cocok dengan filter yang dipilih.'
          })
        ]
      }));
      return;
    }

    filtered.forEach(c => {
      const tr = createElement('tr');
      tr.appendChild(createElement('td', {
        children: [createElement('code', { text: c.id })]
      }));
      tr.appendChild(createElement('td', {
        children: [
          createElement('strong', { text: c.title }),
          createElement('br'),
          createElement('span', { className: 'text-caption', text: c.incidentName || c.category })
        ]
      }));
      tr.appendChild(createElement('td', {
        children: [
          createElement('span', { className: 'badge badge-neutral', text: c.category })
        ]
      }));

      const diffBadge = c.difficulty === 'beginner'
        ? 'badge-success'
        : (c.difficulty === 'intermediate' ? 'badge-primary' : 'badge-warning');
      tr.appendChild(createElement('td', {
        children: [
          createElement('span', { className: `badge ${diffBadge}`, text: c.difficulty.toUpperCase() })
        ]
      }));

      tr.appendChild(createElement('td', {
        children: [
          createElement('span', {
            className: 'text-caption',
            text: c.publicSource?.advisory || 'CVE Advisory'
          })
        ]
      }));

      tr.appendChild(createElement('td', { text: `${c.points} XP` }));

      tr.appendChild(createElement('td', {
        children: [
          createElement('button', {
            className: 'btn btn-secondary btn-sm',
            text: 'Inspeksi Kasus',
            events: {
              click: () => openCtfCaseModal(c)
            }
          })
        ]
      }));

      tbody.appendChild(tr);
    });
  }

  // Initial table render
  updateTable();

  const toolbar = createElement('div', {
    className: 'admin-table-toolbar card',
    children: [
      createElement('div', {
        style: { display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', justifyContent: 'space-between' },
        children: [
          createElement('div', {
            style: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' },
            children: [
              createElement('input', {
                className: 'form-input',
                attributes: { type: 'text', placeholder: 'Cari judul, ID, atau insiden...' },
                style: { width: '280px' },
                events: {
                  input: (e) => {
                    searchQuery = e.target.value.toLowerCase();
                    updateTable();
                  }
                }
              }),
              createElement('select', {
                className: 'form-input',
                style: { width: '200px' },
                children: categories.map(cat => createElement('option', {
                  attributes: { value: cat },
                  text: cat === 'all' ? 'Semua Kategori' : cat
                })),
                events: {
                  change: (e) => {
                    selectedCategory = e.target.value;
                    updateTable();
                  }
                }
              })
            ]
          }),
          createElement('span', {
            className: 'text-caption',
            text: `Bank Kasus: ${ctfChallengeBank.length} Kasus Nyata Terdaftar`
          })
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
                      createElement('th', { text: 'ID KASUS' }),
                      createElement('th', { text: 'JUDUL TANTANGAN' }),
                      createElement('th', { text: 'KATEGORI' }),
                      createElement('th', { text: 'KESULITAN' }),
                      createElement('th', { text: 'SUMBER / ADVISORY' }),
                      createElement('th', { text: 'POIN' }),
                      createElement('th', { text: 'AKSI' })
                    ]
                  })
                ]
              }),
              tbody
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

/**
 * Opens CTF Challenge Case File Inspection Modal without exposing sensitive flags
 */
function openCtfCaseModal(c) {
  const modalBody = createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    children: [
      createElement('div', {
        className: 'card',
        style: { margin: 0, padding: '1rem', backgroundColor: 'var(--color-surface-soft)' },
        children: [
          createElement('div', {
            style: { display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' },
            children: [
              createElement('span', { className: 'badge badge-primary', text: c.id }),
              createElement('span', { className: 'badge badge-neutral', text: c.category }),
              createElement('span', { className: 'badge badge-success', text: `${c.points} XP` })
            ]
          }),
          createElement('h3', { text: c.title, style: { margin: '0.4rem 0' } }),
          c.incidentName ? createElement('p', {
            className: 'text-muted',
            style: { fontSize: '0.85rem', margin: 0 },
            text: `Insiden Nyata: ${c.incidentName}`
          }) : null
        ].filter(Boolean)
      }),

      // Scenario & Advisory
      createElement('div', {
        className: 'card',
        style: { margin: 0, padding: '1rem' },
        children: [
          createElement('span', { className: 'text-caption', text: 'SKENARIO KASUS INVESTIGASI:' }),
          createElement('p', {
            style: { fontSize: '0.85rem', margin: '0.4rem 0 0.8rem', lineHeight: 1.55 },
            text: c.scenario || c.narrative || 'Siswa menginvestigasi artefak forensik jaringan berbasis advisory keamanan publik.'
          }),
          c.publicSource?.advisory ? createElement('p', {
            className: 'text-caption',
            style: { margin: 0 },
            text: `Rujukan Advisory Keamanan: ${c.publicSource.advisory} (${c.publicSource.source || 'NVD/CISA'})`
          }) : null
        ].filter(Boolean)
      }),

      // Security Flag Notice
      createElement('div', {
        className: 'card',
        style: { margin: 0, padding: '1rem', borderLeft: '4px solid var(--color-accent)' },
        children: [
          createElement('span', { className: 'text-caption', text: 'POLA FLAG VERIFIKASI (SANDBOX):' }),
          createElement('p', {
            style: { fontSize: '0.85rem', margin: '0.4rem 0', fontFamily: 'var(--font-mono)' },
            text: `Format: FLAG{${c.id.toUpperCase()}_...}`
          }),
          createElement('p', {
            className: 'text-caption',
            style: { margin: 0 },
            text: 'Keamanan: Nilai flag dienkapsulasi dan diverifikasi pada modul flagValidator di client sandbox.'
          })
        ]
      })
    ]
  });

  openModal({
    title: `Berkas Kasus CTF: ${c.id}`,
    content: modalBody,
    buttons: [
      {
        text: 'Tutup Berkas',
        variant: 'secondary'
      }
    ]
  });
}

export const createAdminCtfPage = wrapAdminPage('ctf', renderCtf);
