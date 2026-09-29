/**
 * File Download Utility (JSON and CSV)
 */
export function downloadJson(data, filename = 'learning_data.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  triggerDownload(blob, filename);
}

export function downloadCsv(headers, rows, filename = 'learning_data.csv') {
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map(row => row.map(escapeCsv).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

export function exportLearnerDataJSON(data, filename = 'ids_learning_lab_dataset.json') {
  downloadJson(data, filename);
}

export function exportEventsCSV(events = [], filename = 'ids_telemetry_events.csv') {
  const headers = ['id', 'timestamp', 'type', 'meetingId', 'activityId', 'payload'];
  const rows = events.map(e => [
    e.id || '',
    e.timestamp || '',
    e.type || '',
    e.meetingId || '',
    e.activityId || '',
    JSON.stringify(e.payload || {})
  ]);
  downloadCsv(headers, rows, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
