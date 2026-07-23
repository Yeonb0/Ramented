// app/src/api/shops.ts
import { apiGet } from './client';

// 백엔드 ShopResponse record 와 필드를 1:1로 맞춘다. (하나의 API 계약)
export type Shop = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  region: string;
  businessHours: string;
  description: string;
};

export function fetchShops(): Promise<Shop[]> {
  return apiGet<Shop[]>('/api/shops');
}