// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { fontFamily } from '../src/theme';

const queryClient = new QueryClient(); // 앱 생애주기 내내 하나만 유지 (모듈 최상단)

export default function RootLayout() {
  // 등록 key 가 곧 fontFamily 이름. theme/typography.ts 와 철자가 같아야 한다
  const [fontsLoaded] = useFonts({
    [fontFamily.regular]: require('../assets/fonts/NanumSquareRoundR.ttf'),
    [fontFamily.bold]: require('../assets/fonts/NanumSquareRoundB.ttf'),
    [fontFamily.extraBold]: require('../assets/fonts/NanumSquareRoundEB.ttf'),
  });

  // 웹 정적 렌더링은 서버가 폰트를 HTML 에 넣어 그리므로, 웹에서 null 을 그리면
  // 서버 HTML 과 첫 클라이언트 렌더가 어긋나 하이드레이션이 깨진다. 기다리는 건 네이티브만
  if (!fontsLoaded && Platform.OS !== 'web') return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
