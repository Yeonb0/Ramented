// app/src/theme/index.ts
//
// 디자인 토큰의 단일 진입점.
// 화면 코드는 언제나 여기서만 가져온다:  import { colors, spacing } from '../theme';
//
// 파일이 나뉜 기준:
//   colors.ts     본문 팔레트 + 갈색 바 위 반전 팔레트
//   typography.ts 폰트 패밀리 + 타입 스케일
//   layout.ts     간격 · 라운드 · 테두리 · 터치 타겟
//   marker.ts     지도 마커 (RN 과 WebView 가 공유하는 유일한 색 정의)

export * from './colors';
export * from './typography';
export * from './layout';
export * from './marker';

import { colors, onBar } from './colors';
import { fontFamily, typography, letterSpacing } from './typography';
import { spacing, radius, borderWidth, touchTarget } from './layout';
import {
  markerColors,
  markerNeutral,
  markerDimmed,
  markerSize,
  formShapes,
  mapSkeleton,
} from './marker';

/**
 * 토큰 전체를 한 덩어리로 넘겨야 할 때만 쓴다. (예: 테스트, 스타일가이드 화면)
 * 일반 화면 코드는 개별 named import 를 쓰는 편이 트리셰이킹에 유리하다.
 */
export const theme = {
  colors,
  onBar,
  fontFamily,
  typography,
  letterSpacing,
  spacing,
  radius,
  borderWidth,
  touchTarget,
  markerColors,
  markerNeutral,
  markerDimmed,
  markerSize,
  formShapes,
  mapSkeleton,
} as const;

export type Theme = typeof theme;
