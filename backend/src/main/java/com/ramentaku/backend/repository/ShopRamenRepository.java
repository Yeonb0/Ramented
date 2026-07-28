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
}