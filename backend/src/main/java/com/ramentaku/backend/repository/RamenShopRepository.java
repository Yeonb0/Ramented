package com.ramentaku.backend.repository;

import com.ramentaku.backend.domain.RamenShop;
import org.springframework.data.domain.Sort;          // ← 추가
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RamenShopRepository extends JpaRepository<RamenShop, Long> {

    List<RamenShop> findByRegion(String region);

    // 정렬을 받는 오버로드. 메서드 이름이 같아도 시그니처가 다르면 별개로 생성된다.
    List<RamenShop> findByRegion(String region, Sort sort);   // ← 추가
}