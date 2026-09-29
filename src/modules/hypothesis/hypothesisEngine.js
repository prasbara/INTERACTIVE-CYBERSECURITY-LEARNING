/**
 * Hypothesis Engine
 * Facilitates the LAPS-Heuristik "Memahami Masalah" and "Merencanakan" scientific hypothesis formation.
 * Evaluates relationship between chosen hypothesis and supporting evidence items.
 */

import { store } from '../../app/state.js';
import { logEvent } from '../analytics/eventLogger.js';
import { addXP } from '../gamification/xpSystem.js';

export const HYPOTHESIS_OPTIONS_M1 = [
  { id: 'brute_force', label: 'Brute-force / Dictionary Attack pada port SSH' },
  { id: 'normal_failure', label: 'Kegagalan otentikasi pengguna normal / lupa password' },
  { id: 'misconfigured_app', label: 'Aplikasi internal salah konfigurasi kredensial' },
  { id: 'port_scanning', label: 'Pemindaian port acak tanpa intensi eksploitasi' },
  { id: 'insufficient_evidence', label: 'Bukti log masih terlalu minim untuk ditarik kesimpulan' }
];

export const EVIDENCE_CHECKLIST_M1 = [
  { id: 'evi_freq', label: 'Terjadi berkali-kali dalam hitungan detik (frekuensi tinggi)', supports: ['brute_force'] },
  { id: 'evi_ip', label: 'Berasal dari alamat IP sumber eksternal yang sama persis', supports: ['brute_force', 'port_scanning'] },
  { id: 'evi_users', label: 'Mencoba variasi username umum berturut-turut (root, admin, test)', supports: ['brute_force'] },
  { id: 'evi_success', label: 'Terdapat catatan login sukses setelah puluhan kali gagal', supports: ['brute_force'] },
  { id: 'evi_single_user', label: 'Hanya mencoba 1 akun staf tertentu dengan jeda waktu panjang', supports: ['normal_failure'] }
];

export function submitHypothesis(meetingId, hypothesisId, selectedEvidenceIds = [], reasoningText = '') {
  const isBruteForce = hypothesisId === 'brute_force';
  const hasFreq = selectedEvidenceIds.includes('evi_freq');
  const hasUsers = selectedEvidenceIds.includes('evi_users');
  const hasIp = selectedEvidenceIds.includes('evi_ip');

  let quality = 'Developing';
  let feedback = '';

  if (isBruteForce && hasFreq && hasUsers) {
    quality = 'Strong';
    feedback = 'Penalaran Sangat Kuat! Hipotesis serangan Brute-Force didukung penuh oleh bukti frekuensi kegagalan ekstrem dan permutasi username umum berurutan.';
  } else if (isBruteForce && (hasFreq || hasUsers || hasIp)) {
    quality = 'Moderate';
    feedback = 'Hipotesis Tepat! Namun pastikan Anda juga menyertakan bukti pergantian nama pengguna (username permutation) untuk membedakannya dari sekadar aplikasi yang gagal login berulang.';
  } else if (hypothesisId === 'normal_failure') {
    quality = 'Developing';
    feedback = 'Kurang Tepat. Pengguna biasa yang lupa password umumnya hanya mencoba 1-3 kali untuk akun miliknya sendiri, bukan mencoba username kamus seperti root, admin, dan test dalam tempo 2 detik.';
  } else if (hypothesisId === 'insufficient_evidence') {
    quality = 'Analytical';
    feedback = 'Sikap kritis yang baik untuk berhati-hati. Namun dengan 80+ kegagalan per menit terhadap akun root/admin, pola automated brute-force sudah sangat nyata.';
  } else {
    quality = 'Developing';
    feedback = 'Periksa kembali bukti log autentikasi. Perhatikan port yang dituju (port 22) dan interval waktu antar baris log.';
  }

  const payload = {
    hypothesisId,
    selectedEvidenceIds,
    reasoningText,
    quality,
    feedback,
    submittedAt: new Date().toISOString()
  };

  const prevState = store.getState();
  store.setState({
    hypotheses: {
      ...(prevState.hypotheses || {}),
      [meetingId]: payload
    }
  });

  logEvent('hypothesis_created', { meetingId, ...payload });
  addXP(25, `Merumuskan Hipotesis (Kualitas: ${quality})`);

  return payload;
}

export function getHypothesis(meetingId) {
  return store.getState().hypotheses?.[meetingId] || null;
}
