import { buildMarkerSvg } from '../markerSvg';
import { markerTokens, markerSize } from '../../theme';

test('기본 마커는 종이 면 + 펜 선', () => {
  const M = buildMarkerSvg({ variant: 'default' });
  expect(M.svg).toContain(`fill="${markerTokens.fill}"`);
  expect(M.svg).toContain(`stroke="${markerTokens.stroke}"`);
  expect(M.width).toBe(markerSize.default);
});

test('선택 마커는 한 단계 크고 면이 fillSoft', () => {
  const M = buildMarkerSvg({ variant: 'selected' });
  expect(M.svg).toContain(`fill="${markerTokens.fillSelected}"`);
  expect(M.width).toBe(markerSize.selected);
});

test.each(['default', 'selected'] as const)('%s 마커의 기준점은 가운데 아래', (variant) => {
  const M = buildMarkerSvg({ variant });
  expect(M.anchorX).toBe(M.width / 2);
  expect(M.anchorY).toBe(M.height);
});

test('그림자 · 그라디언트 요소가 없다', () => {
  const S = buildMarkerSvg({ variant: 'default' }).svg;
  expect(S).not.toMatch(/filter|Gradient|feDropShadow/);
});
