// app/src/theme/marker.ts
//
// 지도 마커 토큰
// RN 뿐 아니라 카카오맵 WebView 안에서도 쓰인다. src/map/markerSvg.ts 가 이 파일만 읽어
// SVG 문자열을 만들고 주입하므로, WebView 쪽에 색을 직접 쓰는 코드가 생기면 버그다
//
// v2 마커는 breadboard U2 의 세 모양 + 선택 상태
//   기본     필터 꺼짐. 종이 면 + 펜 선 + 그릇 글리프 (Phase 1)
//   선택     한 단계 크게, 면을 fillSoft 로 (Phase 1)
//   통과 n개 필터 통과 가게 (Phase 3 — 토큰 자리만)
//   흐림     필터 통과 0 (Phase 3 — 토큰 자리만)
// v1 의 타레 × 청탁 6색은 v2.0 에서 쓰지 않는다 (git 기록에 남아 있음)

import { colors } from './colors';
import { palette } from './palette';
import { borderWidth } from './layout';

export const markerTokens = {
  fill: colors.paper,
  fillSelected: colors.fillSoft,
  stroke: colors.ink,
  strokeWidth: borderWidth.outline,
  glyph: colors.ink,
  glyphWidth: borderWidth.inner,
} as const;

export const markerSize = {
  default: 36,
  selected: 44,
} as const;

// Phase 3 — 필터 통과 가게. 주요 색 면 + 반전 숫자
export const markerPass = {
  fill: colors.primary,
  text: colors.onPrimary,
  stroke: colors.ink,
} as const;

// Phase 3 — 필터 통과 0 가게. 지우지 않고 흐린 점선으로 남긴다
export const markerDimmed = {
  fill: 'transparent',
  stroke: colors.slotEmpty,
  strokeDasharray: '3 3',
  size: 20,
} as const;

// 카카오맵 타일을 받기 전 깔아둘 스켈레톤 색
export const mapSkeleton = {
  tile: palette.paitan[20],
  road: palette.shio[10],
  park: palette.shio[50],
  water: palette.shio[30],
} as const;
