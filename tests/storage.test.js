import test from 'node:test';
import assert from 'node:assert/strict';
import { migrateState } from '../src/app/storage.js';
import { INITIAL_STATE, SCHEMA_VERSION } from '../src/types/schemas.js';

test('Storage - migrateState handles identical schema version gracefully', () => {
  const state = {
    ...INITIAL_STATE,
    metadata: { ...INITIAL_STATE.metadata, schemaVersion: SCHEMA_VERSION },
    student: { name: 'Ahmad' }
  };
  const migrated = migrateState(state);

  assert.equal(migrated.student.name, 'Ahmad');
  assert.equal(migrated.metadata.schemaVersion, SCHEMA_VERSION);
});

test('Storage - migrateState upgrades older versions and preserves student identity', () => {
  const legacy = {
    metadata: { schemaVersion: 0 },
    student: { name: 'Siti', className: 'XI TJKT 2' }
  };

  const migrated = migrateState(legacy);
  assert.equal(migrated.metadata.schemaVersion, SCHEMA_VERSION);
  assert.equal(migrated.student.name, 'Siti');
  assert.ok(migrated.progress);
  assert.ok(migrated.scores);
});
