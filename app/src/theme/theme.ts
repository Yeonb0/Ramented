// app/src/theme/theme.ts
//
// 라멘타쿠 디자인 토큰.
// 컨셉: 시오(아이보리) + 쇼유(연한 갈색), 납작한(flat) 일러스트 톤.
// 깊이는 그림자가 아니라 '면 + 아웃라인'으로만 낸다.
//
// 다크 모드는 MVP 범위 밖. 나중에 추가할 때 이 파일을 lightColors 로 바꾸고
// useColorScheme 으로 스왑하면 되도록 색 키 이름을 의미 기반으로 지어뒀다.

export const colors = {
  // 배경 — 시오 라멘 국물 같은 아이보리
  bg: '#FDFAF4',
  surface: '#F5EDDF',
  surfaceSunken: '#EFE5D3',

  // 경계
  // border 는 카드 안쪽 구분선(리스트 divider 등)에만 쓴다.
  // 카드·박스의 바깥 테두리는 항상 borderStrong + borderWidth.default 다.
  border: '#E2D2B6',
  borderStrong: '#CBB593',

  // 쇼유 브라운
  primary: '#B98B5E',
  primaryPressed: '#A2764C',
  primaryDark: '#7A5334',
  primarySoft: '#EFE0CC',

  // 상단 헤더 / 하단 탭바 배경.
  // 시안에서 화면 위아래를 진한 갈색 띠로 묶는 구조가 확정되면서 추가됐다.
  bar: '#6A4729',

  // 텍스트
  text: '#3B2C21',
  textSecondary: '#6B5642',
  textMuted: '#9C8B79',
  textOnPrimary: '#FDFAF4',

  // 상태
  star: '#D9963F',
  success: '#6F8F62',
  danger: '#B5503F', // 브레이크타임·휴무 등 '지금 못 감' 정보 강조
  warning: '#D19A3C',
} as const;

// 갈색 바(colors.bar) 위에 얹히는 요소는 명암이 뒤집힌다.
// 본문 팔레트를 그대로 쓰면 대비가 무너지므로 별도 그룹으로 분리했다.
export const onBar = {
  text: '#FDFAF4',
  textSecondary: '#EFE0CC',
  icon: '#FDFAF4',

  // 주요 액션 ("기록 남기기") — 크림 솔리드 + 갈색 글자
  chipSolidBg: '#EFE0CC',
  chipSolidBorder: '#A2764C',
  chipSolidText: '#6A4729',

  // 보조 액션 ("저장") — 반투명 + 크림 테두리
  chipGhostBg: 'rgba(253, 250, 244, 0.18)',
  chipGhostBorder: '#EFE0CC',
  chipGhostText: '#FDFAF4',
} as const;

// ─────────────────────────────────────────────────────────────
// 지도 마커
//
// Ramen 은 6축(SoupBase/Clarity/Temperature/Tare/Form) 모델이라
// "라멘 이름당 색 하나"로는 조합이 늘어날 때 감당이 안 된다.
// 그래서 색은 Tare × Clarity 로 키를 잡고 6개를 하드코딩했다.
// 모든 라멘이 tare 를 가지므로 새 조합이 들어와도 색은 항상 결정된다.
//
//   색상 = 타래(Tare)      시오 청회색 / 쇼유 앰버 / 미소 벽돌
//   명도 = 탁도(Clarity)   PAITAN 은 뿌옇게, SEITAN 은 원색
//   내부 마크 = 형태(Form) 라멘 원 / 츠케멘 사각 / 마제소바 마름모
//
// PAITAN 계열은 지도 배경(회색빛)과 명도가 가까워서 stroke 로 버틴다.
// stroke 는 장식이 아니라 가독성 장치이므로 지우지 말 것.
// ─────────────────────────────────────────────────────────────

export type MarkerStyle = {
  fill: string;
  stroke: string;
  mark: string; // 내부 형태 마크 색
};

export const markerColors = {
  SHIO_PAITAN: { fill: '#DBD0BA', stroke: '#85694A', mark: '#5E4835' }, // 돈코츠 라멘
  SHIO_SEITAN: { fill: '#6E9BB8', stroke: '#4F7A96', mark: '#FDFAF4' }, // 시오 츠케멘
  SHOYU_PAITAN: { fill: '#E0CBA0', stroke: '#A9884E', mark: '#5E4835' }, // 토리파이탄 쇼유
  SHOYU_SEITAN: { fill: '#C08A2E', stroke: '#96690F', mark: '#FDFAF4' }, // 마제소바
  MISO_PAITAN: { fill: '#D9B6A6', stroke: '#A9705A', mark: '#6E3A28' }, // 미소 라멘
  MISO_SEITAN: { fill: '#A8503A', stroke: '#83381F', mark: '#FDFAF4' },
} as const satisfies Record<string, MarkerStyle>;

// 필터를 걸지 않은 상태의 마커.
// 한 가게가 여러 라멘을 취급하므로 색을 쓰면 마커가 거짓말을 한다.
// 중립색 + 취급 종류 수 배지로 두고, 상세는 바텀시트에서 칩으로 펼친다.
// (예외: isSpecialist === true 인 가게는 취급 라멘이 하나뿐이라
//  markerColors 의 해당 색을 그대로 써도 정확하다.)
export const markerNeutral: MarkerStyle = {
  fill: '#A89078',
  stroke: '#85705A',
  mark: '#FDFAF4',
};

// 라멘 필터에서 제외된 가게. 지우지 않고 흐린 점선 원으로 남겨
// "이 동네에 가게는 있지만 이 라멘은 안 판다"는 정보를 유지한다.
export const markerDimmed = {
  fill: 'transparent',
  stroke: '#B7AE9E',
  strokeDasharray: '3 3',
  size: 20,
} as const;

export const markerSize = {
  default: 36,
  selected: 44, // 선택 시 이름 + 별점 라벨이 함께 붙는다
} as const;

export type MarkerShape = 'circle' | 'square' | 'diamond';

export const formShapes = {
  RAMEN: 'circle',
  TSUKEMEN: 'square',
  MAZESOBA: 'diamond',
} as const satisfies Record<string, MarkerShape>;

/** Ramen 의 tare/clarity 로 마커 색을 고른다. clarity 가 없으면(마제소바 등) SEITAN 취급. */
export function getMarkerStyle(
  tare: 'SHIO' | 'SHOYU' | 'MISO',
  clarity: 'PAITAN' | 'SEITAN' | null | undefined,
): MarkerStyle {
  const key = `${tare}_${clarity ?? 'SEITAN'}` as keyof typeof markerColors;
  return markerColors[key] ?? markerNeutral;
}

// 카카오맵 WebView 가 타일을 받아오기 전 깔아둘 스켈레톤 색.
// 흰 화면에서 지도가 튀어나오는 것보다 덜 거슬린다.
export const mapSkeleton = {
  tile: '#EAE6DE',
  road: '#F4F2EC',
  park: '#E1E6D8',
  water: '#DDE4E8',
} as const;

// ─────────────────────────────────────────────────────────────
// 레이아웃
// ─────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// 부드러운 인상의 핵심.
//   md  카드 기본
//   lg  바텀시트 상단, 큰 카드
//   xl  전면 시트
//   pill 칩·토글·원형 버튼
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

// ─────────────────────────────────────────────────────────────
// 타이포그래피 — 나눔스퀘어라운드
//
// ⚠️ Android 는 fontWeight 로 굵기가 바뀌지 않는다. 반드시 fontFamily 를 갈아끼울 것.
//    그래서 Text 컴포넌트를 직접 쓰지 말고 components/Text.tsx 래퍼를 쓴다.
//
// 시안이 R/B/EB 세 굵기로 정리돼서 Light 는 뺐다. (폰트 파일 하나 = 앱 용량)
// 나중에 필요해지면 NanumSquareRoundL 을 추가하고 여기에 light 키만 되살리면 된다.
//
// 한글은 라틴보다 세로 밀도가 높아서 lineHeight 를 1.5~1.6배로 넉넉히 준다.
// ─────────────────────────────────────────────────────────────

export const fontFamily = {
  regular: 'NanumSquareRoundR', // 400
  bold: 'NanumSquareRoundB', // 700
  extraBold: 'NanumSquareRoundEB', // 800
} as const;

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

export const theme = {
  colors,
  onBar,
  markerColors,
  markerNeutral,
  markerDimmed,
  markerSize,
  formShapes,
  mapSkeleton,
  spacing,
  radius,
  borderWidth,
  fontFamily,
  typography,
} as const;

export type Theme = typeof theme;
