// app/src/api/client.ts
import Constants from 'expo-constants';
import { resolveBaseUrl } from './baseUrl';

const BASE_URL = resolveBaseUrl({
  envUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  hostUri: Constants.expoConfig?.hostUri,
  isDev: __DEV__,
});

// 오류 메시지에는 항상 실제 요청 주소를 넣는다. 개발 중 실패 화면에 그대로 보여 원인을 바로 찾게 한다
export async function apiGet<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new Error(`${e instanceof Error ? e.message : String(e)} (${url})`);
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} (${url})`);
  }
  return res.json() as Promise<T>;
}
