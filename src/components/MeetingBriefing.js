/**
 * Meeting Briefing Component
 * Simulates a Security Operations Center (SOC) Incident Briefing opening before diving into tasks.
 * Zero emojis, clean vector icons.
 */

import { createElement } from '../utils/dom.js';
import { createIcon } from './Icon.js';

export function createMeetingBriefing({
  host = 'SRV-APP-01',
  status = 'SUSPICIOUS',
  incidentCode = 'INC-2026-081',
  title = 'Security Incident Briefing',
  description = 'Multiple failed SSH authentication attempts have been detected targeting critical servers.',
  taskInstruction = 'Determine what is happening based on raw logs and objective evidence before deciding what mitigation action should be taken.',
  onStart = null
}) {
  const overlay = createElement('div', { className: 'soc-briefing-card card' });

  const topRow = createElement('div', {
    className: 'briefing-top-row',
    children: [
      createElement('span', { className: 'badge badge-danger', text: `STATUS: ${status}` }),
      createElement('span', { className: 'badge badge-outline', text: incidentCode }),
      createElement('span', { className: 'badge badge-primary', text: `TARGET: ${host}` })
    ]
  });

  const header = createElement('h2', {
    className: 'briefing-title',
    style: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
    children: [
      createIcon({ name: 'shield', size: 22 }),
      createElement('span', { text: title })
    ]
  });

  const desc = createElement('p', { className: 'briefing-lead', text: description });

  const taskBox = createElement('div', {
    className: 'briefing-task-box alert alert-info',
    children: [
      createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' },
        children: [
          createIcon({ name: 'target', size: 16 }),
          createElement('strong', { text: 'Misi Investigasi Anda:' })
        ]
      }),
      createElement('p', { text: taskInstruction, style: { margin: 0 } })
    ]
  });

  const startBtn = createElement('button', {
    className: 'btn btn-primary btn-lg briefing-start-btn',
    style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    children: [
      createIcon({ name: 'play', size: 16 }),
      createElement('span', { text: 'Mulai Investigasi (Start Investigation)' })
    ],
    events: {
      click: () => {
        overlay.classList.add('briefing-dismissed');
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 300);
        if (onStart) onStart();
      }
    }
  });

  overlay.appendChild(topRow);
  overlay.appendChild(header);
  overlay.appendChild(desc);
  overlay.appendChild(taskBox);
  overlay.appendChild(startBtn);

  return overlay;
}

export default createMeetingBriefing;
