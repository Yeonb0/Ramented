package com.ramentaku.backend.domain;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * breadboard N4 — 영업 상태 계산 (Phase 1 : 정기 영업시간만)
 * 제보 (Phase 6) 가 들어오면 이 앞에서 제보 값을 먼저 본다
 *
 * 경계 : 여는 시각 · 브레이크 끝은 포함, 닫는 시각 · 브레이크 시작은 미포함
 */
public final class OpenStateCalculator {

  private static final String BASIS = " · 정기 영업시간 기준";

  private OpenStateCalculator() {
  }

  public static OpenStatus evaluate(List<DayHours> Week, LocalDateTime now) {
    if (Week.isEmpty()) {
      return new OpenStatus(OpenState.UNKNOWN, "모름");
    }

    int today = now.getDayOfWeek().getValue();
    DayHours day = Week.stream().filter(h -> h.dayOfWeek() == today).findFirst().orElse(null);
    if (day == null) {
      return new OpenStatus(OpenState.DAY_OFF, "정기 휴무" + BASIS);
    }

    LocalTime t = now.toLocalTime();
    if (t.isBefore(day.open())) {
      return new OpenStatus(OpenState.CLOSED, "영업 전" + BASIS);
    }
    if (!t.isBefore(day.close())) {
      return new OpenStatus(OpenState.CLOSED, "영업 종료" + BASIS);
    }
    if (day.breakStart() != null && !t.isBefore(day.breakStart()) && t.isBefore(day.breakEnd())) {
      return new OpenStatus(OpenState.BREAK, "브레이크" + BASIS);
    }
    return new OpenStatus(OpenState.OPEN, "영업 중" + BASIS);
  }
}
