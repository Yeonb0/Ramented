import { resolveBaseUrl } from '../baseUrl';

test('.env 에 주소가 있으면 그 값을 먼저 쓴다 (배포 빌드 · 터널)', () => {
  expect(resolveBaseUrl({ envUrl: 'https://api.example.com', hostUri: '192.168.0.23:8081', isDev: true }))
    .toBe('https://api.example.com');
});

test('개발 중에는 QR 로 접속한 PC IP 에 백엔드 포트 8080 을 붙인다', () => {
  expect(resolveBaseUrl({ envUrl: undefined, hostUri: '192.168.0.23:8081', isDev: true }))
    .toBe('http://192.168.0.23:8080');
});

test('.env 값이 빈 문자열이면 없는 것으로 본다', () => {
  expect(resolveBaseUrl({ envUrl: '', hostUri: '10.0.0.5:8081', isDev: true })).toBe('http://10.0.0.5:8080');
});

test('웹 · 시뮬레이터처럼 hostUri 가 없으면 localhost', () => {
  expect(resolveBaseUrl({ envUrl: undefined, hostUri: undefined, isDev: true })).toBe('http://localhost:8080');
});

test('배포 빌드에서는 개발 서버 주소를 쓰지 않는다', () => {
  expect(resolveBaseUrl({ envUrl: undefined, hostUri: '192.168.0.23:8081', isDev: false })).toBe('http://localhost:8080');
});
