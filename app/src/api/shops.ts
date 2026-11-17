// app/src/api/shops.ts
//
// GET /api/shops — 지도 데이터 (docs/api-contract-v2.md § 1)
// 백엔드 MapShopResponse record 와 필드를 1 : 1 로 맞춘다

import type { OpenTone } from '../theme';
import { apiGet } from './client';

export type OpenState = 'OPEN' | 'BREAK' | 'CLOSED' | 'DAY_OFF' | 'UNKNOWN';

export type MapShop = {
  id: number;
  name: string; // 지점명을 뺀 이름
  branchName: string | null;
  latitude: number;
  longitude: number;
  openState: OpenState;
  openStateLabel: string; // 시트에 그대로 쓰는 한 줄. 앱에서 조합하지 않는다
};

export function fetchMapShops(): Promise<MapShop[]> {
  return apiGet<MapShop[]>('/api/shops');
}

// 서버가 계산한 상태를 색 톤으로만 나눈다 (영업 여부를 다시 계산하지 않음)
// 서버에 새 상태가 생겨도 앱이 깨지지 않게, 모르는 값은 unknown
const ToneByState: Record<OpenState, OpenTone> = {
  OPEN: 'open',
  BREAK: 'stop',
  CLOSED: 'stop',
  DAY_OFF: 'stop',
  UNKNOWN: 'unknown',
};

export function toOpenTone(state: OpenState): OpenTone {
  return ToneByState[state] ?? 'unknown';
}
