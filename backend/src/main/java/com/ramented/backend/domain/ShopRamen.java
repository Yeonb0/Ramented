package com.ramented.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ShopRamen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // 여러 ShopRamen -> 하나의 라멘
    @JoinColumn(name = "ramen_id")
    private Ramen ramen;

    @ManyToOne(fetch = FetchType.LAZY) // 여러 ShopRamen -> 하나의 가게 (LAZY 명시)
    @JoinColumn(name = "shop_id")      // 이 테이블에 shop_id FK 컬럼 생성
    private RamenShop shop;

    private int price; 
    private String menuName; // 메뉴판에 표시되는 이름 (선택)

    public ShopRamen(Ramen ramen, RamenShop shop, int price, String menuName) {
        this.ramen = ramen;
        this.shop = shop;
        this.price = price;
        this.menuName = menuName;
    }
}
