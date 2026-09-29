/**
 * Simple SVG / CSS Data Visualization Component
 * Visualizes traffic patterns, authentication attempts over time, and alert ratios.
 */

import { createElement } from '../utils/dom.js';

export function createTrafficChart({
  title = 'Distribusi Frekuensi Permintaan Trafik Jaringan (Requests per Minute)',
  dataPoints = [
    { label: '08:00', value: 12, baseline: 15 },
    { label: '08:05', value: 15, baseline: 15 },
    { label: '08:10', value: 13, baseline: 15 },
    { label: '08:14', value: 11, baseline: 15 },
    { label: '08:15', value: 920, baseline: 15, isAnomaly: true },
    { label: '08:20', value: 870, baseline: 15, isAnomaly: true },
    { label: '08:25', value: 940, baseline: 15, isAnomaly: true },
    { label: '08:30', value: 14, baseline: 15 }
  ]
}) {
  const container = createElement('div', { className: 'chart-container card' });

  const header = createElement('div', {
    className: 'chart-header',
    children: [
      createElement('h4', { text: title }),
      createElement('span', { className: 'badge badge-warning', text: 'Anomali Terdeteksi' })
    ]
  });

  const maxValue = Math.max(...dataPoints.map(d => d.value), 100);

  const barsGrid = createElement('div', { className: 'chart-bars-grid' });

  dataPoints.forEach(pt => {
    const heightPercent = Math.min(100, Math.max(5, Math.round((pt.value / maxValue) * 100)));

    const col = createElement('div', {
      className: 'chart-col',
      children: [
        createElement('span', { className: 'chart-val-label', text: String(pt.value) }),
        createElement('div', {
          className: 'chart-bar-slot',
          children: [
            createElement('div', {
              className: `chart-bar ${pt.isAnomaly ? 'bar-anomaly' : 'bar-normal'}`,
              style: { height: `${heightPercent}%` },
              attributes: { title: `${pt.label}: ${pt.value} reqs (Baseline: ${pt.baseline})` }
            })
          ]
        }),
        createElement('span', { className: 'chart-x-label', text: pt.label })
      ]
    });

    barsGrid.appendChild(col);
  });

  const legend = createElement('div', {
    className: 'chart-legend',
    children: [
      createElement('div', { className: 'legend-item', html: '<span class="legend-box box-normal"></span> Normal Traffic (Baseline)' }),
      createElement('div', { className: 'legend-item', html: '<span class="legend-box box-anomaly"></span> Spike Anomaly (&gt;50x)' })
    ]
  });

  container.appendChild(header);
  container.appendChild(barsGrid);
  container.appendChild(legend);

  return container;
}
