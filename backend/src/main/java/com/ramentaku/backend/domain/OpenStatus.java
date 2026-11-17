package com.ramentaku.backend.domain;

/** 영업 상태 + 화면에 그대로 쓰는 한 줄 문구 */
public record OpenStatus(OpenState state, String label) {
}
