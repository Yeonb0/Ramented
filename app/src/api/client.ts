// app/src/api/client.ts
import Constants from 'expo-constants';
import { resolveBaseUrl } from './baseUrl';

const BASE_URL = resolveBaseUrl({
  envUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  hostUri: Constants.expoConfig?.hostUri,
  isDev: __DEV__,
});

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API ${path} 실패: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
