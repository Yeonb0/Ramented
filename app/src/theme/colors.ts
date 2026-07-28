// app/src/theme/colors.ts
//
// 라멘타쿠 색 토큰.
// 컨셉: 시오(아이보리) + 쇼유(연한 갈색), 납작한(flat) 일러스트 톤.
// 깊이는 그림자가 아니라 '면 + 아웃라인'으로만 낸다.
//
// 다크 모드는 MVP 범위 밖. 나중에 추가할 때 이 파일을 lightColors 로 바꾸고
// useColorScheme 으로 스왑하면 되도록 색 키 이름을 의미 기반으로 지어뒀다.
//
// ⚠️ 이 파일과 marker.ts 밖에서 헥사값을 쓰지 않는다.
//    `npm run check:tokens` 가 위반을 잡는다.

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

  // 비활성 탭 아이콘 — 활성(icon)보다 한 단 내려간 크림
  iconInactive: '#EFE0CC',

  // 주요 액션 ("기록 남기기") — 크림 솔리드 + 갈색 글자
  chipSolidBg: '#EFE0CC',
  chipSolidBorder: '#A2764C',
  chipSolidText: '#6A4729',

  // 보조 액션 ("저장") — 반투명 + 크림 테두리
  chipGhostBg: 'rgba(253, 250, 244, 0.18)',
  chipGhostBorder: '#EFE0CC',
  chipGhostText: '#FDFAF4',
} as const;

export type ColorKey = keyof typeof colors;
export type OnBarKey = keyof typeof onBar;
