// app/src/theme/openTone.ts
//
// 영업 상태 문구의 색
// 영업 여부는 서버가 계산한다 (breadboard N4). 여기서는 서버가 준 상태를 세 가지 색 톤으로만 나눈다
//   open     영업 중
//   stop     브레이크 · 영업 종료 · 정기 휴무 — "지금 못 감"
//   unknown  모름
// 서버 enum → tone 매핑은 지도 API 타입을 만드는 프론트 트랙이 맡는다

import { colors } from './colors';

export type OpenTone = 'open' | 'stop' | 'unknown';

const ToneColors: Record<OpenTone, string> = {
  open: colors.success,
  stop: colors.danger,
  unknown: colors.textMuted,
};

export function toneColor(tone: OpenTone): string {
  return ToneColors[tone];
}
