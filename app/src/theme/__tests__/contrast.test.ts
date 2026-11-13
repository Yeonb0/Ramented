import { contrastRatio, ContrastPairs } from '../contrast';
import { colors } from '../colors';

test('contrastRatio 기준값', () => {
  expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  expect(contrastRatio('#3B2C21', '#FDF8EE')).toBeCloseTo(12.65, 1);
});

test.each(ContrastPairs)('$name 대비 $min 이상', ({ fg, bg, min }) => {
  expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
});

test('글자 · 반전 색 토큰은 전부 대비 목록에 있다', () => {
  const Checked = new Set(ContrastPairs.map((p) => p.name));
  const TextKeys = Object.keys(colors).filter((k) => k.startsWith('text') || k.startsWith('on'));
  TextKeys.forEach((k) => expect(Checked.has(k)).toBe(true));
  expect(Checked.has('onBar.text')).toBe(true);
});
