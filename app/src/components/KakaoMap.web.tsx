// app/src/components/KakaoMap.web.tsx
//
// 웹 (Expo web) 용 카카오맵. 네이티브와 같은 HTML (src/map/mapHtml.ts) 을 iframe srcDoc 으로 띄운다
//   iframe → 부모 : window.parent.postMessage
//   부모 → iframe : srcDoc iframe 은 부모와 같은 origin 이라 contentWindow.setMarkers 를 바로 부른다
// 카카오 [JavaScript SDK 도메인] 에 웹 개발 주소 (http://localhost:8081 등) 가 등록되어 있어야 지도가 뜬다

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { buildMapHtml, type MarkerPayload } from '../map/mapHtml';
import type { KakaoMapProps } from './KakaoMap';

const KAKAO_JS_KEY = process.env.EXPO_PUBLIC_KAKAO_JS_KEY ?? 'YOUR_KAKAO_JS_KEY';

type MapWindow = Window & { setMarkers?: (list: MarkerPayload[]) => void; __mapReady?: boolean };

export default function KakaoMap({ markers, center, level, onMarkerPress, onMapPress }: KakaoMapProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);

  const html = useMemo(
    () => buildMapHtml({ jsKey: KAKAO_JS_KEY, center, level, bridge: 'web' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // 우리 iframe 이 보낸 것만 처리
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const { type, payload } = JSON.parse(e.data);
        if (type === 'MAP_READY') setReady(true);
        else if (type === 'MARKER_PRESS') onMarkerPress(payload as number);
        else if (type === 'MAP_PRESS') onMapPress();
        else if (type === 'ERROR') console.warn('[KakaoMap iframe]', payload);
      } catch {
        // JSON 이 아니면 무시
      }
    };
    window.addEventListener('message', handler);
    // 정적 웹 빌드에서는 iframe 이 서버 HTML 에 먼저 들어 있어, 리스너를 붙이기 전에 MAP_READY 가 지나갈 수 있다
    if ((iframeRef.current?.contentWindow as MapWindow | null)?.__mapReady) setReady(true);
    return () => window.removeEventListener('message', handler);
  }, [onMarkerPress, onMapPress]);

  useEffect(() => {
    if (!ready) return;
    (iframeRef.current?.contentWindow as MapWindow | null)?.setMarkers?.(markers);
  }, [ready, markers]);

  return (
    <View style={styles.container}>
      <iframe ref={iframeRef} srcDoc={html} style={IframeStyle} title="카카오맵" />
    </View>
  );
}

const IframeStyle = { width: '100%', height: '100%', border: 'none' } as const;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
