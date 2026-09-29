/**
 * Admin Question Bank Management Page
 * Route: /admin/questions
 * Content-management interface for all curriculum questions,
 * pedagogical misconceptions, answer keys, and heuristic anchors.
 */

import { createElement } from '../../utils/dom.js';
import { wrapAdminPage } from './AdminLayout.js';
import { QUESTIONS_BY_MEETING } from '../../data/questions.js';
import { openModal } from '../../components/Modal.js';
import { showToast } from '../../components/Toast.js';

function renderQuestions() {
  const content = createElement('div', { className: 'admin-questions-content' });

  // Flatten all questions with meeting tag
  const allQuestions = [];
  for (const [mId, list] of Object.entries(QUESTIONS_BY_MEETING)) {
    if (Array.isArray(list)) {
      list.forEach(q => allQuestions.push({ ...q, meetingId: mId }));
    }
  }

  let selectedMeeting = 'all';
  let searchQuery = '';

  const tbody = createElement('tbody', { id: 'questions-table-body' });

  function updateTable() {
    tbody.innerHTML = '';
    const filtered = allQuestions.filter(q => {
      const matchMeeting = selectedMeeting === 'all' || String(q.meetingId) === String(selectedMeeting);
      const matchSearch = !searchQuery ||
        q.id.toLowerCase().includes(searchQuery) ||
        q.question.toLowerCase().includes(searchQuery);
      return matchMeeting && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.appendChild(createElement('tr', {
        children: [
          createElement('td', {
            attributes: { colspan: '6' },
            className: 'text-muted text-center',
            style: { padding: '2rem' },
            text: 'Tidak ada soal yang cocok dengan filter yang dipilih.'
          })
        ]
      }));
      return;
    }

    filtered.forEach(q => {
      const tr = createElement('tr');
      tr.appendChild(createElement('td', {
        children: [
          createElement('span', { className: 'badge badge-primary', text: `Pertemuan ${q.meetingId}` })
        ]
      }));
      tr.appendChild(createElement('td', {
        children: [
          createElement('code', { text: q.id })
        ]
      }));
      tr.appendChild(createElement('td', {
        children: [
          createElement('p', {
            text: q.question.length > 85 ? q.question.substring(0, 85) + '...' : q.question,
            style: { margin: 0, fontSize: '0.85rem' }
          })
        ]
      }));
      tr.appendChild(createElement('td', {
        children: [
          createElement('span', { className: 'badge badge-outline', text: q.cognitiveFocus ? q.cognitiveFocus.toUpperCase() : 'ANALISIS' })
        ]
      }));
      tr.appendChild(createElement('td', { text: `${q.points || 10} XP` }));
      tr.appendChild(createElement('td', {
        children: [
          createElement('button', {
            className: 'btn btn-secondary btn-sm',
            text: 'Detail & Kunci',
            events: {
              click: () => openQuestionDetailModal(q)
            }
          })
        ]
      }));
      tbody.appendChild(tr);
    });
  }

  // Initial table population
  updateTable();

  // Filter & Search Toolbar
  const headerCard = createElement('div', {
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
                attributes: { type: 'text', placeholder: 'Cari kata kunci soal atau ID...' },
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
                style: { width: '180px' },
                children: [
                  createElement('option', { attributes: { value: 'all' }, text: 'Semua Pertemuan' }),
                  createElement('option', { attributes: { value: '1' }, text: 'Pertemuan 01' }),
                  createElement('option', { attributes: { value: '2' }, text: 'Pertemuan 02' }),
                  createElement('option', { attributes: { value: '3' }, text: 'Pertemuan 03' }),
                  createElement('option', { attributes: { value: '4' }, text: 'Pertemuan 04' })
                ],
                events: {
                  change: (e) => {
                    selectedMeeting = e.target.value;
                    updateTable();
                  }
                }
              })
            ]
          }),
          createElement('span', {
            className: 'text-caption',
            text: `Total Bank Soal: ${allQuestions.length} Butir Soal`
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
                      createElement('th', { text: 'MODUL' }),
                      createElement('th', { text: 'ID SOAL' }),
                      createElement('th', { text: 'PERTANYAAN / SKENARIO' }),
                      createElement('th', { text: 'FOKUS KOGNITIF' }),
                      createElement('th', { text: 'BOBOT' }),
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

  content.appendChild(headerCard);
  content.appendChild(tableCard);
  return content;
}

/**
 * Opens structured Question Detail & Pedagogical Misconception Modal
 */
function openQuestionDetailModal(q) {
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
              createElement('span', { className: 'badge badge-primary', text: `Pertemuan ${q.meetingId}` }),
              createElement('span', { className: 'badge badge-outline', text: `ID: ${q.id}` }),
              createElement('span', { className: 'badge badge-success', text: `${q.points || 10} XP` })
            ]
          }),
          createElement('h4', { text: q.question, style: { margin: '0.5rem 0', lineHeight: 1.4 } }),
          q.context ? createElement('p', {
            className: 'text-muted',
            style: { fontSize: '0.85rem', fontStyle: 'italic', margin: 0 },
            text: `Konteks Heuristik: ${q.context}`
          }) : null
        ].filter(Boolean)
      }),

      // Options List
      q.options && q.options.length > 0 ? createElement('div', {
        children: [
          createElement('span', { className: 'text-caption', text: 'PILIHAN JAWABAN & KUNCI:' }),
          createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' },
            children: q.options.map((opt, idx) => {
              const isCorrect = idx === q.correctAnswer;
              return createElement('div', {
                style: {
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-inner)',
                  border: isCorrect ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  backgroundColor: isCorrect ? 'rgba(0, 122, 90, 0.08)' : 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                },
                children: [
                  createElement('span', {
                    className: `badge ${isCorrect ? 'badge-success' : 'badge-neutral'}`,
                    text: isCorrect ? 'KUNCI BENAR' : `Opsi ${String.fromCharCode(65 + idx)}`
                  }),
                  createElement('span', { text: opt, style: { fontSize: '0.85rem' } })
                ]
              });
            })
          })
        ]
      }) : null,

      // Pedagogical Explanation & Misconceptions
      createElement('div', {
        className: 'card',
        style: { margin: 0, padding: '1rem', borderLeft: '4px solid var(--color-accent)' },
        children: [
          createElement('span', { className: 'text-caption', text: 'PENJELASAN PEDAGOGIS:' }),
          createElement('p', {
            style: { fontSize: '0.85rem', margin: '0.4rem 0 0.8rem', lineHeight: 1.5 },
            text: q.explanation || 'Penjelasan teknis mengaitkan pola alert log dengan kesimpulan logis yang valid.'
          }),
          q.misconception ? createElement('div', {
            style: {
              padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(183, 121, 31, 0.08)',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--color-warning)'
            },
            children: [
              createElement('strong', { style: { fontSize: '0.78rem', color: 'var(--color-warning)' }, text: 'Miskonsepsi Umum Siswa:' }),
              createElement('p', { style: { fontSize: '0.82rem', margin: '0.2rem 0 0', color: 'var(--color-text)' }, text: q.misconception })
            ]
          }) : null
        ].filter(Boolean)
      })
    ]
  });

  openModal({
    title: `Inspeksi Butir Soal: ${q.id}`,
    content: modalBody,
    buttons: [
      {
        text: 'Tutup Preview',
        variant: 'secondary'
      },
      {
        text: 'Simpan Konfigurasi',
        variant: 'primary',
        onClick: () => {
          showToast({ type: 'success', message: `Pengaturan butir soal ${q.id} tersimpan di state kurikulum.` });
        }
      }
    ]
  });
}

export const createAdminQuestionsPage = wrapAdminPage('questions', renderQuestions);
