package com.ramentaku.backend.service;

import com.ramentaku.backend.domain.RamenShop;
import com.ramentaku.backend.dto.ShopResponse;
import com.ramentaku.backend.repository.RamenShopRepository;
import com.ramentaku.backend.repository.ShopRamenRepository;
import com.ramentaku.backend.repository.ShopRamenRepository.ShopRamenCount;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final RamenShopRepository ramenShopRepository;
    private final ShopRamenRepository shopRamenRepository;   // ← 주입 추가

    @Transactional(readOnly = true)
    public List<ShopResponse> getShops(String region, Sort sort) {
        List<RamenShop> shops = (region == null || region.isBlank())
                ? ramenShopRepository.findAll(sort)
                : ramenShopRepository.findByRegion(region, sort);

        // 쿼리 1방으로 전체 집계를 받아 Map 으로 세운다.
        // 가게마다 조회하면 N+1 (가게 30개 -> 쿼리 31방)
        Map<Long, ShopRamenCount> countMap = shopRamenRepository.countGroupByShop()
                .stream()
                .collect(Collectors.toMap(ShopRamenCount::getShopId, Function.identity()));

        return shops.stream()
                .map(shop -> {
                    // 취급 라멘이 0곳인 가게는 집계에 안 잡히므로 여기서 0 으로 살려준다.
                    ShopRamenCount c = countMap.get(shop.getId());
                    return ShopResponse.from(
                            shop,
                            c == null ? 0L : c.getRamenCount(),
                            c == null ? 0L : c.getMenuCount()
                    );
                })
                .toList();
    }
}