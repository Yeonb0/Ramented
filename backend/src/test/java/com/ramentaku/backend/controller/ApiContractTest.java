package com.ramentaku.backend.controller;

import com.ramentaku.backend.domain.*;
import com.ramentaku.backend.dto.RamenResponse;
import com.ramentaku.backend.dto.ShopResponse;
import com.ramentaku.backend.service.RamenService;
import com.ramentaku.backend.service.ShopService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * docs/api-contract.md 를 코드로 고정한다.
 *
 * 필드명이나 enum 직렬화 형식이 바뀌면 컴파일은 통과하고
 * 프런트만 조용히 깨진다. 여기서 잡는다.
 *
 * 서비스는 목으로 대체한다. 검증 대상은 "직렬화 결과"이지 쿼리가 아니다.
 */
@WebMvcTest({ShopController.class, RamenController.class})
class ApiContractTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ShopService shopService;

    @MockitoBean
    private RamenService ramenService;

    @Test
    @DisplayName("GET /api/shops — 필드명이 계약과 일치한다")
    void 가게_응답_필드명() throws Exception {
        given(shopService.getShops(any(), any())).willReturn(List.of(
                new ShopResponse(1L, "라멘야누", 37.56, 126.92,
                        "서울 마포구 연남동", "서울 마포구",
                        "11:00~15:00, 17:00~20:00 (수 휴무)", null,
                        "자가제면", 3L, 3L)
        ));

        mockMvc.perform(get("/api/shops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].businessHoursRaw").exists())
                .andExpect(jsonPath("$[0].ramenCount").value(3))
                .andExpect(jsonPath("$[0].menuCount").value(3))
                // 개명 전 이름이 되살아나지 않는지 확인
                .andExpect(jsonPath("$[0].businessHours").doesNotExist())
                // 아직 수집 전이면 null 이어야 한다. 빈 문자열이면 앱이 버튼을 잘못 띄운다
                .andExpect(jsonPath("$[0].instagramHandle").value(nullValue()));
    }

    @Test
    @DisplayName("GET /api/ramens — 6축을 enum 이름 문자열로 내려보낸다")
    void 라멘_축_직렬화() throws Exception {
        given(ramenService.getRamens()).willReturn(List.of(
                new RamenResponse(1L, "돈코츠 라멘",
                        SoupBase.PORK, Clarity.PAITAN, Temperature.HOT,
                        Tare.SHIO, Form.RAMEN, null,
                        "진한 백탕", 5L)
        ));

        // 프런트 theme.ts 가 markerColors['SHIO_PAITAN'] 으로 조회한다.
        // 누군가 @JsonValue 로 한글 라벨("시오")을 붙이면 마커 색이 통째로 깨지는데,
        // 컴파일 에러는 나지 않는다. 이 단정문이 유일한 방어선이다.
        mockMvc.perform(get("/api/ramens"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tare").value("SHIO"))
                .andExpect(jsonPath("$[0].clarity").value("PAITAN"))
                .andExpect(jsonPath("$[0].form").value("RAMEN"))
                .andExpect(jsonPath("$[0].soupBase").value("PORK"))
                .andExpect(jsonPath("$[0].shopCount").value(5));
    }

    @Test
    @DisplayName("무국물 라멘은 soupBase/clarity 가 null 로 유지된다")
    void 무국물_라멘_null_유지() throws Exception {
        given(ramenService.getRamens()).willReturn(List.of(
                new RamenResponse(17L, "마제소바",
                        null, null, Temperature.HOT,
                        Tare.SHOYU, Form.MAZESOBA, null,
                        "국물 없이 비벼 먹는 형태", 5L)
        ));

        // null 을 'ETC' 로 채우면 안 된다.
        // null = "분류 자체가 성립 안 함", ETC = "분류는 되는데 목록에 없음".
        // 프런트가 clarity ?? 'SEITAN' 으로 폴백하므로 null 이 와야 한다.
        mockMvc.perform(get("/api/ramens"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].soupBase").value(nullValue()))
                .andExpect(jsonPath("$[0].clarity").value(nullValue()))
                .andExpect(jsonPath("$[0].style").value(nullValue()))
                .andExpect(jsonPath("$[0].form").value("MAZESOBA"));
    }
}