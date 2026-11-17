package com.ramentaku.backend.controller;

import com.ramentaku.backend.domain.OpenState;
import com.ramentaku.backend.dto.MapShopResponse;
import com.ramentaku.backend.service.ShopService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * docs/api-contract-v2.md § 1 을 코드로 고정한다
 * 필드 이름 · enum 직렬화가 바뀌면 앱만 조용히 깨지므로 여기서 잡는다
 */
@WebMvcTest(ShopController.class)
class ShopApiContractTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private ShopService shopService;

  @Test
  @DisplayName("GET /api/shops — 필드 이름 · enum 문자열 · null 이 계약과 같다")
  void mapShopFields() throws Exception {
    given(shopService.getMapShops()).willReturn(List.of(
      new MapShopResponse(6L, "니시무라멘", "연남본점", 37.5633, 126.9252, OpenState.OPEN, "영업 중 · 정기 영업시간 기준"),
      new MapShopResponse(1L, "라멘야누", null, 37.5629, 126.9254, OpenState.DAY_OFF, "정기 휴무 · 정기 영업시간 기준")
    ));

    mockMvc.perform(get("/api/shops"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].id").value(6))
      .andExpect(jsonPath("$[0].name").value("니시무라멘"))
      .andExpect(jsonPath("$[0].branchName").value("연남본점"))
      .andExpect(jsonPath("$[0].latitude").value(37.5633))
      .andExpect(jsonPath("$[0].longitude").value(126.9252))
      .andExpect(jsonPath("$[0].openState").value("OPEN"))
      .andExpect(jsonPath("$[0].openStateLabel").value("영업 중 · 정기 영업시간 기준"))
      // 지점명이 없으면 빈 문자열이 아니라 null 이어야 앱이 줄을 숨긴다
      .andExpect(jsonPath("$[1].branchName").value(nullValue()))
      .andExpect(jsonPath("$[1].openState").value("DAY_OFF"))
      // 지도 응답에 넣지 않기로 한 필드
      .andExpect(jsonPath("$[0].address").doesNotExist())
      .andExpect(jsonPath("$[0].hoursRaw").doesNotExist());
  }
}
