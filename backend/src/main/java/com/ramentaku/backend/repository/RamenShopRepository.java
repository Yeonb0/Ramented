package com.ramentaku.backend.repository;

import com.ramentaku.backend.domain.RamenShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RamenShopRepository extends JpaRepository<RamenShop, Long> {

  // 지도 응답은 가게마다 영업시간이 필요하므로 한 번에 가져온다 (N + 1 방지)
  @Query("select distinct s from RamenShop s left join fetch s.Hours")
  List<RamenShop> findAllWithHours();
}
