// app/src/theme/layout.ts
//
// 간격 · 라운드 · 펜 선 두께 · 터치 타겟
// 그림자를 쓰지 않으므로 깊이는 면 + 펜 선 (colors.ink) 으로만 낸다

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// 둥근 원형 요소 (칩 · 점 · 마커) 용. 손그림 카드 · 버튼은 아래 wobble 을 쓴다
// ⚠️ 갈색 바 (헤더 · 탭바) 에는 어떤 radius 도 주지 않는다
export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

// 펜 선 두께 — v1 의 1.5 보다 굵게 그어 "펜으로 그린" 느낌을 낸다
//   divider     구분선 (실선, colors.divider)
//   inner       칩 · 칸 · 리본 같은 안쪽 요소
//   outline     카드 · 시트 · 버튼 · 마커의 바깥 선
//   buttonBase  버튼 ② 의 아래 테두리 (그림자가 아니라 두꺼운 선)
export const borderWidth = {
  divider: 1,
  inner: 2,
  outline: 2.5,
  buttonBase: 5,
} as const;

// 삐뚤어진 모서리 — 네 모서리 반경을 조금씩 달리해 손으로 그린 느낌을 낸다
// RN View 는 타원 반경 (a / b) 을 지원하지 않아서 이 방식이 한계다
// 순서 : 좌상 · 우상 · 우하 · 좌하
export type Wobble = readonly [tl: number, tr: number, br: number, bl: number];

export const wobble = {
  card: [16, 20, 15, 19],
  sheetTop: [20, 24, 0, 0],
  button: [14, 17, 13, 16],
  chip: [10, 12, 9, 11],
} as const satisfies Record<string, Wobble>;

export function wobbleStyle(w: Wobble) {
  return {
    borderTopLeftRadius: w[0],
    borderTopRightRadius: w[1],
    borderBottomRightRadius: w[2],
    borderBottomLeftRadius: w[3],
  };
}

// 접근성 — 작은 아이콘 버튼도 hitSlop 으로 이 크기를 채운다
export const touchTarget = {
  min: 44,
} as const;
