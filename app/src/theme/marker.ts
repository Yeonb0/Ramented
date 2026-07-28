// app/src/theme/marker.ts
//
// 지도 마커 토큰.
//
// 이 파일이 별도로 분리된 이유: 여기 값들은 RN 뿐 아니라 **카카오맵 WebView 안**에서도
// 쓰인다. src/map/ 이 이 파일만 읽어 SVG 문자열을 만들고 주입하므로,
// 색 정의가 두 벌이 되는 사고를 구조적으로 막는다.
// WebView 쪽에 헥사값을 직접 쓰는 코드가 생기면 그건 버그다.
//
// Ramen 은 6축(SoupBase/Clarity/Temperature/Tare/Form) 모델이라
// "라멘 이름당 색 하나"로는 조합이 늘어날 때 감당이 안 된다.
// 그래서 색은 Tare × Clarity 로 키를 잡고 6개를 하드코딩했다.
// 모든 라멘이 tare 를 가지므로 새 조합이 들어와도 색은 항상 결정된다.
//
//   색상    = 타래(Tare)     시오 청회색 / 쇼유 앰버 / 미소 벽돌
//   명도    = 탁도(Clarity)  PAITAN 은 뿌옇게, SEITAN 은 원색
//   내부 마크 = 형태(Form)    라멘 원 / 츠케멘 사각 / 마제소바 마름모
//
// PAITAN 계열은 지도 배경(회색빛)과 명도가 가까워서 stroke 로 버틴다.
// stroke 는 장식이 아니라 가독성 장치이므로 지우지 말 것.

export type MarkerStyle = {
  fill: string;
  stroke: string;
  mark: string; // 내부 형태 마크 색
};

export type Tare = 'SHIO' | 'SHOYU' | 'MISO';
export type Clarity = 'PAITAN' | 'SEITAN';

export const markerColors = {
  SHIO_PAITAN: { fill: '#DBD0BA', stroke: '#85694A', mark: '#5E4835' }, // 돈코츠 라멘
  SHIO_SEITAN: { fill: '#6E9BB8', stroke: '#4F7A96', mark: '#FDFAF4' }, // 시오 츠케멘
  SHOYU_PAITAN: { fill: '#E0CBA0', stroke: '#A9884E', mark: '#5E4835' }, // 토리파이탄 쇼유
  SHOYU_SEITAN: { fill: '#C08A2E', stroke: '#96690F', mark: '#FDFAF4' }, // 마제소바
  MISO_PAITAN: { fill: '#D9B6A6', stroke: '#A9705A', mark: '#6E3A28' }, // 미소 라멘
  MISO_SEITAN: { fill: '#A8503A', stroke: '#83381F', mark: '#FDFAF4' },
} as const satisfies Record<string, MarkerStyle>;

// 필터를 걸지 않은 상태의 마커.
// 한 가게가 여러 라멘을 취급하므로 색을 쓰면 마커가 거짓말을 한다.
// 중립색 + 취급 종류 수 배지로 두고, 상세는 바텀시트에서 칩으로 펼친다.
// (예외: isSpecialist === true 인 가게는 취급 라멘이 하나뿐이라
//  markerColors 의 해당 색을 그대로 써도 정확하다.)
export const markerNeutral: MarkerStyle = {
  fill: '#A89078',
  stroke: '#85705A',
  mark: '#FDFAF4',
};

// 라멘 필터에서 제외된 가게. 지우지 않고 흐린 점선 원으로 남겨
// "이 동네에 가게는 있지만 이 라멘은 안 판다"는 정보를 유지한다.
export const markerDimmed = {
  fill: 'transparent',
  stroke: '#B7AE9E',
  strokeDasharray: '3 3',
  size: 20,
} as const;

export const markerSize = {
  default: 36,
  selected: 44, // 선택 시 이름 + 별점 라벨이 함께 붙는다
} as const;

/**
 * 마커가 가질 수 있는 세 가지 상태.
 * src/map/markerSvg.ts 의 buildMarkerSvg() 가 이 값으로 분기한다.
 *   colored — 라멘 필터가 걸린 상태. tare × clarity 색 + form 마크
 *   neutral — 필터 없는 상태. 중립색 + 취급 라멘 수 배지
 *   dimmed  — 필터에서 제외된 가게. 점선 회색 원
 */
export type MarkerState = 'colored' | 'neutral' | 'dimmed';

export type MarkerShape = 'circle' | 'square' | 'diamond';

export const formShapes = {
  RAMEN: 'circle',
  TSUKEMEN: 'square',
  MAZESOBA: 'diamond',
} as const satisfies Record<string, MarkerShape>;

/** Ramen 의 tare/clarity 로 마커 색을 고른다. clarity 가 없으면(마제소바 등) SEITAN 취급. */
export function getMarkerStyle(
  tare: Tare,
  clarity: Clarity | null | undefined,
): MarkerStyle {
  const key = `${tare}_${clarity ?? 'SEITAN'}` as keyof typeof markerColors;
  return markerColors[key] ?? markerNeutral;
}

// 카카오맵 WebView 가 타일을 받아오기 전 깔아둘 스켈레톤 색.
// 흰 화면에서 지도가 튀어나오는 것보다 덜 거슬린다.
export const mapSkeleton = {
  tile: '#EAE6DE',
  road: '#F4F2EC',
  park: '#E1E6D8',
  water: '#DDE4E8',
} as const;
