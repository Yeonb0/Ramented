package com.ramented.backend.service;

import com.ramented.backend.domain.RamenShop;
import com.ramented.backend.dto.ShopResponse;
import com.ramented.backend.repository.RamenShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final RamenShopRepository ramenShopRepository;

    @Transactional(readOnly = true)
    public List<ShopResponse> getShops(String region) {
        List<RamenShop> shops = (region == null || region.isBlank())
                ? ramenShopRepository.findAll()
                : ramenShopRepository.findByRegion(region);

        return shops.stream()
                .map(ShopResponse::from)
                .toList();
    }
}