// app/src/map/markerSvg.ts
//
// 지도 마커 SVG 문자열 생성기
// 마커는 RN 이 아니라 카카오맵 WebView 안에서 그려지므로 문자열을 만들어 주입한다
// 색 · 크기 · 선 두께는 전부 theme/marker.ts 에서 읽는다
//
// 좌표는 viewBox 24 x 30 기준 상대값
//   원 (중심 12, 12 · 반지름 10.5) + 아래 꼬리 (끝 12, 29) 가 한 도형
//   안쪽에 그릇 (아래 반원) 과 젓가락 두 줄
// 선은 vector-effect="non-scaling-stroke" 라 마커 크기와 관계없이 토큰 두께 (px) 그대로 그려진다

import { markerTokens, markerSize } from '../theme';

export type MarkerVariant = 'default' | 'selected';

export type MarkerSvg = {
  svg: string;
  width: number;
  height: number;
  anchorX: number;
  anchorY: number;
};

const VIEW_W = 24;
const VIEW_H = 30;

const BODY_PATH = 'M12 29 L8.2 21.8 A10.5 10.5 0 1 1 15.8 21.8 Z';
const BOWL_PATH = 'M6.5 11.5 H17.5 A5.5 5.5 0 0 1 6.5 11.5 Z';
const CHOPSTICKS_PATH = 'M9.5 9.5 L14 5 M11.8 10 L16.6 5.6';

export function buildMarkerSvg(opts: { variant: MarkerVariant }): MarkerSvg {
  const Selected = opts.variant === 'selected';
  const width = Selected ? markerSize.selected : markerSize.default;
  const height = (width * VIEW_H) / VIEW_W;
  const fill = Selected ? markerTokens.fillSelected : markerTokens.fill;
  const { stroke, strokeWidth, glyph, glyphWidth } = markerTokens;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${VIEW_W} ${VIEW_H}">` +
    `<path d="${BODY_PATH}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` +
    `<path d="${BOWL_PATH}" fill="none" stroke="${glyph}" stroke-width="${glyphWidth}" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>` +
    `<path d="${CHOPSTICKS_PATH}" fill="none" stroke="${glyph}" stroke-width="${glyphWidth}" stroke-linecap="round" vector-effect="non-scaling-stroke"/>` +
    `</svg>`;

  return { svg, width, height, anchorX: width / 2, anchorY: height };
}
