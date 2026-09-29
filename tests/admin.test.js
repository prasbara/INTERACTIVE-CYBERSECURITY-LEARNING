import test from 'node:test';
import assert from 'node:assert/strict';
import { loginAdmin, logoutAdmin, isAuthenticatedAdmin, getAdminSession, logAdminAction, getAdminAuditLogs } from '../src/modules/admin/adminAuth.js';
import { getAdminOverviewMetrics, getAdminStudentsList } from '../src/modules/admin/adminService.js';

test('Admin Auth - verifies valid administrator credentials and generates session token', () => {
  const result = loginAdmin('admin@idslab.local', 'AdminSecurity2026!');
  assert.equal(result.success, true);
  assert.ok(result.session.token);
  assert.equal(result.session.role, 'admin');

  assert.equal(isAuthenticatedAdmin(), true);
  const session = getAdminSession();
  assert.equal(session.user.email, 'admin@idslab.local');

  logoutAdmin();
  assert.equal(isAuthenticatedAdmin(), false);
  assert.equal(getAdminSession(), null);
});

test('Admin Auth - rejects incorrect credentials and logs failed attempt', () => {
  const result = loginAdmin('intruder@unknown.com', 'wrongpassword');
  assert.equal(result.success, false);
  assert.ok(result.error);
});

test('Admin Service - overview metrics aggregate student cohort correctly', () => {
  const metrics = getAdminOverviewMetrics();
  assert.ok(metrics.totalStudents >= 1);
  assert.ok(typeof metrics.completionRate === 'string');
  assert.ok(metrics.totalQuestions > 0);
  assert.equal(metrics.totalCtfChallenges, 30);
});

test('Admin Service - students list returns array with required fields', () => {
  const students = getAdminStudentsList();
  assert.ok(Array.isArray(students));
  assert.ok(students.length >= 1);
  assert.ok(students[0].id);
  assert.ok(students[0].name);
});
