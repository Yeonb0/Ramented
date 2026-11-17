import { toOpenTone } from '../shops';

test.each([
  ['OPEN', 'open'],
  ['BREAK', 'stop'],
  ['CLOSED', 'stop'],
  ['DAY_OFF', 'stop'],
  ['UNKNOWN', 'unknown'],
] as const)('%s → %s', (state, tone) => {
  expect(toOpenTone(state)).toBe(tone);
});

test('모르는 새 상태 값이 와도 깨지지 않고 unknown', () => {
  expect(toOpenTone('REPORTED_CLOSED' as never)).toBe('unknown');
});
