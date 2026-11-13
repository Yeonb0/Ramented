import { wobble, wobbleStyle } from '../layout';

test('wobbleStyle 은 좌상 · 우상 · 우하 · 좌하 순서', () => {
  expect(wobbleStyle([1, 2, 3, 4])).toEqual({
    borderTopLeftRadius: 1,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 4,
  });
});

test('시트는 아래 모서리가 0 (화면 끝에 붙음)', () => {
  expect(wobble.sheetTop[2]).toBe(0);
  expect(wobble.sheetTop[3]).toBe(0);
});
