/**
 * Admin Service Module
 * Provides data aggregation, student management, question inspection,
 * CTF challenge metadata, analytics, and research dataset export.
 */

import { store } from '../../app/state.js';
import { REAL_CASE_CHALLENGES as ctfChallengeBank } from '../../data/ctf/realCases.js';
import { meetingsData } from '../../data/meetings.js';
import { QUESTIONS_BY_MEETING } from '../../data/questions.js';
import { getEvents } from '../analytics/eventLogger.js';
import { logAdminAction } from './adminAuth.js';

// Cohort mock data combined with active local student
export function getAdminStudentsList() {
  const localStudent = store.getState().student || {};
  const localScores = store.getState().scores || {};
  const localCtf = store.getState().ctf || {};
  const localProgress = store.getState().progress || {};

  const currentStudentEntry = {
    id: 'std_local_01',
    name: localStudent.name || 'Siswa Aktif (Local)',
    className: localStudent.className || 'XI TJKT 1',
    progressPercent: calculateLocalPercent(localProgress),
    preTestScore: localScores.pretest !== null && localScores.pretest !== undefined ? `${localScores.pretest}%` : 'Belum',
    postTestScore: localScores.posttest !== null && localScores.posttest !== undefined ? `${localScores.posttest}%` : 'Belum',
    ctfSolved: localCtf.completedChallenges ? localCtf.completedChallenges.length : 0,
    lastActive: 'Hari Ini',
    status: 'Active'
  };

  const cohortData = [
    currentStudentEntry,
    {
      id: 'std_02',
      name: 'Aditya Pratama',
      className: 'XI TJKT 1',
      progressPercent: 100,
      preTestScore: '65%',
      postTestScore: '92%',
      ctfSolved: 14,
      lastActive: 'Kemarin',
      status: 'Completed'
    },
    {
      id: 'std_03',
      name: 'Bima Satria',
      className: 'XI TJKT 1',
      progressPercent: 75,
      preTestScore: '58%',
      postTestScore: 'Belum',
      ctfSolved: 8,
      lastActive: 'Hari Ini',
      status: 'Active'
    },
    {
      id: 'std_04',
      name: 'Citra Dewi',
      className: 'XI TJKT 2',
      progressPercent: 100,
      preTestScore: '70%',
      postTestScore: '95%',
      ctfSolved: 20,
      lastActive: '2 hari lalu',
      status: 'Completed'
    },
    {
      id: 'std_05',
      name: 'Dimas Kurniawan',
      className: 'XI TJKT 2',
      progressPercent: 50,
      preTestScore: '45%',
      postTestScore: 'Belum',
      ctfSolved: 5,
      lastActive: '3 hari lalu',
      status: 'Active'
    },
    {
      id: 'std_06',
      name: 'Farhan Maulana',
      className: 'XI TJKT 2',
      progressPercent: 25,
      preTestScore: '50%',
      postTestScore: 'Belum',
      ctfSolved: 2,
      lastActive: '5 hari lalu',
      status: 'Needs Help'
    }
  ];

  return cohortData;
}

function calculateLocalPercent(progress) {
  let done = 0;
  for (let i = 1; i <= 4; i++) {
    if (progress[`meeting${i}`]) done++;
  }
  return Math.round((done / 4) * 100);
}

export function getAdminOverviewMetrics() {
  const students = getAdminStudentsList();
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active' || s.status === 'Completed').length;
  const completedStudents = students.filter(s => s.progressPercent === 100).length;
  const completionRate = Math.round((completedStudents / totalStudents) * 100);

  const preScores = students
    .map(s => parseInt(s.preTestScore, 10))
    .filter(n => !isNaN(n));
  const avgPre = preScores.length ? Math.round(preScores.reduce((a, b) => a + b, 0) / preScores.length) : 0;

  const postScores = students
    .map(s => parseInt(s.postTestScore, 10))
    .filter(n => !isNaN(n));
  const avgPost = postScores.length ? Math.round(postScores.reduce((a, b) => a + b, 0) / postScores.length) : 0;

  const totalCtfSolved = students.reduce((acc, s) => acc + s.ctfSolved, 0);

  const stage1Count = students.filter(s => s.progressPercent >= 25).length;
  const stage2Count = students.filter(s => s.progressPercent >= 50).length;
  const stage3Count = students.filter(s => s.progressPercent >= 75).length;
  const stage4Count = students.filter(s => s.progressPercent >= 100).length;

  const stageRates = {
    stage1: `${Math.round((stage1Count / totalStudents) * 100)}%`,
    stage2: `${Math.round((stage2Count / totalStudents) * 100)}%`,
    stage3: `${Math.round((stage3Count / totalStudents) * 100)}%`,
    stage4: `${Math.round((stage4Count / totalStudents) * 100)}%`
  };

  return {
    totalStudents,
    activeStudents,
    completionRate: `${completionRate}%`,
    avgPreTest: `${avgPre}%`,
    avgPostTest: `${avgPost}%`,
    totalCtfSolved,
    totalQuestions: countAllSystemQuestions(),
    totalCtfChallenges: ctfChallengeBank.length,
    stageRates
  };
}


function countAllSystemQuestions() {
  let count = 0;
  for (const list of Object.values(QUESTIONS_BY_MEETING)) {
    if (Array.isArray(list)) count += list.length;
  }
  return count;
}

export function exportResearchDataCSV(type = 'all') {
  logAdminAction('DATA_EXPORT', 'ResearchData', 'SUCCESS', `Exported dataset (${type}) as CSV`);

  const students = getAdminStudentsList();
  let csv = 'ID,Name,Class,ProgressPercent,PreTest,PostTest,CtfSolved,Status\n';
  students.forEach(s => {
    csv += `"${s.id}","${s.name}","${s.className}",${s.progressPercent},"${s.preTestScore}","${s.postTestScore}",${s.ctfSolved},"${s.status}"\n`;
  });

  downloadFile(csv, `ids_research_dataset_${type}_${Date.now()}.csv`, 'text/csv');
}

export function exportResearchDataJSON() {
  logAdminAction('DATA_EXPORT', 'ResearchData', 'SUCCESS', 'Exported full research dataset as JSON');

  const payload = {
    metadata: {
      researchTitle: 'Rancang Bangun Web Pembelajaran Interaktif Berbasis LAPS-Heuristik untuk Meningkatkan Kemampuan Berpikir Kritis Siswa SMK pada Materi IDS',
      exportedAt: new Date().toISOString(),
      schemaVersion: 2
    },
    metrics: getAdminOverviewMetrics(),
    students: getAdminStudentsList(),
    telemetryEvents: getEvents().slice(0, 100)
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  downloadFile(jsonStr, `ids_research_export_${Date.now()}.json`, 'application/json');
}

function downloadFile(content, fileName, contentType) {
  if (typeof document === 'undefined') return;
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
