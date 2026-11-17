// app/index.tsx
//
// 지도 첫 화면 (breadboard P1 · T1)
//   U1 마포구 지도, U2 기본 마커 30개, U3 불러오는 중, U4 실패 + 다시 시도, U8 미리보기 시트
// 영업 상태 문구는 서버 값을 그대로 쓴다. "가게 보기" (U9) 는 Phase 2

import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import KakaoMap from '../src/components/KakaoMap';
import { PreviewSheet } from '../src/components/PreviewSheet';
import { StateView } from '../src/components/StateView';
import { toOpenTone } from '../src/api/shops';
import { useMapShops } from '../src/hooks/useMapShops';
import { toMarkerPayload } from '../src/map/mapHtml';
import { colors, mapView } from '../src/theme';

export default function MapHome() {
  const { data: Shops, isPending, isError, error, refetch } = useMapShops();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const Markers = useMemo(
    () => (Shops ?? []).map((s) => toMarkerPayload(s, selectedId)),
    [Shops, selectedId],
  );
  const selected = Shops?.find((s) => s.id === selectedId) ?? null;

  const onMarkerPress = useCallback((id: number) => setSelectedId(id), []);
  const onMapPress = useCallback(() => setSelectedId(null), []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KakaoMap
        markers={Markers}
        center={mapView.center}
        level={mapView.level}
        onMarkerPress={onMarkerPress}
        onMapPress={onMapPress}
      />

      {isPending && (
        <View style={styles.overlay}>
          <StateView kind="loading" />
        </View>
      )}
      {isError && (
        <View style={styles.overlay}>
          <StateView
            kind="error"
            onRetry={() => refetch()}
            detail={__DEV__ ? error?.message : undefined}
          />
        </View>
      )}

      {selected && (
        <View style={styles.sheet}>
          <PreviewSheet
            name={selected.name}
            branch={selected.branchName}
            tone={toOpenTone(selected.openState)}
            label={selected.openStateLabel}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.paper,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
