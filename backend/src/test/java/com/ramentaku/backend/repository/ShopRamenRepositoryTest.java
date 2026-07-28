package com.ramentaku.backend.repository;

import com.ramentaku.backend.domain.*;
import com.ramentaku.backend.repository.ShopRamenRepository.RamenShopCount;
import com.ramentaku.backend.repository.ShopRamenRepository.ShopRamenCount;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 집계 쿼리 검증.
 *
 * 여기서 잡으려는 것은 "시드 30곳으로는 절대 드러나지 않는" 케이스다.
 * 현재 시드는 모든 가게가 ramenCount == menuCount 라서,
 * COUNT(DISTINCT ...) 를 COUNT(*) 로 바꿔도 API 응답이 똑같이 나온다.
 * 두 필드를 나눈 의미가 사라지는데 눈으로는 알 수 없다.
 */
@DataJpaTest
class ShopRamenRepositoryTest {

    @Autowired
    private ShopRamenRepository shopRamenRepository;

    @Autowired
    private TestEntityManager em;

    // ---------- 픽스처 헬퍼 ----------

    private Ramen ramen(String name, Tare tare, Clarity clarity) {
        return em.persist(new Ramen(
                name, SoupBase.PORK, clarity, Temperature.HOT,
                tare, Form.RAMEN, null, "테스트용"));
    }

    private RamenShop shop(String name) {
        return em.persist(new RamenShop(
                name, 37.5, 126.9, "서울 마포구 어딘가", "서울 마포구",
                "11:00~21:00", "테스트용"));
    }

    private Optional<ShopRamenCount> findShopRow(Long shopId) {
        return shopRamenRepository.countGroupByShop().stream()
                .filter(r -> r.getShopId().equals(shopId))
                .findFirst();
    }

    // ---------- 가게별 집계 ----------

    @Test
    @DisplayName("같은 라멘을 두 메뉴로 팔면 종류 수는 1, 메뉴 수는 2가 된다")
    void 같은_라멘_두_메뉴() {
        // 실제로 있을 법한 상황: '돈코츠'와 '특제 돈코츠'는
        // 메뉴판에는 두 줄이지만 라멘 "종류"로는 하나다.
        Ramen tonkotsu = ramen("돈코츠 라멘", Tare.SHIO, Clarity.PAITAN);
        RamenShop shop = shop("두 메뉴 가게");

        em.persist(new ShopRamen(tonkotsu, shop, 10000, "돈코츠"));
        em.persist(new ShopRamen(tonkotsu, shop, 13000, "특제 돈코츠"));
        em.flush();

        ShopRamenCount row = findShopRow(shop.getId()).orElseThrow();

        assertThat(row.getRamenCount())
                .as("COUNT(DISTINCT ramen_id) — 마커 배지에 쓰이는 값")
                .isEqualTo(1);
        assertThat(row.getMenuCount())
                .as("COUNT(*) — 가게 상세의 메뉴 카드 수")
                .isEqualTo(2);
    }

    @Test
    @DisplayName("서로 다른 라멘 두 종류면 두 값이 같다")
    void 다른_라멘_두_메뉴() {
        Ramen shio = ramen("시오 라멘", Tare.SHIO, Clarity.SEITAN);
        Ramen shoyu = ramen("쇼유 라멘", Tare.SHOYU, Clarity.SEITAN);
        RamenShop shop = shop("두 종류 가게");

        em.persist(new ShopRamen(shio, shop, 10000, "시오"));
        em.persist(new ShopRamen(shoyu, shop, 10000, "쇼유"));
        em.flush();

        ShopRamenCount row = findShopRow(shop.getId()).orElseThrow();

        assertThat(row.getRamenCount()).isEqualTo(2);
        assertThat(row.getMenuCount()).isEqualTo(2);
    }

    @Test
    @DisplayName("메뉴가 하나도 없는 가게는 집계 결과에 아예 나오지 않는다")
    void 메뉴_없는_가게는_집계에서_빠진다() {
        // GROUP BY 는 행이 없는 그룹을 만들지 않는다.
        // 이 가게를 응답에 살려내는 건 서비스 계층의 책임이며,
        // 그 보정을 빠뜨리면 가게가 지도에서 통째로 사라진다.
        RamenShop empty = shop("메뉴 없는 가게");
        em.flush();

        assertThat(findShopRow(empty.getId()))
                .as("집계 쿼리는 이 가게를 모른다. ShopService 가 0으로 보정해야 한다")
                .isEmpty();
    }

    // ---------- 라멘별 집계 ----------

    @Test
    @DisplayName("한 가게가 같은 라멘을 두 메뉴로 팔아도 가게 수는 1로 센다")
    void 라멘별_가게수는_중복을_제거한다() {
        Ramen tonkotsu = ramen("돈코츠 라멘", Tare.SHIO, Clarity.PAITAN);
        RamenShop shopA = shop("가게 A");
        RamenShop shopB = shop("가게 B");

        em.persist(new ShopRamen(tonkotsu, shopA, 10000, "돈코츠"));
        em.persist(new ShopRamen(tonkotsu, shopA, 13000, "특제 돈코츠")); // 같은 가게
        em.persist(new ShopRamen(tonkotsu, shopB, 11000, "돈코츠"));
        em.flush();

        List<RamenShopCount> rows = shopRamenRepository.countShopsGroupByRamen();
        RamenShopCount row = rows.stream()
                .filter(r -> r.getRamenId().equals(tonkotsu.getId()))
                .findFirst().orElseThrow();

        assertThat(row.getShopCount())
                .as("메뉴는 3개지만 파는 가게는 2곳")
                .isEqualTo(2);
    }
}