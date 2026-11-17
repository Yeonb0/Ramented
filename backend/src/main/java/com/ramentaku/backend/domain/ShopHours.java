package com.ramentaku.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

/**
 * 요일별 정기 영업시간. 정기 휴무 요일은 행이 없다
 */
@Entity
@Table(name = "shop_hours")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ShopHours {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "shop_id")
  private RamenShop shop;

  @Column(nullable = false)
  private Integer dayOfWeek; // 1 = 월 … 7 = 일

  @Column(nullable = false)
  private LocalTime openTime;

  @Column(nullable = false)
  private LocalTime closeTime;

  private LocalTime breakStart;
  private LocalTime breakEnd;

  public DayHours toDayHours() {
    return new DayHours(dayOfWeek, openTime, closeTime, breakStart, breakEnd);
  }
}
