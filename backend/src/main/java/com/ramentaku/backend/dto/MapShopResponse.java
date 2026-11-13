package com.ramentaku.backend.dto;

import com.ramentaku.backend.domain.OpenState;

/** GET /api/shops 의 한 가게 (docs/api-contract-v2.md § 1) */
public record MapShopResponse(
  Long id,
  String name,
  String branchName,
  Double latitude,
  Double longitude,
  OpenState openState,
  String openStateLabel
) {
}
