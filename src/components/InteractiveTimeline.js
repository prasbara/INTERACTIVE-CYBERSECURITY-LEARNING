/**
 * Interactive Timeline Component
 * Chronological visualization of security events with clickable details and evidence tagging.
 */

import { createElement } from '../utils/dom.js';
import { addXP } from '../modules/gamification/xpSystem.js';

export function createInteractiveTimeline({
  events = [
    { time: '08:14:32', type: 'FAILED', sensor: 'sshd', title: 'Failed login user root', ip: '192.168.1.45', port: 49152, details: 'Dictionary username attack attempt #1' },
    { time: '08:14:35', type: 'FAILED', sensor: 'sshd', title: 'Failed login user admin', ip: '192.168.1.45', port: 49154, details: 'Dictionary username attack attempt #2' },
    { time: '08:14:38', type: 'FAILED', sensor: 'sshd', title: 'Failed login user test', ip: '192.168.1.45', port: 49156, details: 'Dictionary username attack attempt #3' },
    { time: '08:15:03', type: 'ALERT', sensor: 'Suricata NIDS', title: 'ET SCAN Potential SSH Brute Force', ip: '192.168.1.45', port: 22, details: 'NIDS threshold breached: 94 connection attempts in 30 seconds' },
    { time: '08:16:10', type: 'SUCCESS', sensor: 'sshd', title: 'Accepted password for user root', ip: '192.168.1.45', port: 49170, details: 'CRITICAL: Account compromise confirmed following brute-force cycle' }
  ],
  onSelectEvent = null
}) {
  const container = createElement('div', { className: 'timeline-interactive-container card' });

  const header = createElement('div', {
    className: 'timeline-header',
    children: [
      createElement('h3', { text: '⏱️ Linimasa Kejadian Insiden (Chronological Incident Stream)' }),
      createElement('span', { className: 'badge badge-subtle', text: 'Klik item untuk melihat rincian forensic' })
    ]
  });

  const timelineTrack = createElement('div', { className: 'timeline-track' });
  const detailViewer = createElement('div', {
    className: 'timeline-detail-view alert alert-info',
    style: { display: 'none' }
  });

  events.forEach((ev, idx) => {
    let badgeClass = 'badge-neutral';
    if (ev.type === 'FAILED') badgeClass = 'badge-danger';
    if (ev.type === 'ALERT') badgeClass = 'badge-warning';
    if (ev.type === 'SUCCESS') badgeClass = 'badge-success';

    const node = createElement('div', {
      className: 'timeline-node',
      children: [
        createElement('div', { className: 'timeline-dot-marker' }),
        createElement('div', {
          className: 'timeline-item-card card',
          children: [
            createElement('div', {
              className: 'timeline-meta-row',
              children: [
                createElement('span', { className: 'timeline-timestamp', text: ev.time }),
                createElement('span', { className: `badge ${badgeClass}`, text: ev.type }),
                createElement('span', { className: 'badge badge-outline', text: ev.sensor })
              ]
            }),
            createElement('h4', { className: 'timeline-event-title', text: ev.title }),
            createElement('div', {
              className: 'timeline-summary',
              children: [
                createElement('span', { text: `Sumber: ` }),
                createElement('code', { text: `${ev.ip}:${ev.port}` })
              ]
            })
          ],
          events: {
            click: () => {
              timelineTrack.querySelectorAll('.timeline-item-card').forEach(c => c.classList.remove('timeline-item-active'));
              node.querySelector('.timeline-item-card').classList.add('timeline-item-active');

              detailViewer.style.display = 'block';
              detailViewer.innerHTML = `
                <div class="detail-header-row">
                  <h4>Analisis Forensik Event [${ev.time}]</h4>
                  <span class="badge ${badgeClass}">${ev.type}</span>
                </div>
                <p><strong>Aktivitas:</strong> ${ev.title}</p>
                <p><strong>Sensor Pelapor:</strong> ${ev.sensor}</p>
                <p><strong>Alamat Sumber:</strong> <code>${ev.ip}:${ev.port}</code></p>
                <p><strong>Rincian Fakta:</strong> ${ev.details}</p>
              `;

              addXP(5, `Menganalisis Event Linimasa ${ev.time}`);
              if (onSelectEvent) onSelectEvent(ev);
            }
          }
        })
      ]
    });

    timelineTrack.appendChild(node);
  });

  container.appendChild(header);
  container.appendChild(timelineTrack);
  container.appendChild(detailViewer);

  return container;
}
