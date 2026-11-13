# Context Packet — Phase 7 : 정식 출시

> 이 세션에서 읽을 것 : `docs/planning/phases.md` 의 "공통 규칙" + `PHASE5_HANDOFF.md` + `PHASE6_HANDOFF.md` + 이 문서

## Task

- 이번 Phase : 비공개 테스트 14일 조건을 채운 뒤 Google Play 프로덕션 출시를 신청하고, v2.0을 돌아본다
- 시작 조건 : `PHASE5_HANDOFF.md` 에 적힌 14일 카운트 종료일이 지났고, Phase 6이 배포되었다

## Source artifacts

| 문서 | 이 Phase에서 쓰는 부분 |
|---|---|
| `frame.md` | Outcome, Criteria (R0 ~ R7) — 효과를 돌아볼 기준 |
| `shaping.md` | Appetite 절의 cut line과 재검토 조건 |
| `breadboard.md` | T2b (지인 태깅 이후 해산물 제외 필터) |
| `PHASE5_HANDOFF.md` · `PHASE6_HANDOFF.md` | 테스터 수, 카운트 시작일, 베타 중 데이터 |

## Must preserve

- v2.0 cut (등급 · 랭킹, 인증샷, 사용자 가게 등록, 이벤트 상세, 인스타 게시물 표시, 사장님 참여) 은 이 Phase에서도 넣지 않는다. 출시 뒤 다음 계획 (v2.1) 에서 다룬다
- 구현 테스트 통과는 "효과"의 증거가 아니다. 효과는 베타 데이터로 따로 본다

## 트랙별 작업

### 📱 출시

1. 스토어 등록 정보 (설명, 스크린샷, 개인정보 처리방침 URL, 콘텐츠 등급)
2. 프로덕션 출시 신청 (Play Console의 질문지 포함)

### 돌아보기 (`docs/planning/v2.0-review.md`)

- 베타 데이터 : 회원 수, 기록 수, 태깅 수, 미포함 확정 메뉴 수, 제보 수
- T2b : 해산물 제외 필터가 출시 시점에 몇 곳을 보여 주는가
- 아래 효과 질문에 대한 답과 근거
- 다음 계획 후보 : 시드 지역 확장 (shaping 재검토 조건), 등급 · 랭킹 (R6), 사용자 가게 등록

### 관리자님이 직접 하실 것

- Play Console 질문지 응답과 제출

## Execution contract

- Goal condition : 프로덕션 출시 신청이 제출되었고, `v2.0-review.md` 가 있다
- Required checks : 운영 서버에서 T1 ~ T16 한 번씩 확인, 개인정보 처리방침 URL 접속
- 바꿔도 되는 곳 : `app/` 스토어 설정, `docs/`
- 바꾸지 않을 것 : 기능 범위
- 기획으로 돌아갈 때 : 프로덕션 신청이 거절되어 기능 변경이 필요하다, 베타 데이터가 frame의 가정 (M1 · M2) 을 깬다

## Criterion bindings (효과 돌아보기)

| Req | 효과 질문 |
|---|---|
| R0 | 해산물 제외 필터가 출시 시점에 쓸 만큼의 가게를 보여 주는가 (미포함 확정 수) |
| R1 | 메뉴 별점이 쌓여 같은 종류끼리 비교가 의미 있어졌나 |
| R2 | 제보가 실제로 들어왔고, 인스타 없이 휴무를 알 수 있었나 |
| R5 · R8 | 베타 사용자가 기록과 태깅을 남겼나, 운영자 없이 속성이 바뀌었나 |
| R7 | 첫 실행에 지도가 쓸모 있었나 |

## Verification target

- 출시 신청 제출 화면 확인, `v2.0-review.md` 와 `PHASE7_HANDOFF.md` 작성
