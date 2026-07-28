// app/scripts/check-tokens.mjs
//
// 디자인 토큰 가드.
//   1) theme/ 밖에서 헥사 색상값을 직접 쓰는 곳
//   2) 그림자(shadow* / elevation)를 쓰는 곳  ← 시안 규칙: 그림자 금지
//
// 실행:  npm run check:tokens
// 예외:  해당 줄 끝에 `// tokens-ok` 를 붙이면 건너뛴다 (남용 금지)

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

// 검사 대상 폴더 (app/ 기준 상대 경로)
const SCAN_DIRS = ['src', 'app'];

// 통째로 건너뛸 폴더
const SKIP_DIRS = new Set([
  'node_modules',
  '.expo',
  '.git',
  'dist',
  'build',
  'android',
  'ios',
  'scripts',
]);

// 토큰 정의 파일 — 여기서는 헥사값이 정상이다
const ALLOW_PREFIXES = [path.join('src', 'theme')];

const EXTS = new Set(['.ts', '.tsx']);

const RULES = [
  {
    id: 'hex',
    // #RGB / #RRGGBB / #RRGGBBAA
    re: /#[0-9A-Fa-f]{8}\b|#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/,
    label: '토큰 밖 헥사 색상값',
    hint: "src/theme 에서 import 해서 쓰세요.  import { colors } from '../theme'",
  },
  {
    id: 'shadow',
    re: /\b(shadowColor|shadowOffset|shadowOpacity|shadowRadius|elevation)\b/,
    label: '그림자 속성',
    hint: '깊이는 면 + 아웃라인으로만 냅니다. borderWidth.default + colors.borderStrong 조합을 쓰세요.',
  },
];

/** @returns {string[]} 검사 대상 파일 경로 목록 */
function walk(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc; // 폴더가 없으면 조용히 넘어간다
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, acc);
    } else if (EXTS.has(path.extname(entry.name))) {
      acc.push(full);
    }
  }
  return acc;
}

function isAllowed(relPath) {
  return ALLOW_PREFIXES.some((prefix) => relPath.startsWith(prefix));
}

const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
const violations = [];

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('tokens-ok')) continue;

    for (const rule of RULES) {
      // 헥사 규칙만 theme/ 를 면제한다. 그림자는 어디서도 금지.
      if (rule.id === 'hex' && isAllowed(rel)) continue;
      if (!rule.re.test(line)) continue;

      violations.push({
        rule,
        file: rel,
        line: i + 1,
        text: line.trim(),
      });
    }
  }
}

if (violations.length === 0) {
  console.log(`✅ 토큰 검사 통과 (${files.length}개 파일)`);
  process.exit(0);
}

// 규칙별로 묶어서 출력
const byRule = new Map();
for (const v of violations) {
  if (!byRule.has(v.rule.id)) byRule.set(v.rule.id, []);
  byRule.get(v.rule.id).push(v);
}

for (const [, group] of byRule) {
  const { label, hint } = group[0].rule;
  console.log(`\n❌ ${label} — ${group.length}건`);
  console.log(`   ${hint}\n`);
  for (const v of group) {
    const preview = v.text.length > 80 ? v.text.slice(0, 77) + '...' : v.text;
    console.log(`   ${v.file}:${v.line}`);
    console.log(`      ${preview}`);
  }
}

console.log(`\n총 ${violations.length}건. 검사한 파일 ${files.length}개.\n`);
process.exit(1);
