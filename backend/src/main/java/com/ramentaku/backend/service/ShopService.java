package com.ramentaku.backend.service;

import com.ramentaku.backend.domain.OpenStateCalculator;
import com.ramentaku.backend.domain.OpenStatus;
import com.ramentaku.backend.domain.RamenShop;
import com.ramentaku.backend.domain.ShopHours;
import com.ramentaku.backend.dto.MapShopResponse;
import com.ramentaku.backend.repository.RamenShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ShopService {

  private final RamenShopRepository shopRepository;
  private final Clock clock; // Asia/Seoul. 테스트에서 시각을 고정하려고 주입받는다

  public ShopService(RamenShopRepository shopRepository, Clock clock) {
    this.shopRepository = shopRepository;
    this.clock = clock;
  }

  /** 지도 데이터 (breadboard N1, Phase 1 : 필터 없음) */
  public List<MapShopResponse> getMapShops() {
    LocalDateTime now = LocalDateTime.now(clock);
    return shopRepository.findAllWithHours().stream()
      .map(s -> toMapShop(s, now))
      .toList();
  }

  private MapShopResponse toMapShop(RamenShop s, LocalDateTime now) {
    OpenStatus status = OpenStateCalculator.evaluate(
      s.getHours().stream().map(ShopHours::toDayHours).toList(), now);
    return new MapShopResponse(s.getId(), s.getName(), s.getBranchName(),
      s.getLatitude(), s.getLongitude(), status.state(), status.label());
  }
}
