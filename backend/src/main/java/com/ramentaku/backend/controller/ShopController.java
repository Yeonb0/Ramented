package com.ramentaku.backend.controller;

import com.ramentaku.backend.dto.MapShopResponse;
import com.ramentaku.backend.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

  private final ShopService shopService;

  /** 지도 데이터 — docs/api-contract-v2.md § 1 */
  @GetMapping
  public List<MapShopResponse> getMapShops() {
    return shopService.getMapShops();
  }
}
