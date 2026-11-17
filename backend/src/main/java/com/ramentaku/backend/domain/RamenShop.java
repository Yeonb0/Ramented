package com.ramentaku.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * 가게 (breadboard S1)
 * 좌표 · 주소는 공공데이터 (행정안전부_식품_일반음식점) 에서 온다. 카카오 장소 ID 는 링크용으로만 둔다
 */
@Entity
@Table(name = "ramen_shop")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RamenShop {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String name; // 지점명을 뺀 이름

  @Column(length = 50)
  private String branchName; // 홍대점 · 합정본점 등. 없으면 null

  @Column(nullable = false)
  private Double latitude;

  @Column(nullable = false)
  private Double longitude;

  @Column(nullable = false)
  private String address;

  @Column(length = 500)
  private String hoursRaw; // 원문 (주문마감 · 재료 소진 등은 여기에만)

  @Column(length = 100)
  private String instagramHandle;

  @Column(length = 30, unique = true)
  private String kakaoPlaceId;

  @OneToMany(mappedBy = "shop")
  private List<ShopHours> Hours = new ArrayList<>();

  public List<ShopHours> getHours() {
    return Hours;
  }
}
