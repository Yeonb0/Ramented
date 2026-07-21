package com.ramented.backend.config;

import com.ramented.backend.domain.*;
import com.ramented.backend.repository.RamenRepository;
import com.ramented.backend.repository.RamenShopRepository;
import com.ramented.backend.repository.ShopRamenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RamenRepository ramenRepository;
    private final RamenShopRepository ramenShopRepository;
    private final ShopRamenRepository shopRamenRepository;

    @Override
    public void run(String... args) {
        // 이미 데이터가 있으면 재삽입 안 함 (재시작마다 중복 방지)
        if (ramenShopRepository.count() > 0) {
            return;
        }

        // 1) 라멘 종류 — 6축 분류 (분류 문서의 매핑 그대로)
        Ramen tonkotsu   = new Ramen("돈코츠 라멘",   SoupBase.PORK,    Clarity.PAITAN, Temperature.HOT, Tare.SHIO,  Form.RAMEN,     null, "돼지뼈를 오래 고아낸 진한 백탕");
        Ramen toripaitan = new Ramen("토리파이탄 쇼유", SoupBase.CHICKEN, Clarity.PAITAN, Temperature.HOT, Tare.SHOYU, Form.RAMEN,     null, "닭 육수를 유화시킨 부드러운 백탕");
        Ramen tsukemen   = new Ramen("시오 츠케멘",   SoupBase.SEAFOOD, Clarity.SEITAN, Temperature.HOT, Tare.SHIO,  Form.TSUKEMEN,  null, "면을 진한 소금 국물에 찍어 먹는 츠케멘");
        Ramen miso       = new Ramen("미소 라멘",     SoupBase.MIXED,   Clarity.PAITAN, Temperature.HOT, Tare.MISO,  Form.RAMEN,     null, "된장 타래의 구수한 국물");
        Ramen mazesoba   = new Ramen("마제소바",      null,             null,           Temperature.HOT, Tare.SHOYU, Form.MAZESOBA,  null, "국물 없이 비벼 먹는 마제소바");

        ramenRepository.saveAll(List.of(tonkotsu, toripaitan, tsukemen, miso, mazesoba));

        // 2) 가게 (서울 마포/용산 좌표)
        RamenShop menya  = new RamenShop("멘야 산다이메", 37.5561, 126.9236, "서울 마포구 양화로 123",  "서울 마포구", "11:00~21:00",                    "홍대 인근 돈코츠 전문점");
        RamenShop hakata = new RamenShop("하카타 분코",   37.5495, 126.9138, "서울 마포구 월드컵로 45",  "서울 마포구", "11:30~22:00 (브레이크 15:00~17:00)", "하카타 스타일 라멘");
        RamenShop truck  = new RamenShop("라멘 트럭",     37.5340, 126.9948, "서울 용산구 이태원로 67",  "서울 용산구", "12:00~20:00 (월 휴무)",             "츠케멘·마제소바 중심");

        ramenShopRepository.saveAll(List.of(menya, hakata, truck));

        // 3) 가게 × 라멘 연결 — 가격/메뉴명이 여기(ShopRamen)에 붙는다
        shopRamenRepository.saveAll(List.of(
                new ShopRamen(tonkotsu,   menya,  10000, "특제 돈코츠"),
                new ShopRamen(toripaitan, menya,  11000, "토리파이탄 쇼유"),
                new ShopRamen(miso,       hakata,  9500, "미소 라멘"),
                new ShopRamen(tonkotsu,   hakata, 10500, "하카타 돈코츠"),
                new ShopRamen(tsukemen,   truck,  12000, "시오 츠케멘"),
                new ShopRamen(mazesoba,   truck,   9000, "마제소바")
        ));
    }
}