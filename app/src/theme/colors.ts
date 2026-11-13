// app/src/theme/colors.ts
//
// 2층 — 의미 토큰
// 값은 전부 palette 참조. 이 파일에 헥사값을 쓰지 않는다
// 새 글자 색 (text* · on*) 을 추가하면 contrast.ts 의 ContrastPairs 에도 넣어야 테스트가 통과한다
//
// 다크 모드는 v2.0 범위 밖

import { palette } from './palette';

const { shio, paitan, shoyu, miso, negi } = palette;

export const colors = {
  // 종이
  paper: shio[10],
  paperRaised: shio[20],
  paperSunken: shio[30],

  // 펜 선 — 카드 · 시트 · 버튼 · 리본 · 마커의 바깥 선
  ink: shoyu[80],
  divider: shio[50],
  // 아직 비어 있는 칸의 점선
  slotEmpty: shoyu[60],

  // 글자
  text: shoyu[90],
  textSecondary: shoyu[80],
  textMuted: shoyu[70],

  // 주요 액션
  primary: shoyu[70],
  primaryPressed: shoyu[80],
  onPrimary: shio[10],

  // 리본 (제목 띠)
  ribbon: shoyu[70],
  onRibbon: shio[10],

  // 채워진 칸 · 선택 면
  fillSoft: paitan[40],

  // 별 — 면 대비가 낮으므로 항상 ink 외곽선과 함께 그린다
  star: shoyu[40],

  // 상태
  success: negi[70], // 영업 중 · 확정
  danger: miso[60], // 브레이크 · 영업 종료 · 휴무

  // 헤더 · 탭바 (라운드 금지)
  bar: shoyu[80],
} as const;

// 갈색 바 위 요소는 명암이 뒤집힌다
export const onBar = {
  text: shio[10],
  textSecondary: paitan[20],
  icon: shio[10],
  iconInactive: paitan[40],

  // 주요 액션 — 크림 면 + 갈색 글자
  chipSolidBg: paitan[20],
  chipSolidBorder: shoyu[60],
  chipSolidText: shoyu[80],
} as const;

export type ColorKey = keyof typeof colors;
export type OnBarKey = keyof typeof onBar;
