# Context Packet — Phase 5 : 지인 베타 시작

> 이 세션에서 읽을 것 : `docs/planning/phases.md` 의 "공통 규칙" + `PHASE4_HANDOFF.md` + 이 문서

## Task

- 이번 Phase : 운영 서버를 띄우고, 지인들이 Expo 테스트 배포로 앱을 설치해 실제 서버에 기록을 남기게 한다. 이 기간에 Google Play 비공개 테스트 조건을 함께 채운다
- breadboard 흐름 : 새 흐름 없음. Phase 1 ~ 4의 흐름이 운영 환경에서 동작해야 한다

## Source artifacts

| 문서 | 이 Phase에서 쓰는 부분 |
|---|---|
| `shaping.md` | Appetite 절의 배포 결정 (2026-11-13) |
| `breadboard.md` | "배포" 절, Notes의 R7 · B1 관계 |
| `PHASE4_HANDOFF.md` | 인증 방식, 환경 설정 |

## Must preserve

- 지인 베타는 **Expo 테스트 배포**로 한다
- Google Play 새 개인 개발자 계정 조건 : 비공개 테스트에 **테스터 12명이 14일 연속** 참여해야 프로덕션 출시를 신청할 수 있다 (2026-11-13 Play Console 도움말 확인). 중간에 나갔다 들어오면 14일을 다시 센다 → 여유 있게 12명보다 많이 초대한다
- 지인 베타의 태깅이 해산물 제외 필터의 "미포함 확정"을 만든다 (B1). 베타 안내에 태깅을 부탁하는 문구를 넣는다
- 지인 별점은 일반 회원 기록으로 남긴다 (시드에 별점을 넣지 않는다, B6)
- 운영 DB에도 시드 30곳을 같은 마이그레이션으로 넣는다
- 정식 등록에는 개인정보 처리방침 URL이 필요하다

## Do not use as build scope

- 제보 기능 (Phase 6, 베타 중 업데이트로 배포)
- iOS 배포 (정해지지 않음 — 아래 Open questions)

## 트랙별 작업

### ⚙️ 백엔드 · 인프라

1. 호스팅 선택지를 정리해 관리자님께 고르게 한다 (비용 · 무료 한도 · PostgreSQL 제공 · 한국 리전 · 배포 방식)
2. 운영 환경 설정 (환경 변수, JWT 비밀값, DB 연결), Flyway로 스키마 · 시드 적용
3. 개인정보 처리방침 초안 (수집 항목 : 계정 정보, 기록, 태깅, 제보) 과 게시할 URL

### 📱 프론트 · 배포

1. EAS 빌드 프로필 (테스트 · 운영 서버 주소), 앱 아이콘 · 이름 확인
2. Expo 테스트 배포로 지인 설치
3. Play Console 비공개 테스트 트랙 등록, 테스터 초대 목록

### 관리자님이 직접 하실 것 (Claude가 대신할 수 없음)

- Google Play 개발자 계정 등록과 결제
- 호스팅 서비스 가입 · 결제
- 테스터 모집과 Google 계정 수집, 비공개 테스트 참여 안내

## Execution appetite (제안 — 관리자님 수락 필요)

- Protect : 운영 서버에서 Phase 1 ~ 4 흐름 동작, 개인정보 처리방침, 14일 카운트 시작
- Cut first : 앱 소개 문구 · 스크린샷 다듬기 (Phase 7에서 해도 됨)
- Stop when : 완료 기준 충족 또는 기획으로 돌아갈 때

## Execution contract

- Goal condition : 테스터 12명 이상이 비공개 테스트에 참여해 14일 카운트가 시작되고, 운영 서버에 첫 기록이 들어온다
- Required checks : 운영 서버에서 T1 · T4 · T6 · T7 · T2b 직접 확인, 시드 30곳 확인, 개인정보 처리방침 URL 접속 확인
- 바꿔도 되는 곳 : `backend/` 설정 · 배포 파일, `app/` 설정 (`app.json`, `eas.json`), `docs/` 배포 문서, `docs/planning/phases/`
- 바꾸지 않을 것 : 기능 동작, 기획 문서
- 기획으로 돌아갈 때 : 호스팅 비용이 예상보다 크다, Play 정책이 바뀌어 조건이 다르다, 베타에서 기능 결함이 크게 나온다 (Phase 4로 되돌아가 고침)

## Criterion bindings

| Req | breadboard refs | 구현 확인 | 효과 질문 |
|---|---|---|---|
| R7 | N1, N4 | 운영 서버에서 첫 실행에 30곳이 보인다 | 지인들이 지도로 갈 곳을 골랐나 |
| R8 · R0 | N10, N2, N3 | 운영 서버에서 태깅이 확정 상태를 만든다 | 베타 동안 미포함 확정 메뉴가 생겨 해산물 제외 필터가 비지 않게 되었나 |

## Open questions (Phase 시작 시 관리자님께 확인)

- 호스팅 서비스 (선택지를 정리해 드림)
- iOS도 TestFlight로 함께 할지, Android만 할지
- 테스터에게 보낼 안내 문구 (태깅 부탁 포함)

## Verification target

- 14일 카운트 시작일과 테스터 수가 `PHASE5_HANDOFF.md` 에 기록되어 있고, Phase 7이 시작될 수 있는 날짜가 적혀 있다
