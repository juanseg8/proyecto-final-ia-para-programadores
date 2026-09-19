import fs from 'node:fs';
import path from 'node:path';

const files = [
  'mobile/src/screens/HomeScreen.tsx',
  'mobile/src/screens/LoginScreen.tsx',
  'mobile/src/screens/EstablishmentListScreen.tsx',
  'mobile/src/screens/RegisterScreen.tsx',
  'mobile/src/screens/EstablishmentDetailScreen.tsx',
  'mobile/src/screens/EstablishmentFormScreen.tsx',
  'mobile/src/components/MapLocationPicker.tsx',
  'mobile/__tests__/EstablishmentListScreen.test.tsx',
];

const replacements = [
  ['\u00c3\u00a1', '\u00e1'],
  ['\u00c3\u00a9', '\u00e9'],
  ['\u00c3\u00ad', '\u00ed'],
  ['\u00c3\u00b3', '\u00f3'],
  ['\u00c3\u00ba', '\u00fa'],
  ['\u00c3\u00b1', '\u00f1'],
  ['\u00c3\u0081', '\u00c1'],
  ['\u00c3\u0089', '\u00c9'],
  ['\u00c3\u008d', '\u00cd'],
  ['\u00c3\u0093', '\u00d3'],
  ['\u00c3\u009a', '\u00da'],
  ['\u00c3\u0091', '\u00d1'],
  ['\u00c2\u00bf', '\u00bf'],
  ['\u00c2\u00a1', '\u00a1'],

  // Keep JSX-safe typographic symbols. Never replace these with raw < or >.
  ['\u00e2\u20ac\u00ba', '\u203a'],
  ['\u00e2\u20ac\u00b9', '\u2039'],
  ['\u00e2\u20ac\u201d', '\u2014'],
  ['\u00e2\u2020\u2019', ''],
  ['\u00e2\u2013\u00aa', ''],
  ['\u00ef\u00bc\u2039', '+'],

  // Corrupted emoji sequences currently present in the project.
  ['\u00f0\u0178\u0152\u00bf', ''],
  ['\u00f0\u0178\u201c\u008d', ''],
  ['\u00f0\u0178\u201c\u0160', ''],
  ['\u00f0\u0178\u008f\u00a0', ''],

  // Real emoji/icon glyphs that should not remain as production iconography.
  ['\u{1F33F}', ''],
  ['\u{1F4CD}', ''],
  ['\u{1F4CA}', ''],
  ['\u{1F3E0}', ''],
  ['\u{1F512}', ''],
  ['\u{1F648}', 'Ocultar'],
  ['\u{1F441}', 'Ver'],
  ['\u2709', '@'],

  // Known one-off typo created by an earlier interrupted attempt.
  ['Buen d\u00eca', 'Buen d\u00eda'],
];

let changed = 0;

for (const relativePath of files) {
  const absolutePath = path.resolve(relativePath);
  if (!fs.existsSync(absolutePath)) continue;

  let text = fs.readFileSync(absolutePath, 'utf8');
  const original = text;

  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }

  if (text !== original) {
    fs.writeFileSync(absolutePath, text, { encoding: 'utf8' });
    changed += 1;
    console.log(`Normalized: ${relativePath}`);
  }
}

console.log(`Deterministic mobile text normalization complete. Files changed: ${changed}`);
