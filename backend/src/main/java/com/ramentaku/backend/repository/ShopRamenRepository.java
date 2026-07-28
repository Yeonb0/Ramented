package com.ramentaku.backend.repository;

import com.ramentaku.backend.domain.ShopRamen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShopRamenRepository extends JpaRepository<ShopRamen, Long> {

    /**
     * 가게별 취급 라멘 집계. 가게 수와 무관하게 항상 쿼리 1방.
     *   ramenCount — 라멘 "종류" 수. 마커 배지 / 전문점 판정(=1)
     *   menuCount  — ShopRamen 행 수. 가게 상세의 메뉴 카드 수
     * 취급 라멘이 0곳인 가게는 이 결과에 아예 안 나온다. (서비스에서 0으로 보정)
     */
    @Query("""
        select sr.shop.id            as shopId,
                count(distinct sr.ramen.id) as ramenCount,
                count(sr.id)          as menuCount
        from ShopRamen sr
        group by sr.shop.id
    """)
    List<ShopRamenCount> countGroupByShop();

    /** 인터페이스 기반 프로젝션. 게터 이름이 JPQL 별칭과 정확히 대응해야 매핑된다. */
    interface ShopRamenCount {
        Long getShopId();
        long getRamenCount();
        long getMenuCount();
    }

    /**
     * 라멘별로 그걸 파는 가게 수. B-3의 countGroupByShop 과 정확히 대칭 구조다.
     * 칩 UI가 "파는 곳 0" 인 라멘을 흐리게 처리하거나 숨기는 데 쓴다.
     * 시드에는 삿포로 미소·이에케·냉라멘 3종이 의도적으로 0곳이다.
     */
    @Query("""
        select sr.ramen.id             as ramenId,
                count(distinct sr.shop.id) as shopCount
        from ShopRamen sr
        group by sr.ramen.id
    """)
    List<RamenShopCount> countShopsGroupByRamen();

    interface RamenShopCount {
        Long getRamenId();
        long getShopCount();
    }
}