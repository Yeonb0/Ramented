// app/src/theme/palette.ts
//
// 1층 — 국물 팔레트
// 앱에서 헥사값이 적힌 유일한 파일 (check:tokens 가 다른 파일의 헥사값을 막는다)
//
// 토큰 3층 구조 (docs/design/v2-design-direction.md § 6)
//   1층 palette.ts     국물 계열별 단계 색
//   2층 colors.ts      의미 토큰 (paper, ink, text …) → 이 파일 참조
//   3층 components.ts  부품 처리 (노트 카드, 버튼 ② …) → 2층 참조
//
// 단계 숫자는 클수록 어둡다. 화면 코드는 이 파일을 직접 import 하지 않고 colors 를 쓴다

export const palette = {
  // 시오 — 종이 · 배경
  shio: {
    10: '#FDF8EE',
    20: '#FBF2E2',
    30: '#F4E6CF',
    50: '#E2D2B6',
    70: '#CBB593',
  },
  // 파이탄 — 지도 바탕 톤, 채워진 칸, 선택 면
  paitan: {
    20: '#F6E6CF',
    40: '#EFD3AE',
    60: '#E0B88C',
  },
  // 쇼유 — 리본, 주요 버튼, 별, 펜 선, 갈색 바
  shoyu: {
    30: '#DDB27A',
    40: '#D9963F',
    50: '#B98B5E',
    60: '#A2764C',
    70: '#7A5334',
    80: '#6A4729',
    90: '#3B2C21',
  },
  // 미소 — "지금 못 감" 강조 (브레이크 · 휴무) 만
  miso: {
    50: '#C0654B',
    60: '#B5503F',
    70: '#83381F',
  },
  // 파 — 채워짐 · 확정 체크, 영업 중
  negi: {
    50: '#6F8F62',
    70: '#4E6B43',
  },
} as const;

export type Palette = typeof palette;
