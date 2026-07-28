// app/src/theme/layout.ts
//
// 간격 · 라운드 · 테두리.
// "그림자를 쓰지 않는다"는 결정 때문에 이 세 가지가 레이아웃의 전부다.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// 부드러운 인상의 핵심.
//   md   카드 기본
//   lg   바텀시트 상단, 큰 카드
//   xl   전면 시트
//   pill 칩·토글·원형 버튼
//
// ⚠️ 갈색 바(헤더·탭바)에는 어떤 radius 도 주지 않는다. 시안 규칙.
export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

// 그림자를 쓰지 않으므로 테두리가 유일한 깊이 장치다.
// 카드·박스는 예외 없이 borderStrong + default 를 두른다.
export const borderWidth = {
  hairline: 1, // 리스트 divider
  default: 1.5, // 카드·박스 외곽선
} as const;

// ⚠️ elevation 토큰은 삭제됐다.
// 시안에서 "그림자 금지, 깊이는 면 + 아웃라인으로만" 이 확정되면서
// 바텀시트조차 그림자 없이 상단 테두리로 분리하는 구조가 됐다.
// 떠 있는 느낌이 필요하면 shadow 대신
//   backgroundColor: colors.surface
//   borderTopWidth: borderWidth.default
//   borderColor: colors.borderStrong
// 조합을 쓸 것.

// 접근성 — Phase 8 검수 항목을 미리 토큰으로 박아둔다.
// 시각적으로 작은 아이콘 버튼도 hitSlop 으로 이 크기를 채운다.
export const touchTarget = {
  min: 44,
} as const;
