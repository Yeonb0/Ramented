// app/src/theme/components.ts
//
// 3층 — 부품 처리
// 기록장 부품이 어떻게 생겼는지 (면 · 펜 선 · 모서리 · 두께) 를 한 곳에서 정한다
// 부품 컴포넌트 (src/components) 는 이 파일의 값만 읽고, 숫자 · 색을 따로 쓰지 않는다
// (docs/design/v2-design-direction.md § 5.4 · § 5.5)

import type { ViewStyle } from 'react-native';
import { colors } from './colors';
import { borderWidth, spacing, touchTarget, wobble, wobbleStyle } from './layout';

// 노트 카드 — 모든 카드
export const noteCardStyle: ViewStyle = {
  backgroundColor: colors.paper,
  borderColor: colors.ink,
  borderWidth: borderWidth.outline,
  padding: spacing.lg,
  ...wobbleStyle(wobble.card),
};

// 노트 시트 — 화면 아래에 붙는 시트. 위 테두리만 긋고 위 두 모서리만 삐뚤게
export const noteSheetStyle: ViewStyle = {
  backgroundColor: colors.paper,
  borderColor: colors.ink,
  borderTopWidth: borderWidth.outline,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
  ...wobbleStyle(wobble.sheetTop),
};

// 버튼 ② — 아래 테두리만 두껍게. 그림자가 아니라 같은 펜 선 색의 두꺼운 선
// 눌리면 아래 테두리가 줄어든 만큼 위 여백을 더해 면이 내려간다
// transform 이 아니라 여백으로 내리므로 버튼이 차지하는 높이와 주변 레이아웃은 그대로다
export type ButtonVariant = 'primary' | 'secondary';

const ButtonFace = {
  primary: { backgroundColor: colors.primary, labelColor: colors.onPrimary },
  secondary: { backgroundColor: colors.paper, labelColor: colors.text },
} as const;

export function getButtonStyle(
  variant: ButtonVariant,
  pressed: boolean,
): { container: ViewStyle; labelColor: string } {
  const Face = ButtonFace[variant];
  const Sink = borderWidth.buttonBase - borderWidth.outline;
  return {
    container: {
      backgroundColor: Face.backgroundColor,
      borderColor: colors.ink,
      borderWidth: borderWidth.outline,
      borderBottomWidth: pressed ? borderWidth.outline : borderWidth.buttonBase,
      marginTop: pressed ? Sink : 0,
      minHeight: touchTarget.min,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      ...wobbleStyle(wobble.button),
    },
    labelColor: Face.labelColor,
  };
}

// 리본 — 양 끝이 V자로 파인 제목 띠 (SVG)
export const ribbon = {
  height: 32,
  notchRatio: 0.25, // V자 홈 깊이 = 기본 높이 (height) × 0.25. 글자가 커져 리본이 높아져도 깊이는 고정
  strokeWidth: borderWidth.inner,
  paddingHorizontal: spacing.xl,
  fill: colors.ribbon,
  stroke: colors.ink,
} as const;

/** 리본 외곽 path. 폭 · 높이는 실제 렌더 크기 (px) */
export function ribbonPath(width: number, height: number): string {
  const D = ribbon.height * ribbon.notchRatio;
  const Mid = height / 2;
  return `M0 0 H${width} L${width - D} ${Mid} L${width} ${height} H0 L${D} ${Mid} Z`;
}
