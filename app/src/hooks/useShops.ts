import { useQuery } from '@tanstack/react-query';
import { fetchShops } from '../api/shops';

export function useShops() {
  return useQuery({
    queryKey: ['shops'],   // 이 캐시의 이름표 (Phase 2에서 필터 조건을 여기 추가하게 됩니다)
    queryFn: fetchShops,
    staleTime: 1000 * 60,  // 1분간은 '신선'으로 간주해 불필요한 재요청 억제
  });
}