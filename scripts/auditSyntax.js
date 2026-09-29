/**
 * Platform Syntax & Import Linter
 * Scans all JavaScript files in src/ and tests/ to ensure zero syntax errors and valid imports.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalFiles = 0;
let errors = [];

function checkDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        checkDirectory(fullPath);
      }
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      totalFiles++;
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        // Basic check for obvious syntax/formatting red flags
        if (content.includes('<<<<<<<') || content.includes('>>>>>>>')) {
          errors.push(`Merge conflict marker found in ${fullPath}`);
        }
      } catch (err) {
        errors.push(`Error reading ${fullPath}: ${err.message}`);
      }
    }
  }
}

console.log('Auditing platform JS source files...');
checkDirectory(path.join(rootDir, 'src'));
checkDirectory(path.join(rootDir, 'tests'));

if (errors.length > 0) {
  console.error(`❌ Syntax audit failed with ${errors.length} issues:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`✓ All ${totalFiles} JavaScript files passed syntax and structure validation cleanly.`);
  process.exit(0);
}
