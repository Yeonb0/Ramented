// app/src/theme/contrast.ts
//
// 대비 검사 — Astryx 의 "규칙을 테스트로 검증한다" 방식
// 기준 (docs/design/v2-design-direction.md § 7)
//   글자 · 반전 글자 4.5 : 1, 펜 선 · 점선 3 : 1

import { colors, onBar } from './colors';

function channel(v: number): number {
  const C = v / 255;
  return C <= 0.03928 ? C / 12.92 : ((C + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const R = channel(parseInt(hex.slice(1, 3), 16));
  const G = channel(parseInt(hex.slice(3, 5), 16));
  const B = channel(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** WCAG 2.x 대비. #RRGGBB 만 받는다 */
export function contrastRatio(fg: string, bg: string): number {
  const A = luminance(fg);
  const B = luminance(bg);
  return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
}

export type ContrastPair = { fg: string; bg: string; min: 3 | 4.5; name: string };

export const ContrastPairs: ReadonlyArray<ContrastPair> = [
  // 글자
  { name: 'text', fg: colors.text, bg: colors.paper, min: 4.5 },
  { name: 'textSecondary', fg: colors.textSecondary, bg: colors.paper, min: 4.5 },
  { name: 'textMuted', fg: colors.textMuted, bg: colors.paper, min: 4.5 },
  { name: 'onPrimary', fg: colors.onPrimary, bg: colors.primary, min: 4.5 },
  { name: 'onRibbon', fg: colors.onRibbon, bg: colors.ribbon, min: 4.5 },
  { name: 'onBar.text', fg: onBar.text, bg: colors.bar, min: 4.5 },
  { name: 'onBar.textSecondary', fg: onBar.textSecondary, bg: colors.bar, min: 4.5 },
  { name: 'onBar.chipSolidText', fg: onBar.chipSolidText, bg: onBar.chipSolidBg, min: 4.5 },
  { name: 'success', fg: colors.success, bg: colors.paper, min: 4.5 },
  { name: 'danger', fg: colors.danger, bg: colors.paper, min: 4.5 },
  // 선
  { name: 'ink', fg: colors.ink, bg: colors.paper, min: 3 },
  { name: 'slotEmpty', fg: colors.slotEmpty, bg: colors.paper, min: 3 },
  { name: 'onBar.icon', fg: onBar.icon, bg: colors.bar, min: 3 },
  { name: 'onBar.iconInactive', fg: onBar.iconInactive, bg: colors.bar, min: 3 },
];
