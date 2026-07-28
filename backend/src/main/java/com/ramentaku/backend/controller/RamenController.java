package com.ramentaku.backend.controller;

import com.ramentaku.backend.dto.RamenResponse;
import com.ramentaku.backend.service.RamenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ramens")
@RequiredArgsConstructor
public class RamenController {

    private final RamenService ramenService;

    // Phase 2에서 6축 faceted 필터 파라미터가 여기 붙는다
    @GetMapping
    public List<RamenResponse> getRamens() {
        return ramenService.getRamens();
    }
}