import { getButtonStyle, ribbonStyle, noteSheetStyle } from '../components';
import { colors, borderWidth } from '..';

test('버튼은 네 면 모두 같은 두께 (아래만 두꺼운 그림자처럼 보이는 선 없음)', () => {
  [false, true].forEach((pressed) => {
    const C = getButtonStyle('primary', pressed).container;
    expect(C.borderWidth).toBe(borderWidth.outline);
    expect(C.borderBottomWidth).toBeUndefined();
    expect(C.marginTop).toBeUndefined();
    expect(C.transform).toBeUndefined();
  });
});

test('누르면 면 색이 한 단계 진해진다', () => {
  expect(getButtonStyle('primary', true).container.backgroundColor).toBe(colors.primaryPressed);
  expect(getButtonStyle('secondary', true).container.backgroundColor).toBe(colors.paperSunken);
});

test('주요 버튼은 primary 면 + onPrimary 글자', () => {
  const B = getButtonStyle('primary', false);
  expect(B.container.backgroundColor).toBe(colors.primary);
  expect(B.labelColor).toBe(colors.onPrimary);
});

test('리본은 V자 홈 없는 네모 띠', () => {
  expect(ribbonStyle.backgroundColor).toBe(colors.ribbon);
  expect(ribbonStyle.borderWidth).toBe(borderWidth.inner);
  expect(ribbonStyle.borderColor).toBe(colors.ink);
});

test('시트는 위 테두리만', () => {
  expect(noteSheetStyle.borderTopWidth).toBe(borderWidth.outline);
  expect(noteSheetStyle.borderBottomWidth).toBe(0);
});

test('그림자 속성이 없다', () => {
  const All = JSON.stringify([getButtonStyle('primary', false), noteSheetStyle, ribbonStyle]);
  expect(All).not.toMatch(/shadow|elevation/); // tokens-ok : 그림자가 없는지 검사하는 정규식
});
