package com.ramentaku.backend.service;

import com.ramentaku.backend.domain.OpenState;
import com.ramentaku.backend.dto.MapShopResponse;
import com.ramentaku.backend.repository.RamenShopRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 시드 데이터 + 고정 시각으로 지도 응답을 만든다
 * 서버 시각은 Asia/Seoul
 */
@DataJpaTest
class ShopServiceTest {

  private static final ZoneId Seoul = ZoneId.of("Asia/Seoul");

  @Autowired
  private RamenShopRepository shopRepository;

  private List<MapShopResponse> mapAt(String seoulDateTime) {
    Instant I = java.time.LocalDateTime.parse(seoulDateTime).atZone(Seoul).toInstant();
    return new ShopService(shopRepository, Clock.fixed(I, Seoul)).getMapShops();
  }

  private MapShopResponse find(List<MapShopResponse> Shops, String name) {
    return Shops.stream().filter(s -> s.name().equals(name)).findFirst().orElseThrow();
  }

  @Test
  @DisplayName("지도 응답은 30곳")
  void thirty() {
    assertThat(mapAt("2026-11-16T12:00")).hasSize(30);
  }

  @Test
  @DisplayName("화요일 점심 : 라멘야누는 정기 휴무, 하쿠텐은 영업 중")
  void tuesdayLunch() {
    List<MapShopResponse> Shops = mapAt("2026-11-17T12:00");
    assertThat(find(Shops, "라멘야누").openState()).isEqualTo(OpenState.DAY_OFF);
    assertThat(find(Shops, "하쿠텐").openState()).isEqualTo(OpenState.OPEN);
    assertThat(find(Shops, "하쿠텐").openStateLabel()).isEqualTo("영업 중 · 정기 영업시간 기준");
  }

  @Test
  @DisplayName("요일별로 다른 브레이크 : 쿄라멘은 토요일 14:40 에 브레이크, 화요일 14:40 에는 영업 중")
  void breakDiffersByDay() {
    assertThat(find(mapAt("2026-11-21T14:40"), "쿄라멘").openState()).isEqualTo(OpenState.BREAK);
    assertThat(find(mapAt("2026-11-17T14:40"), "쿄라멘").openState()).isEqualTo(OpenState.OPEN);
  }
}
