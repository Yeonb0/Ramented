// app/src/components/KakaoMap.web.tsx
//
// 웹(브라우저) 전용 카카오맵 컴포넌트.
//
// 왜 별도 파일인가:
//   react-native-webview 는 웹을 지원하지 않는다. 그래서 웹에서는 WebView 대신
//   <iframe> 으로 같은 HTML 을 렌더링한다.
//   Expo(Metro)는 웹 번들링 시 `.web.tsx` 를 자동으로 우선 선택하므로,
//   import 구문은 그대로 두면 된다. (import KakaoMap from './KakaoMap')
//     - 웹   → KakaoMap.web.tsx  (이 파일)
//     - 폰   → KakaoMap.tsx      (WebView 버전)
//
// 통신 방식 (WebView 와 대응):
//   RN(WebView) : injectJavaScript                 → 웹: iframe.contentWindow.postMessage
//   WebView→RN  : ReactNativeWebView.postMessage   → 웹: window.parent.postMessage

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? 'YOUR_KAKAO_JS_KEY';

// ⚠️ 카카오 개발자 콘솔 [JavaScript SDK 도메인]에
//    http://localhost:8081 을 반드시 추가해야 한다.
//    (srcDoc iframe 은 부모 문서의 origin 을 그대로 물려받는다)

export type ShopMarker = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

type LatLng = { latitude: number; longitude: number };

type Props = {
  markers?: ShopMarker[];
  center?: LatLng;
  level?: number;
  onMapReady?: () => void;
  onMarkerPress?: (id: number) => void;
};

const DEFAULT_CENTER: LatLng = { latitude: 37.5665, longitude: 126.978 }; // 서울시청

function buildMapHtml(jsKey: string, center: LatLng, level: number): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&autoload=false"></script>
  <script>
    // iframe -> 부모(React) 로 메시지 전달
    function send(type, payload) {
      window.parent.postMessage(JSON.stringify({ type: type, payload: payload }), '*');
    }
    window.onerror = function (message) { send('ERROR', String(message)); };

    var map = null;
    var markerObjs = [];
    var infoWindow = null;

    function setMarkers(list) {
      if (!map) return;
      markerObjs.forEach(function (m) { m.setMap(null); });
      markerObjs = [];
      list.forEach(function (s) {
        var pos = new kakao.maps.LatLng(s.latitude, s.longitude);
        var marker = new kakao.maps.Marker({ position: pos, map: map, title: s.name });
        kakao.maps.event.addListener(marker, 'click', function () {
          infoWindow.setContent(
            '<div style="padding:6px 10px;font-size:13px;white-space:nowrap;">' + s.name + '</div>'
          );
          infoWindow.open(map, marker);
          send('MARKER_PRESS', s.id);
        });
        markerObjs.push(marker);
      });
    }

    // 부모(React) -> iframe 메시지 수신
    window.addEventListener('message', function (e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'SET_MARKERS') setMarkers(msg.payload);
      } catch (err) { /* JSON 아니면 무시 */ }
    });

    kakao.maps.load(function () {
      map = new kakao.maps.Map(document.getElementById('map'), {
        center: new kakao.maps.LatLng(${center.latitude}, ${center.longitude}),
        level: ${level}
      });
      infoWindow = new kakao.maps.InfoWindow({ removable: true });
      send('MAP_READY');
    });
  </script>
</body>
</html>`;
}

export default function KakaoMap({
  markers = [],
  center = DEFAULT_CENTER,
  level = 5,
  onMapReady,
  onMarkerPress,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const pushMarkers = useCallback((list: ShopMarker[]) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ type: 'SET_MARKERS', payload: list }),
      '*'
    );
  }, []);

  // iframe 에서 오는 메시지 수신
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // 우리 iframe 이 보낸 것만 처리 (다른 스크립트의 postMessage 무시)
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const { type, payload } = JSON.parse(e.data);
        if (type === 'MAP_READY') {
          setReady(true);
          setLoading(false);
          onMapReady?.();
        } else if (type === 'MARKER_PRESS') {
          onMarkerPress?.(payload as number);
        } else if (type === 'ERROR') {
          console.warn('[KakaoMap iframe]', payload);
        }
      } catch {
        // JSON 이 아니면 무시
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onMapReady, onMarkerPress]);

  // 지도가 준비된 뒤(그리고 markers 가 바뀔 때마다) 마커 주입
  useEffect(() => {
    if (ready) pushMarkers(markers);
  }, [ready, markers, pushMarkers]);

  const html = buildMapHtml(KAKAO_JS_KEY, center, level);

  return (
    <View style={styles.container}>
      <iframe
        ref={iframeRef}
        srcDoc={html}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="카카오맵"
      />
      {loading && (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});