// app/index.tsx
import { Stack } from 'expo-router';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import KakaoMap, { type ShopMarker } from '../src/components/KakaoMap';
import { useShops } from '../src/hooks/useShops';
import { useEffect } from 'react';

export default function Index() {


  // ... Index 컴포넌트 안에
  useEffect(() => {
    const HOST = 'http://192.168.200.162';
    // 8081: 폰이 확실히 닿는 포트 (대조군)
    fetch(`${HOST}:8081/status`)
      .then((r) => r.text())
      .then((t) => console.log('✅ 8081 OK:', t))
      .catch((e) => console.log('❌ 8081 실패:', e.message));
    // 8080: 우리 백엔드 (실험군)
    fetch(`${HOST}:8080/api/shops`)
      .then((r) => r.text())
      .then((t) => console.log('✅ 8080 OK:', t.slice(0, 80)))
      .catch((e) => console.log('❌ 8080 실패:', e.message));

    // 현재 앱이 실제로 쓰는 값도 같이 확인
    console.log('BASE_URL =', process.env.EXPO_PUBLIC_API_BASE_URL);
  }, []);
  const { data: shops, isLoading, isError, error } = useShops();

  // Shop[] → ShopMarker[] (KakaoMap 이 요구하는 최소 형태로 변환)
  const markers: ShopMarker[] =
    shops?.map((s) => ({
      id: s.id,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
    })) ?? [];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KakaoMap markers={markers} onMarkerPress={(id) => console.log('탭한 가게 id:', id)} />

      {isLoading && (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" />
        </View>
      )}
      {isError && (
        <View style={styles.overlay}>
          <Text style={styles.err}>불러오기 실패: {String(error)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  err: { color: 'crimson', padding: 16, textAlign: 'center' },
});

