package com.ramented.backend.repository;

import com.ramented.backend.domain.RamenShop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RamenShopRepository extends JpaRepository<RamenShop, Long> {

    // 메소드 이름만으로 "WHERE region = ?" 쿼리 자동 생성 (Phase 2 지역 필터에 사용)
    List<RamenShop> findByRegion(String region);
}
