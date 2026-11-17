// app/src/map/mapHtml.ts
//
// 카카오맵 WebView (네이티브) · iframe (웹) 이 같이 쓰는 지도 HTML
// 두 컴포넌트에 같은 HTML 이 두 벌 있던 v1 기술 부채를 여기로 합쳤다. 다른 점은 메시지 통로 (bridge) 뿐이다
//
// 마커는 카카오 기본 마커가 아니라 CustomOverlay 에 SVG 문자열을 그대로 넣는다
// SVG 는 RN 쪽 buildMarkerSvg 가 토큰으로 만들어 넘기므로, 이 HTML 에는 색이 없다 (바탕 스켈레톤 색만 토큰에서 주입)
//
// 메시지 (WebView → RN)
//   MAP_READY      지도 준비 끝. window.__mapReady 도 같이 세운다 (웹에서 리스너보다 먼저 준비되는 경우 대비)
//   MARKER_PRESS   마커 탭 (payload = 가게 id)
//   MAP_PRESS      마커 밖 지도 탭 (시트 닫기)
//   ERROR          WebView 안 스크립트 오류
// 호출 (RN → WebView)
//   window.setMarkers(list)  list = MarkerPayload[]

import { mapSkeleton } from '../theme';
import { buildMarkerSvg } from './markerSvg';

export type LatLng = { latitude: number; longitude: number };

export type MapBridge = 'native' | 'web';

export type MarkerPayload = {
  id: number;
  latitude: number;
  longitude: number;
  svg: string;
};

const SendBody: Record<MapBridge, string> = {
  native:
    'if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload })); }',
  web: "window.parent.postMessage(JSON.stringify({ type: type, payload: payload }), '*');",
};

/** 가게 하나를 WebView 에 넘길 마커 모양으로. 선택된 가게만 선택 마커 */
export function toMarkerPayload(
  shop: { id: number; latitude: number; longitude: number },
  selectedId: number | null,
): MarkerPayload {
  const M = buildMarkerSvg({ variant: shop.id === selectedId ? 'selected' : 'default' });
  return { id: shop.id, latitude: shop.latitude, longitude: shop.longitude, svg: M.svg };
}

export function buildMapHtml(opts: {
  jsKey: string;
  center: LatLng;
  level: number;
  bridge: MapBridge;
}): string {
  const { jsKey, center, level, bridge } = opts;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: ${mapSkeleton.tile}; }
    .marker { cursor: pointer; line-height: 0; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&autoload=false"></script>
  <script>
    function send(type, payload) { ${SendBody[bridge]} }
    window.onerror = function (message) { send('ERROR', String(message)); };

    var map = null;
    var overlays = [];

    window.setMarkers = function (list) {
      if (!map) return;
      overlays.forEach(function (o) { o.setMap(null); });
      overlays = [];
      list.forEach(function (s) {
        var el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = s.svg;
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          send('MARKER_PRESS', s.id);
        });
        var overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(s.latitude, s.longitude),
          content: el,
          xAnchor: 0.5,
          yAnchor: 1,
          clickable: true
        });
        overlay.setMap(map);
        overlays.push(overlay);
      });
    };

    kakao.maps.load(function () {
      map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(${center.latitude}, ${center.longitude}),
        level: ${level}
      });
      kakao.maps.event.addListener(map, 'click', function () { send('MAP_PRESS'); });
      window.__mapReady = true;
      send('MAP_READY');
    });
  </script>
</body>
</html>`;
}
