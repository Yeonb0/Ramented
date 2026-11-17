// app/src/hooks/useMapShops.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMapShops } from '../api/shops';

export function useMapShops() {
  return useQuery({
    queryKey: ['mapShops'], // Phase 3 에서 필터 조건을 여기에 더한다
    queryFn: fetchMapShops,
    staleTime: 1000 * 60, // 영업 상태가 시각에 따라 바뀌므로 길게 잡지 않는다
    retry: 1, // 실패 화면에 다시 시도 버튼이 있으므로 자동 재시도는 한 번만 (기본 3번이면 7초 넘게 로딩만 보임)
  });
}
