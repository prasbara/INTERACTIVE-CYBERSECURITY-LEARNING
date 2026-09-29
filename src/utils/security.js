/**
 * Educational Flag Obfuscation & Security Helper
 * Note: In a client-side offline app, this prevents casual DevTools / Ctrl+F inspection.
 * It is not cryptographic protection.
 */
const ENCODED_FLAG = 'RkxBR3tTU0hfQlJVVEVfRk9SQ0VfREVURUNURUR9';

export function getExpectedFlag() {
  try {
    return atob(ENCODED_FLAG);
  } catch {
    return 'FLAG{SSH_BRUTE_FORCE_DETECTED}';
  }
}

export function verifyFlag(input) {
  if (!input || typeof input !== 'string') {
    return {
      valid: false,
      message: 'Masukkan kode security flag terlebih dahulu!'
    };
  }

  const clean = input.trim().toUpperCase();
  const expected = getExpectedFlag().toUpperCase();

  if (clean === expected) {
    return {
      valid: true,
      message: 'FLAG ACCEPTED — Verifikasi pola serangan berhasil dikonfirmasi!'
    };
  }

  return {
    valid: false,
    message: 'FLAG NOT VALID — Cermati kembali korelasi bukti log dan pola serangan.'
  };
}
