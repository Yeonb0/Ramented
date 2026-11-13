package com.ramentaku.backend.domain;

import java.time.LocalTime;

/** 영업 상태 계산용 하루치 정기 영업시간. 브레이크가 없으면 breakStart · breakEnd 가 null */
public record DayHours(int dayOfWeek, LocalTime open, LocalTime close, LocalTime breakStart, LocalTime breakEnd) {
}
