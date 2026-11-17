package com.ramentaku.backend.domain;

/** 영업 상태 (docs/api-contract-v2.md § 1). 앱은 이 이름 문자열을 그대로 받는다 */
public enum OpenState {
  OPEN,
  BREAK,
  CLOSED,
  DAY_OFF,
  UNKNOWN
}
