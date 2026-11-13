package com.ramentaku.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.ZoneId;

/** 영업 상태 계산 기준 시각. 서버가 어느 시간대에서 돌든 Asia/Seoul 로 판정한다 */
@Configuration
public class ClockConfig {

  @Bean
  public Clock clock(@Value("${app.zone}") String zone) {
    return Clock.system(ZoneId.of(zone));
  }
}
