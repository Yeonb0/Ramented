// app/src/theme/typography.ts
//
// 타이포그래피 — 나눔스퀘어라운드
//
// ⚠️ Android 는 fontWeight 로 굵기가 바뀌지 않는다. 반드시 fontFamily 를 갈아끼울 것.
//    그래서 RN 의 Text 를 직접 쓰지 말고 components/Text.tsx 래퍼를 쓴다.
//
// 시안이 R/B/EB 세 굵기로 정리돼서 Light 는 뺐다. (폰트 파일 하나 = 앱 용량)
// 나중에 필요해지면 NanumSquareRoundL 을 추가하고 여기에 light 키만 되살리면 된다.
//
// 한글은 라틴보다 세로 밀도가 높아서 lineHeight 를 1.5~1.6배로 넉넉히 준다.

/**
 * ⚠️ 이 값은 expo-font 의 useFonts() 에 넘기는 key 와 철자가 정확히 같아야 한다.
 *    _layout.tsx 의 등록부와 함께 고칠 것.
 */
export const fontFamily = {
  regular: 'NanumSquareRoundR', // 400
  bold: 'NanumSquareRoundB', // 700
  extraBold: 'NanumSquareRoundEB', // 800
} as const;

export type FontWeightKey = keyof typeof fontFamily;

export type TypeScaleKey =
  | 'caption'
  | 'footnote'
  | 'body'
  | 'subtitle'
  | 'title'
  | 'headline'
  | 'display';

export const typography: Record<
  TypeScaleKey,
  { fontSize: number; lineHeight: number }
> = {
  caption: { fontSize: 12, lineHeight: 18 },
  footnote: { fontSize: 13, lineHeight: 20 },
  body: { fontSize: 15, lineHeight: 24 },
  subtitle: { fontSize: 17, lineHeight: 26 },
  title: { fontSize: 20, lineHeight: 30 },
  headline: { fontSize: 24, lineHeight: 34 }, // 등급명, 취급 라멘의 큰 별점
  display: { fontSize: 26, lineHeight: 38 },
};

// 둥근 한글 폰트는 자간을 살짝 조여야 답답해 보이지 않는다.
// components/Text.tsx 가 전역으로 적용하므로 화면에서 다시 쓸 일은 없다.
export const letterSpacing = -0.2;
