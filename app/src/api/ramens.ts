// app/src/api/ramens.ts
import { apiGet } from './client';

// 백엔드 enum 이름과 1:1. theme.ts 의 markerColors / formShapes 키와 직접 맞물린다.
export type SoupBase = 'PORK' | 'CHICKEN' | 'BEEF' | 'DUCK' | 'SEAFOOD' | 'VEGETABLE' | 'MIXED' | 'ETC';
export type Clarity = 'SEITAN' | 'PAITAN';
export type Temperature = 'HOT' | 'COLD';
export type Tare = 'SHIO' | 'SHOYU' | 'MISO' | 'SPICY' | 'ETC';
export type Form = 'RAMEN' | 'TSUKEMEN' | 'MAZESOBA' | 'ABURASOBA' | 'ETC';
export type Style = 'JIRO' | 'IEKEI' | 'HAKATA' | 'SAPPORO' | 'TOKYO' | 'ETC';

export type Ramen = {
  id: number;
  name: string;
  soupBase: SoupBase | null;   // 무국물이면 null
  clarity: Clarity | null;     // 무국물이면 null
  temperature: Temperature;
  tare: Tare;
  form: Form;
  style: Style | null;
  description: string | null;
  shopCount: number;
};

export function fetchRamens(): Promise<Ramen[]> {
  return apiGet<Ramen[]>('/api/ramens');
}