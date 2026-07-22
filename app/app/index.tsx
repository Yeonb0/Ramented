// app/index.tsx
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import KakaoMap, { type ShopMarker } from '../src/components/KakaoMap';

const SAMPLE: ShopMarker[] = [
  { id: 1, name: '멘야 산다이메', latitude: 37.5563, longitude: 126.9236 },
  { id: 2, name: '하카타 분코',   latitude: 37.5045, longitude: 127.0490 },
];

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KakaoMap
        markers={SAMPLE}
        onMapReady={() => console.log('지도 준비 완료')}
        onMarkerPress={(id) => console.log('탭한 가게 id:', id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });