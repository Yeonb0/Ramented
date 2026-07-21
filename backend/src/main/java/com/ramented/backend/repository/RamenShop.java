package com.ramented.backend.repository;

import com.ramented.backend.domain.RamenShop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RamenShop extends JpaRepository<RamenShop, Long> {

    // 쿼리 메소드 : 메소드 이름만으로 "WHERE region = ?" 쿼리 자동 생성
    // Phase 1의 GET /api/shops?region=... 지역 필터에 사용 (당장 안 써도 무해)
    List<RamenShop> findByRegion(String region);
}
