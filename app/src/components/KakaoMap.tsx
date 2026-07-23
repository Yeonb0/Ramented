// app/src/components/KakaoMap.tsx
//
// 카카오맵 Web(JavaScript) SDK를 react-native-webview로 임베드한 지도 컴포넌트.
// 핵심 아이디어:
//   1) 지도는 WebView 안의 로컬 HTML에서 카카오 JS SDK로 그린다.
//   2) 로컬 HTML은 origin이 비어 카카오 도메인 검증에 실패하므로,
//      source에 baseUrl을 지정해 origin을 강제한다. 이 값은 카카오
//      [JavaScript SDK 도메인]에 등록한 주소와 반드시 일치해야 한다.
//   3) RN -> WebView: injectJavaScript 로 마커를 주입.
//      WebView -> RN: window.ReactNativeWebView.postMessage 로 이벤트 전달.

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

// .env 의 EXPO_PUBLIC_KAKAO_JS_KEY 를 우선 사용하고, 없으면 자리표시자.
// 참고: 카카오 JS 키는 클라이언트에 노출되는 값이라 '비밀'이 아니다.
// 보호는 도메인 허용목록으로 이뤄지므로 EXPO_PUBLIC_ 로 두어도 안전하다.
const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? 'YOUR_KAKAO_JS_KEY';

// 카카오 [JavaScript SDK 도메인]에 등록한 값과 100% 동일해야 함.
const BASE_URL = 'https://localhost';

export type ShopMarker = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

type LatLng = { latitude: number; longitude: number };

type Props = {
  markers?: ShopMarker[];
  center?: LatLng; // 초기 지도 중심
  level?: number; // 확대 레벨 (작을수록 더 확대)
  onMapReady?: () => void;
  onMarkerPress?: (id: number) => void;
};

const DEFAULT_CENTER: LatLng = { latitude: 37.5665, longitude: 126.978 }; // 서울시청

function buildMapHtml(jsKey: string, center: LatLng, level: number): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&autoload=false"></script>
  <script>
    // RN 으로 메시지 보내는 헬퍼
    function send(type, payload) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
      }
    }
    // WebView 내부 에러도 RN 콘솔로 넘겨 디버깅 (지도가 안 뜰 때 원인 확인용)
    window.onerror = function (message) { send('ERROR', String(message)); };

    var map = null;
    var markerObjs = [];
    var infoWindow = null;

    // RN 이 injectJavaScript 로 호출: 기존 마커 제거 후 새 마커로 교체
    window.setMarkers = function (list) {
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
    };

    // autoload=false 이므로 명시적으로 로드 (WebView 타이밍 이슈 방지)
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
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const pushMarkers = useCallback((list: ShopMarker[]) => {
    // 끝의 true; 는 iOS WKWebView 경고 방지용
    const js = `window.setMarkers(${JSON.stringify(list)}); true;`;
    webRef.current?.injectJavaScript(js);
  }, []);

  // 지도가 준비된 뒤(그리고 markers 가 바뀔 때마다) 마커 주입.
  // markers 는 안정적인 참조를 넘기는 게 좋다(외부 상수 or TanStack Query 캐시).
  useEffect(() => {
    if (ready) pushMarkers(markers);
  }, [ready, markers, pushMarkers]);

  const handleMessage = (e: WebViewMessageEvent) => {
    try {
      const { type, payload } = JSON.parse(e.nativeEvent.data);
      if (type === 'MAP_READY') {
        setReady(true);
        onMapReady?.();
      } else if (type === 'MARKER_PRESS') {
        onMarkerPress?.(payload as number);
      } else if (type === 'ERROR') {
        console.warn('[KakaoMap WebView]', payload);
      }
    } catch {
      // JSON 이 아니면 무시
    }
  };

  const html = buildMapHtml(KAKAO_JS_KEY, center, level);

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html, baseUrl: BASE_URL }}
        onMessage={handleMessage}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always" // Android: 타일 이미지 로딩 안전장치
        style={styles.webview}
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
  webview: { flex: 1 },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});