import { contrastRatio, ContrastPairs } from '../contrast';
import { colors, onBar } from '../colors';

test('contrastRatio 기준값', () => {
  expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1); // tokens-ok : 대비 공식 검증용 기준값
  expect(contrastRatio('#3B2C21', '#FDF8EE')).toBeCloseTo(12.65, 1); // tokens-ok
});

test.each(ContrastPairs)('$name 대비 $min 이상', ({ fg, bg, min }) => {
  expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
});

test('글자 · 반전 색 토큰은 전부 대비 목록에 있다', () => {
  const Checked = new Set(ContrastPairs.map((p) => p.name));
  const TextKeys = Object.keys(colors).filter((k) => k.startsWith('text') || k.startsWith('on'));
  // 갈색 바 위 글자 · 아이콘 (배경 · 테두리 키는 짝의 bg 쪽이라 제외)
  const BarKeys = Object.keys(onBar)
    .filter((k) => /^(text|icon)|Text$/.test(k))
    .map((k) => `onBar.${k}`);
  [...TextKeys, ...BarKeys].forEach((k) => expect(Checked.has(k)).toBe(true));
});
