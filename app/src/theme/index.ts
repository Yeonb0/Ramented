// app/src/theme/index.ts
//
// 디자인 토큰의 단일 진입점
// 화면 코드는 언제나 여기서만 가져온다 :  import { colors, spacing } from '../theme';
//
// 3층 구조 (docs/design/v2-design-direction.md § 6)
//   palette.ts     1층 국물 계열 색 (헥사값 유일)
//   colors.ts      2층 의미 토큰 + 갈색 바 위 반전 팔레트
//   marker.ts      2층 지도 마커 (RN 과 WebView 가 공유)
//   components.ts  3층 부품 처리
//   typography.ts  폰트 · 타입 스케일
//   layout.ts      간격 · 라운드 · wobble · 펜 선 두께 · 터치 타겟

export * from './palette';
export * from './colors';
export * from './typography';
export * from './layout';
export * from './marker';
