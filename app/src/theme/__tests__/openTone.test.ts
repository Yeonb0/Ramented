import { toneColor } from '../openTone';
import { colors } from '../colors';

test.each([
  ['open', colors.success],
  ['stop', colors.danger],
  ['unknown', colors.textMuted],
] as const)('%s → 색', (tone, color) => {
  expect(toneColor(tone)).toBe(color);
});
