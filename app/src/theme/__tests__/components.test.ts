import { getButtonStyle, ribbonPath, noteSheetStyle, ribbon } from '../components';
import { colors, borderWidth } from '..';

// 레이아웃이 차지하는 세로 크기. transform 은 레이아웃에 참여하지 않으므로 넣지 않는다
const vSum = (s: any) =>
  (s.borderTopWidth ?? s.borderWidth) + s.borderBottomWidth + (s.marginTop ?? 0) + (s.marginBottom ?? 0);

test('버튼 ② : 아래 테두리 두껍게, 눌리면 얇아지고 내려간다', () => {
  const Up = getButtonStyle('primary', false).container;
  const Down = getButtonStyle('primary', true).container;
  expect(Up.borderBottomWidth).toBe(borderWidth.buttonBase);
  expect(Down.borderBottomWidth).toBe(borderWidth.outline);
  expect(vSum(Down)).toBe(vSum(Up));
});

test('주요 버튼은 primary 면 + onPrimary 글자', () => {
  const B = getButtonStyle('primary', false);
  expect(B.container.backgroundColor).toBe(colors.primary);
  expect(B.labelColor).toBe(colors.onPrimary);
});

test('리본 path 는 폭이 커져도 닫힌 도형', () => {
  [120, 320].forEach((w) => {
    const P = ribbonPath(w, 32);
    expect(P.startsWith('M')).toBe(true);
    expect(P.trim().endsWith('Z')).toBe(true);
    expect(P).toContain(String(w));
  });
});

test('시트는 위 테두리만', () => {
  expect(noteSheetStyle.borderTopWidth).toBe(borderWidth.outline);
  expect(noteSheetStyle.borderBottomWidth).toBe(0);
});

test('그림자 속성이 없다', () => {
  const All = JSON.stringify([getButtonStyle('primary', false), noteSheetStyle]);
  expect(All).not.toMatch(/shadow|elevation/); // tokens-ok : 그림자가 없는지 검사하는 정규식
});

test('리본 V자 홈 깊이는 높이가 커져도 고정 (큰 글씨에서 글자를 가리지 않게)', () => {
  const Depth = ribbon.height * ribbon.notchRatio;
  expect(ribbonPath(200, 104)).toContain(`L${200 - Depth} 52`);
  expect(Depth).toBeLessThan(ribbon.paddingHorizontal - ribbon.strokeWidth);
});
