import { apiGet } from '../client';

const realFetch = global.fetch;
afterEach(() => {
  global.fetch = realFetch;
});

test('네트워크 오류에는 실제 요청 주소를 붙인다 (실패 원인을 화면에서 바로 보게)', async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed'));
  await expect(apiGet('/api/shops')).rejects.toThrow(/Network request failed.*\/api\/shops/);
});

test('HTTP 오류에도 상태 코드와 주소가 들어간다', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' });
  await expect(apiGet('/api/shops')).rejects.toThrow(/500.*\/api\/shops/);
});
