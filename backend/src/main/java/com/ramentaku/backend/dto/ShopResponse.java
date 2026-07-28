package com.ramentaku.backend.dto;

import com.ramentaku.backend.domain.RamenShop;

public record ShopResponse(
        Long id,
        String name,
        Double latitude,
        Double longitude,
        String address,
        String region,
        String businessHoursRaw,
        String instagramHandle,
        String description,
        long ramenCount, // 취급 라멘 종류 수 — 중립 마커 배지, ==1 이면 전문점
        long menuCount // 메뉴 수 — 가게 상세 "취급 라멘 N" 섹션
) {
    public static ShopResponse from(RamenShop shop, long ramenCount, long menuCount) {
        return new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getLatitude(),
                shop.getLongitude(),
                shop.getAddress(),
                shop.getRegion(),
                shop.getBusinessHoursRaw(),
                shop.getInstagramHandle(),
                shop.getDescription(),
                ramenCount,
                menuCount);
    }
}