package com.ramentaku.backend.repository;

import com.ramentaku.backend.domain.RamenShop;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Flyway 마이그레이션 (V1 스키마 + V2 시드) 이 엔티티 매핑과 맞고, 시드 30곳이 들어가는지
 */
@DataJpaTest
class ShopSeedMigrationTest {

  @Autowired
  private RamenShopRepository shopRepository;

  @Test
  @DisplayName("시드 30곳이 모두 마포구 좌표를 가진다")
  void thirtyShopsWithCoordinates() {
    List<RamenShop> Shops = shopRepository.findAll();
    assertThat(Shops).hasSize(30);
    assertThat(Shops).allSatisfy(s -> {
      assertThat(s.getLatitude()).isBetween(37.53, 37.57);
      assertThat(s.getLongitude()).isBetween(126.90, 126.95);
    });
  }

  @Test
  @DisplayName("지점명은 이름과 따로 저장된다")
  void branchNameSeparated() {
    RamenShop Nishimura = shopRepository.findAll().stream()
      .filter(s -> s.getName().equals("니시무라멘")).findFirst().orElseThrow();
    assertThat(Nishimura.getBranchName()).isEqualTo("연남본점");
    assertThat(shopRepository.findAll().stream().filter(s -> s.getBranchName() != null)).hasSize(7);
  }

  @Test
  @DisplayName("정기 휴무 요일은 영업시간 행이 없다 (라멘야누 : 화 · 수 휴무)")
  void dayOffHasNoRow() {
    RamenShop Yanu = shopRepository.findAllWithHours().stream()
      .filter(s -> s.getName().equals("라멘야누")).findFirst().orElseThrow();
    assertThat(Yanu.getHours()).extracting("dayOfWeek").containsExactlyInAnyOrder(1, 4, 5, 6, 7);
  }
}
