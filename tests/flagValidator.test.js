import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFlag } from '../src/modules/ctf/flagValidator.js';

test('FlagValidator - validates correct flag string regardless of surrounding whitespace', () => {
  const result = validateFlag('  FLAG{SSH_BRUTE_FORCE_DETECTED}  ');
  assert.equal(result.valid, true);
  assert.match(result.message, /ACCEPTED/);
});

test('FlagValidator - rejects empty or wrong flag', () => {
  const emptyRes = validateFlag('');
  assert.equal(emptyRes.valid, false);

  const wrongRes = validateFlag('FLAG{WRONG_FLAG}');
  assert.equal(wrongRes.valid, false);
  assert.match(wrongRes.message, /NOT VALID/);
});

test('FlagValidator - case insensitive verification check', () => {
  const lowerRes = validateFlag('flag{ssh_brute_force_detected}');
  assert.equal(lowerRes.valid, true);
});
