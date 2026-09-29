/**
 * Onboarding Page
 * Explains how the LAPS-Heuristik method works, the role of SOC Analyst, and platform guidelines.
 */

import { createElement } from '../utils/dom.js';
import { store } from '../app/state.js';
import { router } from '../app/router.js';
import { logEvent } from '../modules/analytics/eventLogger.js';

export function createOnboardingPage() {
  const container = createElement('div', { className: 'onboarding-page page-container' });

  const card = createElement('div', { className: 'onboarding-card card' });

  const title = createElement('h2', { text: 'Panduan Metode LAPS–Heuristik' });
  const lead = createElement('p', {
    className: 'onboarding-lead',
    text: 'Dalam platform ini, Anda akan bertindak layaknya seorang Junior SOC Analyst (Security Operations Center). Anda tidak sekadar menghafal definisi, melainkan memecahkan masalah keamanan siber secara kritis menggunakan 4 tahapan LAPS-Heuristik:'
  });

  const stepsList = createElement('div', {
    className: 'onboarding-steps-list',
    children: [
      createElement('div', {
        className: 'step-item',
        children: [
          createElement('div', { className: 'step-num', text: '1' }),
          createElement('div', {
            className: 'step-content',
            children: [
              createElement('h4', { text: 'Memahami Masalah (Understand)' }),
              createElement('p', { text: 'Pertanyaan Heuristik: "Apa masalahnya?" — Anda akan menelaah log IDS mentah, mengidentifikasi anomali, serta membedakan fakta log dari asumsi awal.' })
            ]
          })
        ]
      }),
      createElement('div', {
        className: 'step-item',
        children: [
          createElement('div', { className: 'step-num', text: '2' }),
          createElement('div', {
            className: 'step-content',
            children: [
              createElement('h4', { text: 'Merencanakan Pemecahan (Plan)' }),
              createElement('p', { text: 'Pertanyaan Heuristik: "Adakah alternatif pemecahan masalah?" — Membandingkan penempatan NIDS vs HIDS, serta pendekatan Signature-based vs Anomaly-based beserta trade-off performanya.' })
            ]
          })
        ]
      }),
      createElement('div', {
        className: 'step-item',
        children: [
          createElement('div', { className: 'step-num', text: '3' }),
          createElement('div', {
            className: 'step-content',
            children: [
              createElement('h4', { text: 'Melaksanakan Rencana (Execute)' }),
              createElement('p', { text: 'Pertanyaan Heuristik: "Bagaimana sebaiknya mengerjakannya?" — Melakukan triase alert SOC, mengkorelasikan telemetri jaringan dengan 7 konteks, dan menentukan True Positive / False Positive.' })
            ]
          })
        ]
      }),
      createElement('div', {
        className: 'step-item',
        children: [
          createElement('div', { className: 'step-num', text: '4' }),
          createElement('div', {
            className: 'step-content',
            children: [
              createElement('h4', { text: 'Meninjau Kembali (Review)' }),
              createElement('p', { text: 'Pertanyaan Heuristik: "Apakah solusi ini tepat?" — Mengikuti Blue Team CTF Challenge, memvalidasi bukti digital linimasa insiden, dan menuliskan refleksi kritis diri.' })
            ]
          })
        ]
      })
    ]
  });

  const btnRow = createElement('div', {
    className: 'onboarding-btn-row',
    children: [
      createElement('button', {
        className: 'btn btn-primary btn-lg',
        text: 'Saya Siap! Lanjut ke Dashboard',
        events: {
          click: () => {
            store.setState({ onboardingCompleted: true });
            logEvent('onboarding_completed');
            router.navigate('/dashboard');
          }
        }
      })
    ]
  });

  card.appendChild(title);
  card.appendChild(lead);
  card.appendChild(stepsList);
  card.appendChild(btnRow);

  container.appendChild(card);
  return container;
}
