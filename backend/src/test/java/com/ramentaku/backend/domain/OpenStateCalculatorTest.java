package com.ramentaku.backend.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * breadboard N4 — 정기 영업시간만으로 영업 상태를 판정한다 (Phase 1)
 * 2026-11-16 은 월요일, 2026-11-17 은 화요일
 */
class OpenStateCalculatorTest {

  // 화요일 휴무, 나머지 11:30 ~ 21:00 + 브레이크 15:00 ~ 17:00
  private static final List<DayHours> Week = List.of(1, 3, 4, 5, 6, 7).stream()
    .map(d -> new DayHours(d, LocalTime.of(11, 30), LocalTime.of(21, 0), LocalTime.of(15, 0), LocalTime.of(17, 0)))
    .toList();

  private static OpenStatus at(String dateTime) {
    return OpenStateCalculator.evaluate(Week, LocalDateTime.parse(dateTime));
  }

  @Test
  @DisplayName("정기 휴무 요일이면 DAY_OFF")
  void dayOff() {
    assertThat(at("2026-11-17T13:00")).isEqualTo(new OpenStatus(OpenState.DAY_OFF, "정기 휴무 · 정기 영업시간 기준"));
  }

  @Test
  @DisplayName("여는 시각 전이면 CLOSED · 영업 전")
  void beforeOpen() {
    assertThat(at("2026-11-16T10:00")).isEqualTo(new OpenStatus(OpenState.CLOSED, "영업 전 · 정기 영업시간 기준"));
  }

  @Test
  @DisplayName("여는 시각 정각부터 영업 중")
  void openAtOpeningTime() {
    assertThat(at("2026-11-16T11:30").state()).isEqualTo(OpenState.OPEN);
    assertThat(at("2026-11-16T11:30").label()).isEqualTo("영업 중 · 정기 영업시간 기준");
  }

  @Test
  @DisplayName("브레이크 시작 정각부터 브레이크, 끝 정각부터 다시 영업 중")
  void breakBoundaries() {
    assertThat(at("2026-11-16T14:59").state()).isEqualTo(OpenState.OPEN);
    assertThat(at("2026-11-16T15:00")).isEqualTo(new OpenStatus(OpenState.BREAK, "브레이크 · 정기 영업시간 기준"));
    assertThat(at("2026-11-16T17:00").state()).isEqualTo(OpenState.OPEN);
  }

  @Test
  @DisplayName("닫는 시각 정각부터 CLOSED · 영업 종료")
  void afterClose() {
    assertThat(at("2026-11-16T20:59").state()).isEqualTo(OpenState.OPEN);
    assertThat(at("2026-11-16T21:00")).isEqualTo(new OpenStatus(OpenState.CLOSED, "영업 종료 · 정기 영업시간 기준"));
  }

  @Test
  @DisplayName("브레이크가 없는 날은 낮에도 영업 중")
  void noBreak() {
    List<DayHours> Hours = List.of(new DayHours(1, LocalTime.of(11, 0), LocalTime.of(18, 0), null, null));
    assertThat(OpenStateCalculator.evaluate(Hours, LocalDateTime.parse("2026-11-16T15:30")).state()).isEqualTo(OpenState.OPEN);
  }

  @Test
  @DisplayName("정기 영업시간이 하나도 없으면 UNKNOWN · 모름")
  void unknown() {
    assertThat(OpenStateCalculator.evaluate(List.of(), LocalDateTime.parse("2026-11-16T12:00")))
      .isEqualTo(new OpenStatus(OpenState.UNKNOWN, "모름"));
  }
}
