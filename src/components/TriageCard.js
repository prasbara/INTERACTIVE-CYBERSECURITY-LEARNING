/**
 * Triage Card Component
 * Dedicated SOC Alert triage card implementing:
 * - Alert metadata & payload
 * - 7 Infrastructure Context tabs/pills
 * - Progressive evidence reveal
 * - Decision triage buttons (TRUE_POSITIVE, FALSE_POSITIVE, NEED_MORE_EVIDENCE)
 */

import { createElement } from '../utils/dom.js';

export function createTriageCard({ triageCase, unlockedEvidence = [], onUnlockEvidence, onDecide, decision, isLocked, feedback }) {
  const container = createElement('div', {
    className: 'triage-card card',
    attributes: { 'data-triage-id': triageCase.id }
  });

  const alertHeader = createElement('div', {
    className: 'triage-header',
    children: [
      createElement('div', {
        className: 'triage-alert-meta',
        children: [
          createElement('span', { className: `badge badge-severity-${triageCase.alert.severity?.toLowerCase() || 'high'}`, text: `Severity: ${triageCase.alert.severity}` }),
          createElement('span', { className: 'badge badge-subtle', text: triageCase.alert.sensor || 'NIDS-Suricata' }),
          createElement('span', { className: 'badge badge-outline', text: triageCase.id })
        ]
      }),
      createElement('h3', { className: 'triage-alert-name', text: triageCase.alert.signature })
    ]
  });

  const detailGrid = createElement('div', {
    className: 'triage-detail-grid',
    children: [
      createElement('div', { className: 'triage-detail-item', children: [createElement('span', { className: 'detail-label', text: 'Source IP:Port' }), createElement('code', { text: `${triageCase.alert.srcIp}:${triageCase.alert.srcPort}` })] }),
      createElement('div', { className: 'triage-detail-item', children: [createElement('span', { className: 'detail-label', text: 'Destination IP:Port' }), createElement('code', { text: `${triageCase.alert.dstIp}:${triageCase.alert.dstPort}` })] }),
      createElement('div', { className: 'triage-detail-item', children: [createElement('span', { className: 'detail-label', text: 'Timestamp' }), createElement('code', { text: triageCase.alert.timestamp })] }),
      createElement('div', { className: 'triage-detail-item', children: [createElement('span', { className: 'detail-label', text: 'Protocol' }), createElement('code', { text: triageCase.alert.protocol })] })
    ]
  });

  const contextBox = createElement('div', {
    className: 'triage-context-box',
    children: [
      createElement('h4', { className: 'context-title', text: 'Konteks Insiden & Aset:' }),
      createElement('p', { text: triageCase.context })
    ]
  });

  const evidenceSection = createElement('div', { className: 'triage-evidence-section' });
  const evidenceTitle = createElement('h4', { className: 'evidence-heading', text: 'Bukti & Telemetri Tambahan:' });
  evidenceSection.appendChild(evidenceTitle);

  if (triageCase.additionalEvidence && triageCase.additionalEvidence.length > 0) {
    const evidenceList = createElement('div', { className: 'evidence-items-list' });

    triageCase.additionalEvidence.forEach((evi, idx) => {
      const isRevealed = unlockedEvidence.includes(evi.id || idx);

      const eviItem = createElement('div', {
        className: `evidence-card card ${isRevealed ? 'evidence-revealed' : 'evidence-concealed'}`,
        children: [
          createElement('div', {
            className: 'evidence-header-row',
            children: [
              createElement('span', { className: 'badge badge-subtle', text: evi.title || `Bukti ${idx + 1}` }),
              !isRevealed && !isLocked ? createElement('button', {
                className: 'btn btn-xs btn-outline',
                text: 'Buka Telemetri Ini',
                events: {
                  click: () => {
                    if (onUnlockEvidence) onUnlockEvidence(evi.id || idx);
                  }
                }
              }) : null
            ].filter(Boolean)
          }),
          isRevealed
            ? createElement('pre', {
                className: 'code-block evidence-code',
                children: [createElement('code', { text: evi.content })]
              })
            : createElement('p', { className: 'evidence-placeholder', text: 'Informasi telemetri/log host tambahan terkunci. Buka jika diperlukan untuk validasi investigasi.' })
        ]
      });

      evidenceList.appendChild(eviItem);
    });

    evidenceSection.appendChild(evidenceList);
  }

  const decisionSection = createElement('div', { className: 'triage-decision-section' });
  const decisionPrompt = createElement('h4', { className: 'decision-prompt', text: 'Tentukan Keputusan Investigasi Triage:' });
  decisionSection.appendChild(decisionPrompt);

  const buttonRow = createElement('div', { className: 'triage-btn-group' });

  const decisions = [
    { id: 'TRUE_POSITIVE', label: 'True Positive (Serangan Nyata)', variant: 'danger' },
    { id: 'FALSE_POSITIVE', label: 'False Positive (Aktivitas Sah / Normal)', variant: 'success' },
    { id: 'NEED_MORE_EVIDENCE', label: 'Butuh Bukti Tambahan', variant: 'warning' }
  ];

  decisions.forEach(d => {
    const isSelected = decision === d.id;
    const btn = createElement('button', {
      className: `btn btn-${d.variant} ${isSelected ? 'btn-active' : ''}`,
      attributes: { disabled: isLocked ? 'true' : null },
      text: d.label,
      events: {
        click: () => {
          if (!isLocked && onDecide) onDecide(d.id);
        }
      }
    });
    buttonRow.appendChild(btn);
  });

  decisionSection.appendChild(buttonRow);

  container.appendChild(alertHeader);
  container.appendChild(detailGrid);
  container.appendChild(contextBox);
  container.appendChild(evidenceSection);
  container.appendChild(decisionSection);

  if (isLocked && feedback) {
    const fbBox = createElement('div', {
      className: `alert ${feedback.isCorrect ? 'alert-success' : 'alert-warning'} triage-feedback`,
      children: [
        createElement('h4', { text: feedback.isCorrect ? 'Keputusan Tepat' : 'Keputusan Perlu Ditinjau' }),
        createElement('p', { text: feedback.explanation })
      ]
    });
    container.appendChild(fbBox);
  }

  return container;
}
