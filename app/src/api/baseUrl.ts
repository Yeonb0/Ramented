// app/src/api/baseUrl.ts
//
// 백엔드 주소 고르기
//   1) .env 의 EXPO_PUBLIC_API_BASE_URL (배포 빌드 · 터널처럼 직접 지정할 때)
//   2) 개발 중이면 QR 로 접속한 PC 의 IP + 백엔드 포트
//      → 학교 · 집처럼 네트워크가 바뀌어도 .env 를 고치지 않아도 된다
//   3) 웹 · 시뮬레이터처럼 PC 안에서 돌 때는 localhost

const BACKEND_PORT = 8080;

export function resolveBaseUrl(opts: {
  envUrl: string | undefined;
  hostUri: string | undefined; // Expo 개발 서버 주소. 예 : "192.168.0.23:8081"
  isDev: boolean;
}): string {
  const { envUrl, hostUri, isDev } = opts;
  if (envUrl) return envUrl;
  const host = hostUri?.split(':')[0];
  if (isDev && host) return `http://${host}:${BACKEND_PORT}`;
  return `http://localhost:${BACKEND_PORT}`;
}
