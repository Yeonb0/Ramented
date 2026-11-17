import { buildMapHtml, toMarkerPayload } from '../mapHtml';
import { buildMarkerSvg } from '../markerSvg';
import { mapSkeleton } from '../../theme';

const Center = { latitude: 37.556, longitude: 126.92 };

test('네이티브는 ReactNativeWebView, 웹은 부모 창으로 메시지를 보낸다', () => {
  const Native = buildMapHtml({ jsKey: 'k', center: Center, level: 5, bridge: 'native' });
  const Web = buildMapHtml({ jsKey: 'k', center: Center, level: 5, bridge: 'web' });
  expect(Native).toContain('window.ReactNativeWebView.postMessage');
  expect(Native).not.toContain('window.parent.postMessage');
  expect(Web).toContain('window.parent.postMessage');
});

test('타일을 받기 전 바탕은 토큰 색 (WebView 에 색을 직접 쓰지 않는다)', () => {
  const Html = buildMapHtml({ jsKey: 'k', center: Center, level: 5, bridge: 'web' });
  expect(Html).toContain(`background: ${mapSkeleton.tile}`);
  const Hex = Html.match(/#[0-9A-Fa-f]{6}\b/g) ?? [];
  expect(Hex.every((h) => h === mapSkeleton.tile)).toBe(true);
});

test('카카오 기본 마커 · 정보창을 쓰지 않는다', () => {
  const Html = buildMapHtml({ jsKey: 'k', center: Center, level: 5, bridge: 'native' });
  expect(Html).not.toContain('kakao.maps.Marker(');
  expect(Html).not.toContain('InfoWindow');
  expect(Html).toContain('kakao.maps.CustomOverlay');
});

test('선택된 가게만 선택 마커 SVG 를 받는다', () => {
  const Shop = { id: 3, latitude: 37.5, longitude: 126.9 };
  expect(toMarkerPayload(Shop, 3).svg).toBe(buildMarkerSvg({ variant: 'selected' }).svg);
  expect(toMarkerPayload(Shop, 7).svg).toBe(buildMarkerSvg({ variant: 'default' }).svg);
  expect(toMarkerPayload(Shop, null).id).toBe(3);
});

test('지도가 준비되면 메시지와 별개로 window.__mapReady 를 세운다 (리스너보다 먼저 준비돼도 놓치지 않게)', () => {
  const Html = buildMapHtml({ jsKey: 'k', center: Center, level: 5, bridge: 'web' });
  expect(Html).toMatch(/window\.__mapReady = true;\s*send\('MAP_READY'\)/);
});
