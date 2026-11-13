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

// 버튼 — 네 면 같은 두께의 펜 선. 아래만 두껍게 하면 그림자처럼 보여서 쓰지 않는다
// 누른 느낌은 면 색을 한 단계 진하게 바꿔서 낸다 (레이아웃은 움직이지 않음)
export type ButtonVariant = 'primary' | 'secondary';

const ButtonFace = {
  primary: { backgroundColor: colors.primary, pressedColor: colors.primaryPressed, labelColor: colors.onPrimary },
  secondary: { backgroundColor: colors.paper, pressedColor: colors.paperSunken, labelColor: colors.text },
} as const;

export function getButtonStyle(
  variant: ButtonVariant,
  pressed: boolean,
): { container: ViewStyle; labelColor: string } {
  const Face = ButtonFace[variant];
  return {
    container: {
      backgroundColor: pressed ? Face.pressedColor : Face.backgroundColor,
      borderColor: colors.ink,
      borderWidth: borderWidth.outline,
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

// 리본 — 제목 띠. 살짝 삐뚤어진 네모
// 가게 이름 옆 지점명 (홍대점 등) 은 띠 안에 넣지 않고 띠 아래에 작게 따로 쓴다
export const ribbonMinHeight = 32;

export const ribbonStyle: ViewStyle = {
  alignSelf: 'center',
  backgroundColor: colors.ribbon,
  borderColor: colors.ink,
  borderWidth: borderWidth.inner,
  minHeight: ribbonMinHeight,
  justifyContent: 'center',
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xs,
  ...wobbleStyle(wobble.chip),
};
