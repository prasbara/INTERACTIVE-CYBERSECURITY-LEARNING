/**
 * Input Validators
 */

export function validateStudentIdentity(data) {
  const errors = {};
  const name = (data?.name || '').trim();
  const className = (data?.className || '').trim();
  const attendanceNumber = (data?.attendanceNumber || '').trim();

  if (!name || name.length < 2) {
    errors.name = 'Nama lengkap minimal 2 karakter';
  }
  if (!className || className.length < 2) {
    errors.className = 'Kelas wajib diisi';
  }
  const num = parseInt(attendanceNumber, 10);
  if (isNaN(num) || num < 1 || num > 60) {
    errors.attendanceNumber = 'Nomor absen harus antara 1-60';
  }

  const isValid = Object.keys(errors).length === 0;
  const firstError = Object.values(errors)[0] || '';

  return {
    valid: isValid,
    isValid,
    error: firstError,
    errors
  };
}

export const validateIdentity = validateStudentIdentity;

export function validateReflection(text, minLength = 100) {
  const trimmed = (text || '').trim();
  const len = trimmed.length;
  const isValid = len >= minLength;

  return {
    valid: isValid,
    isValid,
    charCount: len,
    length: len,
    remaining: Math.max(0, minLength - len),
    sanitized: trimmed,
    error: isValid ? null : `Refleksi minimal ${minLength} karakter. Saat ini ${len} karakter.`
  };
}
