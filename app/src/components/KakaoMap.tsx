// app/src/components/KakaoMap.tsx
//
// 카카오맵 JavaScript SDK 를 react-native-webview 로 임베드한 지도 (네이티브)
//   1) 지도는 WebView 안 로컬 HTML (src/map/mapHtml.ts) 에서 그린다
//   2) 로컬 HTML 은 origin 이 비어 카카오 도메인 검증에 실패하므로 baseUrl 로 origin 을 지정한다.
//      이 값은 카카오 [JavaScript SDK 도메인] 에 등록한 주소와 같아야 한다
//   3) RN → WebView : injectJavaScript 로 window.setMarkers 호출
//      WebView → RN : window.ReactNativeWebView.postMessage
// 웹은 KakaoMap.web.tsx (iframe) 가 같은 HTML 을 쓴다

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { buildMapHtml, type LatLng, type MarkerPayload } from '../map/mapHtml';

// 카카오 JS 키는 클라이언트에 노출되는 값이다. 보호는 도메인 허용 목록으로 한다
const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? 'YOUR_KAKAO_JS_KEY';
const BASE_URL = 'https://localhost';

export type KakaoMapProps = {
  markers: MarkerPayload[];
  center: LatLng;
  level: number;
  onMarkerPress: (id: number) => void;
  onMapPress: () => void;
};

export default function KakaoMap({ markers, center, level, onMarkerPress, onMapPress }: KakaoMapProps) {
  const webRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);

  // 중심 · 레벨이 바뀌면 지도를 새로 그리게 되므로 처음 값만 쓴다
  const html = useMemo(
    () => buildMapHtml({ jsKey: KAKAO_JS_KEY, center, level, bridge: 'native' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!ready) return;
    // 끝의 true; 는 iOS WKWebView 경고 방지용
    webRef.current?.injectJavaScript(`window.setMarkers(${JSON.stringify(markers)}); true;`);
  }, [ready, markers]);

  const handleMessage = (e: WebViewMessageEvent) => {
    try {
      const { type, payload } = JSON.parse(e.nativeEvent.data);
      if (type === 'MAP_READY') setReady(true);
      else if (type === 'MARKER_PRESS') onMarkerPress(payload as number);
      else if (type === 'MAP_PRESS') onMapPress();
      else if (type === 'ERROR') console.warn('[KakaoMap WebView]', payload);
    } catch {
      // JSON 이 아니면 무시
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html, baseUrl: BASE_URL }}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always" // Android : 타일 이미지 로딩 안전장치
        style={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
