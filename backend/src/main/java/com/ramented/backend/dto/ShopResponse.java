package com.ramented.backend.dto;

import com.ramented.backend.domain.RamenShop;

public record ShopResponse(
        Long id,
        String name,
        Double latitude,
        Double longitude,
        String address,
        String region,
        String businessHours,
        String description
) {
    // 엔티티 -> DTO 변환을 한 곳에 모아두는 정적 팩토리
    public static ShopResponse from(RamenShop shop) {
        return new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getLatitude(),
                shop.getLongitude(),
                shop.getAddress(),
                shop.getRegion(),
                shop.getBusinessHours(),
                shop.getDescription()
        );
    }
}