// app/src/components/Text.tsx
//
// 나눔스퀘어라운드는 Android 에서 fontWeight 로 굵기가 바뀌지 않는다.
// (iOS 는 어느 정도 되지만 합성 굵기라 자간이 뭉개진다.)
// 그래서 weight 를 받아 fontFamily 를 직접 갈아끼우는 래퍼를 두고,
// 앱 전체에서 react-native 의 Text 대신 이걸 쓴다.
//
// 사용 예:
//   <Text variant="title" weight="bold">하카타 분코</Text>
//   <Text variant="caption" color="textMuted">서울 마포구</Text>
//   <Text variant="subtitle" weight="bold" onBar>라멘 지도</Text>

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import {
  colors,
  onBar as onBarColors,
  fontFamily,
  typography,
  TypeScaleKey,
} from '../theme/theme';

type Weight = keyof typeof fontFamily;
type ColorKey = keyof typeof colors;

export type TextProps = RNTextProps & {
  variant?: TypeScaleKey;
  weight?: Weight;
  color?: ColorKey;
  /**
   * 진한 갈색 바(colors.bar) 위에 놓이는 텍스트.
   * 명암이 뒤집히므로 onBar 팔레트에서 색을 가져온다.
   * color 는 'text' | 'textSecondary' 만 유효하고, 그 외 값은 text 로 떨어진다.
   */
  onBar?: boolean;
};

export function Text({
  variant = 'body',
  weight = 'regular',
  color = 'text',
  onBar = false,
  style,
  ...rest
}: TextProps) {
  const resolvedColor = onBar
    ? color === 'textSecondary'
      ? onBarColors.textSecondary
      : onBarColors.text
    : colors[color];

  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        typography[variant],
        { fontFamily: fontFamily[weight], color: resolvedColor },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    // 한글은 자간이 살짝 좁아야 둥근 폰트가 답답해 보이지 않는다.
    letterSpacing: -0.2,
    // Android 에서 lineHeight 를 줄 때 글자가 위로 붙는 현상 방지
    includeFontPadding: false,
  },
});

// ─────────────────────────────────────────────────────────────
// 폰트 로딩 — app/_layout.tsx 에서
//
// import { useFonts } from 'expo-font';
//
// const [loaded] = useFonts({
//   NanumSquareRoundR:  require('../assets/fonts/NanumSquareRoundR.otf'),
//   NanumSquareRoundB:  require('../assets/fonts/NanumSquareRoundB.otf'),
//   NanumSquareRoundEB: require('../assets/fonts/NanumSquareRoundEB.otf'),
// });
// if (!loaded) return null;
//
// ⚠️ useFonts 로 등록하는 key 가 곧 fontFamily 이름이다.
//    theme.ts 의 fontFamily 값과 철자가 정확히 같아야 한다.
//
// ⚠️ 시안은 Naver 호스팅 웹폰트를 썼지만 RN 은 CSS @font-face 를 못 쓴다.
//    반드시 .otf 파일을 받아 assets/fonts/ 에 넣고 번들해야 한다.
//    (카카오맵 WebView 안쪽은 예외 — 거기선 웹폰트 링크가 그대로 동작한다.)
// ─────────────────────────────────────────────────────────────
