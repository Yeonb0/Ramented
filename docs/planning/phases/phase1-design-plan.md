# Phase 1 디자인 트랙 — 국물 팔레트 토큰 · 기록장 부품 · 기본 마커 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** v2 디자인 방향 문서의 3층 토큰, Phase 1에 필요한 기록장 부품 (노트 카드 · 노트 시트 · 리본 · 버튼 ②), 기본 · 선택 마커 SVG, 미리보기 시트 · 상태 뷰를 만들고 스타일가이드 화면에서 확인한다.

**Architecture:** `app/src/theme` 을 palette (헥사값 유일) → colors · marker (의미 토큰) → components (부품 처리) 3층으로 다시 짠다. 부품은 `components.ts` 의 순수 함수 · 상수만 읽고, 지도 마커는 `src/map/markerSvg.ts` 가 `marker.ts` 만 읽어 SVG 문자열을 만든다. API 연동은 이 계획 밖 (Phase 1 백엔드 · 프론트 트랙) 이고, 미리보기 시트는 `tone` · `label` 을 props로 받는 표시 전용 부품으로 만든다.

**Tech Stack:** Expo SDK 54 · React Native 0.81 · TypeScript 5.9 · react-native-svg 15.12 · jest-expo (신규 devDependency)

**Spec:** `docs/design/v2-design-direction.md` (PR #8)

## Global Constraints

- 헥사값은 `app/src/theme/palette.ts` 에만 쓴다. 그림자 (`shadow*` · `elevation`) · 그라디언트 · 이모지 아이콘 금지
- 화면 · 부품 코드에 픽셀 상수 금지. 모든 값은 `app/src/theme` 에서 import
- 펜 선 = `colors.ink` (`shoyu.80`). 바깥 선 2.5 · 안쪽 2 · 구분선 1 (실선, `colors.divider`)
- 버튼 ② : 테두리 2.5, 아래 테두리 5. 눌림 시 아래 테두리 2.5 + 아래로 2.5 이동
- 대비 기준 : 본문 글자 · 반전 글자 4.5 : 1, 펜 선 · 빈 칸 점선 3 : 1 (`paper` 기준)
- 갈색 바 (`colors.bar`) 에는 라운드 없음. 터치 영역 최소 44
- 폰트는 나눔스퀘어라운드 R / B / EB, 텍스트는 항상 `components/Text.tsx` 로
- 코드 스타일 (관리자님 규칙) : 들여쓰기 2칸, 배열 · 자료구조 변수명은 첫 글자 대문자 (예 : `const ContrastPairs = [...]`), 주석 끝에 마침표 없음
- 스크립트는 Windows에서도 돌아가야 한다 (Node 스크립트, POSIX 셸 금지)

## Review Focus

1. **글자 크기를 키운 기기 (접근성 폰트 배율)** 에서 리본 제목이 잘리지 않고 리본이 글자 폭만큼 늘어나야 한다 → Task 4 `ribbonPath` 폭 320 테스트 + 스타일가이드에 긴 이름 샘플
2. **아주 긴 가게 이름** (예 : "라멘 멘야 산다이메 마포 본점 홍대입구역점") 은 시트에서 두 줄까지 보이고 말줄임 → Task 5 `PreviewSheet` 의 `numberOfLines={2}`, 스타일가이드 샘플
3. **버튼을 누를 때 버튼 아래 레이아웃이 들썩이면 안 된다** → Task 4 `getButtonStyle` 테스트 : 눌림 · 안 눌림의 (위 테두리 + 아래 테두리 + 이동량) 합이 같다
4. **새 글자 색 토큰을 추가하고 대비 검사 목록에 안 넣는 실수** → Task 1 테스트가 `colors` 의 `text*` · `on*` 키 전부가 `ContrastPairs` 에 있는지 검사
5. **선택 마커와 기본 마커의 크기 차이로 마커 중심이 어긋나는 것** (탭한 가게가 옆으로 밀려 보임) → Task 3 테스트 : 두 SVG의 `anchor` 가 각각 폭 / 2, 높이 바닥

---

### Task 1: 국물 팔레트 · 의미 토큰 · 대비 테스트

**Files:**
- Create: `app/src/theme/palette.ts`
- Create: `app/src/theme/contrast.ts`
- Create: `app/src/theme/__tests__/contrast.test.ts`
- Create: `app/jest.config.js`
- Modify: `app/src/theme/colors.ts` (전체 교체)
- Modify: `app/src/components/Text.tsx:21` (`'../theme/theme'` → `'../theme'`, 존재하지 않는 경로 수정)
- Modify: `app/package.json` (devDependencies `jest-expo` ~54, `jest`, `@types/jest` · script `"test": "jest"`)
- Modify: `docs/design/v2-design-direction.md` § 7 4번 · § 10 (대비 검사를 jest 테스트로 옮긴 이유 : `palette.ts` 가 TS라 `.mjs` 스크립트에서 바로 읽을 수 없음)

**Interfaces:**
- Produces :
  - `palette` : `{ shio, paitan, shoyu, miso, negi }`, 각 계열은 스펙 § 5.1의 단계 키 (`shio[10]` …) → 헥사 문자열. `as const`
  - `colors` : 스펙 § 6 표의 키 그대로 (`paper`, `paperRaised`, `paperSunken`, `ink`, `divider`, `slotEmpty`, `text`, `textSecondary`, `textMuted`, `primary`, `primaryPressed`, `onPrimary`, `ribbon`, `onRibbon`, `fillSoft`, `star`, `success`, `danger`, `bar`)
  - `onBar` : v1 키 유지, 값만 palette 참조로 (`text` · `icon` = `shio[10]`, `textSecondary` · `iconInactive` = `paitan[20]` 계열 중 대비 4.5 이상인 값)
  - `contrastRatio(fg: string, bg: string): number` (WCAG 2.x 상대 휘도, `#RRGGBB` 만)
  - `ContrastPairs: ReadonlyArray<{ fg: string; bg: string; min: 3 | 4.5; name: string }>` (`contrast.ts` 에서 export)

- [ ] **Step 1: jest-expo 설치 · 설정**

Run : `cd app && npx expo install jest-expo jest @types/jest -- --save-dev`
`jest.config.js` : `module.exports = { preset: 'jest-expo' };`

- [ ] **Step 2: 실패하는 테스트 작성** — `contrast.test.ts`

```ts
import { contrastRatio, ContrastPairs } from '../contrast';
import { colors, onBar } from '../colors';

test('contrastRatio 기준값', () => {
  expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  expect(contrastRatio('#3B2C21', '#FDF8EE')).toBeCloseTo(12.65, 1);
});

test.each(ContrastPairs)('$name 대비 $min 이상', ({ fg, bg, min }) => {
  expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
});

test('글자 · 반전 색 토큰은 전부 대비 목록에 있다', () => {
  const Checked = new Set(ContrastPairs.map((p) => p.name));
  const TextKeys = Object.keys(colors).filter((k) => k.startsWith('text') || k.startsWith('on'));
  TextKeys.forEach((k) => expect(Checked.has(k)).toBe(true));
  expect(Checked.has('onBar.text')).toBe(true);
});
```

`ContrastPairs` 의 `name` 은 글자 색 토큰 키 (`text`, `textSecondary`, `textMuted`, `onPrimary`, `onRibbon`, `onBar.text`, `onBar.textSecondary`) 와 선 토큰 (`ink`, `slotEmpty`, `success`, `danger`) 이다. 쌍과 기준은 스펙 § 7 3번 그대로.

- [ ] **Step 3: 실패 확인** — Run : `npm test -- contrast` / Expected : `Cannot find module '../contrast'`

- [ ] **Step 4: `palette.ts` · `colors.ts` · `contrast.ts` 구현** — 값은 스펙 § 5.1 · § 6 표 그대로. 파일 머리 주석에 3층 구조와 "헥사값은 palette.ts 에만" 규칙을 적는다

- [ ] **Step 5: 통과 확인** — Run : `npm test -- contrast` / Expected : 모두 PASS

- [ ] **Step 6: 타입 확인** — Run : `npx tsc --noEmit` / Expected : `colors` 옛 키 (`bg`, `surface`, `borderStrong` …) 를 쓰는 곳에서만 오류. `layout.ts` 주석 · `Text.tsx` 를 새 키로 고친 뒤 오류 0

- [ ] **Step 7: Commit** — `feat(theme): 국물 팔레트와 의미 토큰 3층 구조, 대비 테스트`

---

### Task 2: 선 두께 · wobble 토큰과 마커 토큰 교체

**Files:**
- Modify: `app/src/theme/layout.ts` (`borderWidth` · `wobble` 추가, 옛 `default: 1.5` 제거)
- Modify: `app/src/theme/marker.ts` (전체 교체 : v1 `markerColors` · `markerNeutral` · `markerDimmed` · `formShapes` · `getMarkerStyle` · `Tare` · `Clarity` 제거)
- Modify: `app/src/theme/index.ts` (export 목록 · `theme` 묶음 갱신)
- Modify: `app/src/api/ramens.ts:4` (v1 마커 키와 맞물린다는 주석 삭제)
- Test: `app/src/theme/__tests__/layout.test.ts`

**Interfaces:**
- Consumes : `palette`, `colors` (Task 1)
- Produces :
  - `borderWidth = { divider: 1, inner: 2, outline: 2.5, buttonBase: 5 }`
  - `type Wobble = readonly [tl: number, tr: number, br: number, bl: number]`
  - `wobble = { card: [16, 20, 15, 19], sheetTop: [20, 24, 0, 0], button: [14, 17, 13, 16], chip: [10, 12, 9, 11] } satisfies Record<string, Wobble>`
  - `wobbleStyle(w: Wobble): { borderTopLeftRadius; borderTopRightRadius; borderBottomRightRadius; borderBottomLeftRadius }`
  - `markerTokens = { fill: colors.paper, fillSelected: colors.fillSoft, stroke: colors.ink, strokeWidth: borderWidth.outline, glyph: colors.ink }`, `markerSize = { default: 36, selected: 44 }`, `markerPass` · `markerDimmed` (Phase 3 자리 : 색 · 점선 값만, 쓰는 코드 없음)
  - `mapSkeleton = { tile: palette.paitan[20], road: palette.shio[10], park, water }` (`park` · `water` 는 팔레트 안에서 가장 가까운 값, 스펙 밖 새 계열 추가 금지)

- [ ] **Step 1: 실패하는 테스트** — `layout.test.ts`

```ts
import { wobble, wobbleStyle, borderWidth } from '../layout';

test('wobbleStyle 은 좌상 · 우상 · 우하 · 좌하 순서', () => {
  expect(wobbleStyle([1, 2, 3, 4])).toEqual({
    borderTopLeftRadius: 1, borderTopRightRadius: 2,
    borderBottomRightRadius: 3, borderBottomLeftRadius: 4,
  });
});

test('시트는 아래 모서리가 0 (화면 끝에 붙음)', () => {
  expect(wobble.sheetTop[2]).toBe(0);
  expect(wobble.sheetTop[3]).toBe(0);
});

test('버튼 아래 테두리는 바깥 선의 두 배', () => {
  expect(borderWidth.buttonBase).toBe(borderWidth.outline * 2);
});
```

- [ ] **Step 2: 실패 확인** — Run : `npm test -- layout` / Expected : `wobbleStyle is not a function`
- [ ] **Step 3: `layout.ts` · `marker.ts` · `index.ts` 구현**
- [ ] **Step 4: 통과 · 타입 확인** — Run : `npm test && npx tsc --noEmit` / Expected : 테스트 PASS, 타입 오류 0 (`KakaoMap.tsx` 는 옛 마커 토큰을 쓰지 않으므로 영향 없음)
- [ ] **Step 5: Commit** — `feat(theme): 펜 선 두께 · wobble 토큰, v2 마커 토큰으로 교체`

---

### Task 3: 기본 · 선택 마커 SVG 빌더

**Files:**
- Create: `app/src/map/markerSvg.ts`
- Test: `app/src/map/__tests__/markerSvg.test.ts`

**Interfaces:**
- Consumes : `markerTokens`, `markerSize` (Task 2)
- Produces : `buildMarkerSvg(opts: { variant: 'default' | 'selected' }): { svg: string; width: number; height: number; anchorX: number; anchorY: number }`
  - 모양 : 원 (면 `fill` / 선택 시 `fillSelected`, 선 `stroke` · `strokeWidth`) 안에 그릇 글리프 (반원 그릇 + 젓가락 두 줄, 선 `glyph`, 선 두께 `borderWidth.inner`, `stroke-linecap="round"`). 아래에 짧은 꼬리 (원과 같은 선) 를 붙여 위치를 가리킨다
  - `anchorX = width / 2`, `anchorY = height` (꼬리 끝)
  - 색 · 크기는 전부 토큰에서. 이 파일에 헥사값 · 숫자 크기 상수 금지 (그릇 글리프 좌표는 viewBox 24 기준 상대값만 허용)

- [ ] **Step 1: 실패하는 테스트**

```ts
import { buildMarkerSvg } from '../markerSvg';
import { markerTokens, markerSize } from '../../theme';

test('기본 마커는 종이 면 + 펜 선', () => {
  const M = buildMarkerSvg({ variant: 'default' });
  expect(M.svg).toContain(`fill="${markerTokens.fill}"`);
  expect(M.svg).toContain(`stroke="${markerTokens.stroke}"`);
  expect(M.width).toBe(markerSize.default);
});

test('선택 마커는 한 단계 크고 면이 fillSoft', () => {
  const M = buildMarkerSvg({ variant: 'selected' });
  expect(M.svg).toContain(`fill="${markerTokens.fillSelected}"`);
  expect(M.width).toBe(markerSize.selected);
});

test.each(['default', 'selected'] as const)('%s 마커의 기준점은 가운데 아래', (variant) => {
  const M = buildMarkerSvg({ variant });
  expect(M.anchorX).toBe(M.width / 2);
  expect(M.anchorY).toBe(M.height);
});

test('그림자 · 그라디언트 요소가 없다', () => {
  const S = buildMarkerSvg({ variant: 'default' }).svg;
  expect(S).not.toMatch(/filter|Gradient|feDropShadow/);
});
```

- [ ] **Step 2: 실패 확인** — Run : `npm test -- markerSvg` / Expected : `Cannot find module '../markerSvg'`
- [ ] **Step 3: 구현**
- [ ] **Step 4: 통과 확인** — Run : `npm test -- markerSvg` / Expected : PASS
- [ ] **Step 5: Commit** — `feat(map): 기본 · 선택 마커 SVG 빌더 (그릇 글리프)`

---

### Task 4: 부품 처리 (components.ts) 와 기록장 프리미티브

**Files:**
- Create: `app/src/theme/components.ts`
- Create: `app/src/components/NoteCard.tsx`, `NoteSheet.tsx`, `Ribbon.tsx`, `Button.tsx`
- Test: `app/src/theme/__tests__/components.test.ts`

**Interfaces:**
- Consumes : `colors`, `borderWidth`, `wobble`, `wobbleStyle`, `spacing`, `touchTarget`
- Produces :
  - `noteCardStyle: ViewStyle` (면 `paper`, 선 `ink` · `outline`, `wobble.card`)
  - `noteSheetStyle: ViewStyle` (같은 면 · 선, `wobble.sheetTop`, 아래 · 좌우 테두리 0 — 시트는 위 테두리만)
  - `getButtonStyle(variant: 'primary' | 'secondary', pressed: boolean): { container: ViewStyle; labelColor: string }`
  - `ribbonPath(width: number, height: number): string` — SVG path. 양 끝 V자 홈 깊이 = `height * 0.25`
  - 컴포넌트 : `<NoteCard>` (children, style), `<NoteSheet>` (children), `<Ribbon label: string />` (onLayout 으로 폭을 재고 `ribbonPath` 로 그림, 글자는 `Text` bold `onRibbon`), `<Button label: string; variant?: 'primary' | 'secondary'; onPress: () => void />` (Pressable, `hitSlop` 으로 높이 44 확보)

- [ ] **Step 1: 실패하는 테스트**

```ts
import { getButtonStyle, ribbonPath, noteSheetStyle } from '../components';
import { colors, borderWidth } from '..';

const vSum = (s: any) =>
  (s.borderTopWidth ?? s.borderWidth) + s.borderBottomWidth +
  (s.transform?.[0]?.translateY ?? 0);

test('버튼 ② : 아래 테두리 두껍게, 눌리면 얇아지고 내려간다', () => {
  const Up = getButtonStyle('primary', false).container;
  const Down = getButtonStyle('primary', true).container;
  expect(Up.borderBottomWidth).toBe(borderWidth.buttonBase);
  expect(Down.borderBottomWidth).toBe(borderWidth.outline);
  expect(vSum(Down)).toBe(vSum(Up));
});

test('주요 버튼은 primary 면 + onPrimary 글자', () => {
  const B = getButtonStyle('primary', false);
  expect(B.container.backgroundColor).toBe(colors.primary);
  expect(B.labelColor).toBe(colors.onPrimary);
});

test('리본 path 는 폭이 커져도 닫힌 도형', () => {
  [120, 320].forEach((w) => {
    const P = ribbonPath(w, 32);
    expect(P.startsWith('M')).toBe(true);
    expect(P.trim().endsWith('Z')).toBe(true);
    expect(P).toContain(String(w));
  });
});

test('시트는 위 테두리만', () => {
  expect(noteSheetStyle.borderTopWidth).toBe(borderWidth.outline);
  expect(noteSheetStyle.borderBottomWidth).toBe(0);
});

test('그림자 속성이 없다', () => {
  const All = JSON.stringify([getButtonStyle('primary', false), noteSheetStyle]);
  expect(All).not.toMatch(/shadow|elevation/);
});
```

- [ ] **Step 2: 실패 확인** — Run : `npm test -- components` / Expected : `Cannot find module '../components'`
- [ ] **Step 3: `components.ts` 구현** — 위 테스트로 값이 정해지지 않는 부분은 스펙 § 5.4 · § 5.5 그대로
- [ ] **Step 4: 프리미티브 4개 구현** — 스타일은 `components.ts` 에서만 가져온다
- [ ] **Step 5: 확인** — Run : `npm test && npx tsc --noEmit && npm run check:tokens` / Expected : 모두 통과
- [ ] **Step 6: Commit** — `feat(ui): 기록장 프리미티브 — 노트 카드 · 시트 · 리본 · 버튼 ②`

---

### Task 5: 미리보기 시트와 로딩 · 실패 상태 뷰

**Files:**
- Create: `app/src/components/PreviewSheet.tsx`, `app/src/components/StateView.tsx`
- Create: `app/src/theme/openTone.ts`
- Test: `app/src/theme/__tests__/openTone.test.ts`

**Interfaces:**
- Consumes : `NoteSheet`, `Ribbon`, `Button`, `Text` (Task 4)
- Produces :
  - `type OpenTone = 'open' | 'stop' | 'unknown'` — 서버 enum → tone 매핑은 API 트랙이 맡는다 (영업 중 → `open`, 브레이크 · 영업 종료 · 정기 휴무 → `stop`, 모름 → `unknown`)
  - `toneColor(tone: OpenTone): string` → `success` / `danger` / `textMuted`
  - `<PreviewSheet name: string; tone: OpenTone; label: string />` — 리본에 `name` (두 줄까지, 말줄임), 아래 한 줄에 `label` 을 `toneColor(tone)` 로. "가게 보기" 버튼 없음 (U9는 Phase 2)
  - `<StateView kind: 'loading' | 'error'; onRetry?: () => void />` — loading : `ActivityIndicator` (색 `ink`) + "지도를 펼치는 중", error : 노트 카드 + "지도를 불러오지 못했어요" + `Button` "다시 시도" (secondary)

- [ ] **Step 1: 실패하는 테스트**

```ts
import { toneColor } from '../openTone';
import { colors } from '../colors';

test.each([
  ['open', colors.success],
  ['stop', colors.danger],
  ['unknown', colors.textMuted],
] as const)('%s → 색', (tone, color) => {
  expect(toneColor(tone)).toBe(color);
});
```

- [ ] **Step 2: 실패 확인** — Run : `npm test -- openTone` / Expected : `Cannot find module '../openTone'`
- [ ] **Step 3: `openTone.ts` · 두 컴포넌트 구현**
- [ ] **Step 4: 확인** — Run : `npm test && npx tsc --noEmit && npm run check:tokens` / Expected : 통과
- [ ] **Step 5: Commit** — `feat(ui): 미리보기 시트와 로딩 · 실패 상태 뷰`

---

### Task 6: 헥사 허용 범위 축소 · 폰트 로딩 · 스타일가이드 화면

**Files:**
- Modify: `app/scripts/check-tokens.mjs` (`ALLOW_PREFIXES` → `ALLOW_FILES = [path.join('src', 'theme', 'palette.ts')]`, `isAllowed` 를 파일 단위 비교로, 그림자 힌트 문구를 `borderWidth.outline + colors.ink` 로)
- Modify: `app/app/_layout.tsx` (`useFonts` 로 `fontFamily` 세 키 로딩, 로딩 전 `null`)
- Create: `app/app/styleguide.tsx` (`__DEV__` 가 아니면 `Redirect` 로 `/`)

**Interfaces:**
- Consumes : Task 1 ~ 5의 모든 export
- Produces : 개발용 라우트 `/styleguide` — 팔레트 칩 (계열별 단계), 의미 토큰 칩, 대비 수치 (`ContrastPairs` 를 돌며 `contrastRatio` 표시), 노트 카드, 리본 (짧은 이름 · Review Focus 1의 긴 이름), 버튼 ② 두 종류, 마커 두 종류 (`buildMarkerSvg` 결과를 `SvgXml` 로), 미리보기 시트 세 tone (+ Review Focus 2의 긴 이름), 상태 뷰 두 종류

- [ ] **Step 1: 축소된 검사가 위반을 잡는지 먼저 확인** — `src/theme/colors.ts` 에 임시로 `// '#123456'` 줄을 넣고 Run : `npm run check:tokens` / Expected : 수정 전에는 통과 (theme 전체 면제). 수정 후 다시 실행해 이 줄이 위반으로 잡히는지 확인하고 임시 줄을 지운다
- [ ] **Step 2: 전체 통과 확인** — Run : `npm run check:tokens` / Expected : `✅ 토큰 검사 통과`
- [ ] **Step 3: `_layout.tsx` 폰트 로딩 · `styleguide.tsx` 구현**
- [ ] **Step 4: 웹 빌드 확인** — Run : `npx expo export --platform web` / Expected : 오류 없이 `dist/` 생성. 스타일가이드 화면 스크린샷을 찍어 관리자님께 보여드린다
- [ ] **Step 5: 전체 확인** — Run : `npm test && npx tsc --noEmit && npm run check:tokens` / Expected : 모두 통과
- [ ] **Step 6: Commit** — `feat(app): 헥사 허용 범위를 palette.ts 로 축소, 폰트 로딩, 스타일가이드 화면`

---

## 커밋 · PR 단위

- 브랜치 `feature/phase1-design-tokens` 하나에 Task 1 ~ 6을 커밋하고, Task 6 뒤에 PR `[Phase 1] 국물 팔레트 토큰 · 기록장 부품 · 기본 마커` 를 연다 (phases.md Checkpoint의 "화면 단위" 이전 디자인 기반 PR)
- PR 뒤 멈추고 머지를 기다린다. 이후 Phase 1 백엔드 트랙 (Flyway · 스키마 · 시드 · 좌표) 으로 넘어간다
