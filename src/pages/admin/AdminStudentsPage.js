/**
 * Admin Student Management Page
 * Route: /admin/students
 * Cohort management, individual performance inspection, pre/post test tracking.
 */

import { createElement } from '../../utils/dom.js';
import { wrapAdminPage } from './AdminLayout.js';
import { getAdminStudentsList, exportResearchDataCSV } from '../../modules/admin/adminService.js';
import { openModal } from '../../components/Modal.js';

function renderStudents() {
  const content = createElement('div', { className: 'admin-students-content' });
  const allStudents = getAdminStudentsList();

  const tbody = createElement('tbody', {
    id: 'students-table-body',
    children: allStudents.map(student => renderStudentRow(student))
  });

  // Search & Filter Toolbar
  const searchInput = createElement('input', {
    id: 'student-search-input',
    className: 'form-input',
    attributes: { type: 'text', placeholder: 'Cari nama siswa atau kelas...' },
    events: {
      input: (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allStudents.filter(s =>
          s.name.toLowerCase().includes(query) || s.className.toLowerCase().includes(query)
        );
        tbody.innerHTML = '';
        if (filtered.length === 0) {
          tbody.appendChild(createElement('tr', {
            children: [
              createElement('td', {
                attributes: { colspan: '8' },
                className: 'text-muted text-center',
                style: { padding: '2rem' },
                text: 'Tidak ada siswa yang cocok dengan kriteria pencarian.'
              })
            ]
          }));
        } else {
          filtered.forEach(s => tbody.appendChild(renderStudentRow(s)));
        }
      }
    }
  });

  const toolbar = createElement('div', {
    className: 'admin-table-toolbar card',
    children: [
      createElement('div', {
        className: 'toolbar-search-box',
        children: [searchInput]
      }),
      createElement('div', {
        className: 'toolbar-actions',
        children: [
          createElement('button', {
            className: 'btn btn-secondary btn-sm',
            text: 'Ekspor Daftar Siswa (CSV)',
            events: {
              click: () => exportResearchDataCSV('students')
            }
          })
        ]
      })
    ]
  });

  // Table Container
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
                      createElement('th', { text: 'NAMA SISWA' }),
                      createElement('th', { text: 'KELAS' }),
                      createElement('th', { text: 'PROGRES' }),
                      createElement('th', { text: 'PRE-TEST' }),
                      createElement('th', { text: 'POST-TEST' }),
                      createElement('th', { text: 'CTF SELESAI' }),
                      createElement('th', { text: 'STATUS' }),
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

function renderStudentRow(student) {
  const tr = createElement('tr');

  tr.appendChild(createElement('td', {
    children: [
      createElement('strong', { text: student.name }),
      createElement('br'),
      createElement('span', { className: 'text-caption', text: `ID: ${student.id}` })
    ]
  }));

  tr.appendChild(createElement('td', { text: student.className }));

  tr.appendChild(createElement('td', {
    children: [
      createElement('span', { className: 'badge badge-neutral', text: `${student.progressPercent}%` })
    ]
  }));

  tr.appendChild(createElement('td', {
    children: [
      createElement('span', {
        className: student.preTestScore !== 'Belum' ? 'text-primary' : 'text-muted',
        text: student.preTestScore
      })
    ]
  }));

  tr.appendChild(createElement('td', {
    children: [
      createElement('span', {
        className: student.postTestScore !== 'Belum' ? 'text-success' : 'text-muted',
        text: student.postTestScore
      })
    ]
  }));

  tr.appendChild(createElement('td', { text: `${student.ctfSolved} Kasus` }));

  const statusBadgeClass = student.status === 'Completed' ? 'badge-success' : (student.status === 'Active' ? 'badge-primary' : 'badge-warning');
  tr.appendChild(createElement('td', {
    children: [
      createElement('span', { className: `badge ${statusBadgeClass}`, text: student.status })
    ]
  }));

  tr.appendChild(createElement('td', {
    children: [
      createElement('button', {
        className: 'btn btn-secondary btn-sm',
        text: 'Inspeksi',
        events: {
          click: () => openStudentDetailModal(student)
        }
      })
    ]
  }));

  return tr;
}

/**
 * Opens an in-depth student performance inspection modal
 */
function openStudentDetailModal(student) {
  const preNum = parseInt(student.preTestScore, 10);
  const postNum = parseInt(student.postTestScore, 10);
  let gainText = 'Belum Lengkap';
  if (!isNaN(preNum) && !isNaN(postNum) && (100 - preNum) > 0) {
    const g = ((postNum - preNum) / (100 - preNum)).toFixed(2);
    gainText = `g = ${g} (${g >= 0.7 ? 'Tinggi' : (g >= 0.3 ? 'Sedang' : 'Rendah')})`;
  }

  const modalBody = createElement('div', {
    className: 'student-detail-modal-body',
    style: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    children: [
      createElement('div', {
        className: 'detail-section card',
        style: { margin: 0, padding: '1rem' },
        children: [
          createElement('span', { className: 'badge badge-primary', text: 'PROFIL SISWA' }),
          createElement('h3', { text: student.name, style: { margin: '0.4rem 0 0.2rem' } }),
          createElement('p', { className: 'text-muted', text: `ID Registrasi: ${student.id} • Kelas: ${student.className} • Status: ${student.status}` })
        ]
      }),
      createElement('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
        children: [
          createElement('div', {
            className: 'card',
            style: { margin: 0, padding: '1rem' },
            children: [
              createElement('span', { className: 'text-caption', text: 'PROGRES KURIKULUM' }),
              createElement('h4', { text: `${student.progressPercent}% Selesai`, style: { margin: '0.25rem 0' } }),
              createElement('p', { className: 'text-caption', text: 'Berdasarkan aktivitas LAPS 1-4' })
            ]
          }),
          createElement('div', {
            className: 'card',
            style: { margin: 0, padding: '1rem' },
            children: [
              createElement('span', { className: 'text-caption', text: 'SKOR ASESMEN' }),
              createElement('h4', { text: `Pre: ${student.preTestScore} → Post: ${student.postTestScore}`, style: { margin: '0.25rem 0' } }),
              createElement('p', { className: 'text-caption', text: `Normalized Gain: ${gainText}` })
            ]
          }),
          createElement('div', {
            className: 'card',
            style: { margin: 0, padding: '1rem' },
            children: [
              createElement('span', { className: 'text-caption', text: 'KASUS CTF NYATA' }),
              createElement('h4', { text: `${student.ctfSolved} Tantangan Dipecahkan`, style: { margin: '0.25rem 0' } }),
              createElement('p', { className: 'text-caption', text: 'Investigasi insiden terverifikasi' })
            ]
          })
        ]
      }),
      createElement('div', {
        className: 'card',
        style: { margin: 0, padding: '1rem' },
        children: [
          createElement('span', { className: 'text-caption', text: 'RINGKASAN TELEMETRI & RIWAYAT AKTIVITAS' }),
          createElement('p', {
            className: 'text-muted',
            style: { fontSize: '0.85rem', margin: '0.5rem 0 0' },
            text: `Siswa aktif terakhir pada: ${student.lastActive}. Seluruh interaksi pencarian bukti, hipotesis, dan triase alert terekam secara aman pada dataset instrumen riset.`
          })
        ]
      })
    ]
  });

  openModal({
    title: `Inspeksi Capaian Siswa: ${student.name}`,
    content: modalBody,
    buttons: [
      {
        text: 'Tutup Inspeksi',
        variant: 'secondary'
      }
    ]
  });
}

export const createAdminStudentsPage = wrapAdminPage('students', renderStudents);
