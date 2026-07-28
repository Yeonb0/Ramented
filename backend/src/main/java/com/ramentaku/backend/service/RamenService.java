package com.ramentaku.backend.service;

import com.ramentaku.backend.dto.RamenResponse;
import com.ramentaku.backend.repository.RamenRepository;
import com.ramentaku.backend.repository.ShopRamenRepository;
import com.ramentaku.backend.repository.ShopRamenRepository.RamenShopCount;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RamenService {

    private final RamenRepository ramenRepository;
    private final ShopRamenRepository shopRamenRepository;

    @Transactional(readOnly = true)
    public List<RamenResponse> getRamens() {
        Map<Long, Long> shopCounts = shopRamenRepository.countShopsGroupByRamen()
                .stream()
                .collect(Collectors.toMap(RamenShopCount::getRamenId, RamenShopCount::getShopCount));

        // 파는 곳이 0인 라멘도 목록에 남는다. 칩에서 흐리게 보여줘야 하기 때문.
        return ramenRepository.findAll(Sort.by("id")).stream()
                .map(r -> RamenResponse.from(r, shopCounts.getOrDefault(r.getId(), 0L)))
                .toList();
    }
}