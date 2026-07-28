package com.ramentaku.backend.service;

import com.ramentaku.backend.domain.*;
import com.ramentaku.backend.dto.ShopResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Sort;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @DataJpaTest 는 리포지토리만 올린다. @Import 로 서비스 하나를 끼워 넣으면
 * 목(mock) 없이 실제 쿼리 + 실제 병합 로직을 함께 검증할 수 있다.
 * 전체 컨텍스트를 띄우는 @SpringBootTest 보다 훨씬 빠르다.
 */
@DataJpaTest
@Import(ShopService.class)
class ShopServiceTest {

    @Autowired
    private ShopService shopService;

    @Autowired
    private TestEntityManager em;

    private RamenShop shop(String name, String region) {
        return em.persist(new RamenShop(
                name, 37.5, 126.9, "서울 어딘가", region,
                "11:00~21:00", "테스트용"));
    }

    @Test
    @DisplayName("메뉴가 없는 가게도 ramenCount 0으로 응답에 포함된다")
    void 메뉴_없는_가게도_응답에_남는다() {
        // 이 보정이 없으면 해당 가게가 지도에서 사라진다.
        // 시드 30곳은 전부 메뉴가 있어서 눈으로는 절대 안 잡히는 버그다.
        shop("메뉴 없는 가게", "서울 마포구");
        em.flush();

        List<ShopResponse> responses = shopService.getShops(null, Sort.by("id"));

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).ramenCount()).isZero();
        assertThat(responses.get(0).menuCount()).isZero();
    }

    @Test
    @DisplayName("region 이 null 이거나 공백이면 전체를 반환한다")
    void 지역_필터_없으면_전체() {
        shop("마포 가게", "서울 마포구");
        shop("용산 가게", "서울 용산구");
        em.flush();

        assertThat(shopService.getShops(null, Sort.by("id"))).hasSize(2);
        assertThat(shopService.getShops("   ", Sort.by("id"))).hasSize(2);
    }

    @Test
    @DisplayName("region 을 주면 그 지역만 반환한다")
    void 지역_필터() {
        shop("마포 가게", "서울 마포구");
        shop("용산 가게", "서울 용산구");
        em.flush();

        List<ShopResponse> responses = shopService.getShops("서울 마포구", Sort.by("id"));

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).name()).isEqualTo("마포 가게");
    }

    @Test
    @DisplayName("정렬 파라미터를 그대로 따른다")
    void 정렬() {
        // ORDER BY 가 없으면 Postgres 는 물리적 저장 순서를 돌려준다.
        // UPDATE 한 번에 목록 순서가 뒤바뀌므로 명시적 정렬이 필요하다.
        shop("가", "서울 마포구");
        shop("나", "서울 마포구");
        em.flush();

        List<ShopResponse> asc = shopService.getShops(null, Sort.by("id"));
        List<ShopResponse> desc = shopService.getShops(null, Sort.by(Sort.Direction.DESC, "id"));

        assertThat(asc.get(0).id()).isLessThan(asc.get(1).id());
        assertThat(desc.get(0).id()).isGreaterThan(desc.get(1).id());
    }
}