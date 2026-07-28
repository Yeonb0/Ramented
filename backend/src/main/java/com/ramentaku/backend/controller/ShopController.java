package com.ramentaku.backend.controller;

import com.ramentaku.backend.dto.ShopResponse;
import com.ramentaku.backend.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping
    public List<ShopResponse> getShops(@RequestParam(required = false) String region) {
        // Phase 2에서 sort=rating 쿼리 파라미터를 여기에 매핑한다
        return shopService.getShops(region, Sort.by("id"));
    }
}