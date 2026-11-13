# Context Packet — Phase 1 : 지도에 30곳이 보인다

> 이 세션에서 읽을 것 : `docs/planning/phases.md` 의 "공통 규칙" + 이 문서. 앞 Phase 없음

## Task

- 프로젝트 : 라멘타쿠 v2.0 (`shaping.md` 방향 D)
- 이번 Phase : 앱 첫 화면 (지도) 에 시드 30곳 마커가 보이고, 마커를 누르면 가게 이름과 정기 영업시간 기준 영업 상태가 보인다
- breadboard 흐름 : **T1**

## Source artifacts

| 문서 | 이 Phase에서 쓰는 부분 |
|---|---|
| `breadboard.md` | P1, P1.2, U1 ~ U4, U8, N1, N4, N12, S1 ~ S3, T1 |
| `seed-survey.md` | "확정 목록 (30곳)" 표와 가게별 결과 (정기 영업시간 · 정기 휴무 · 인스타 · 카카오 장소 ID) |
| `seed-attributes.md` | 가게별 메뉴 표 (메뉴 · 해산물 · 국물 · 종류 · 형태 · 근거), "라멘 종류" 목록 11개 |
| `shaping.md` | U4 결정 (좌표 출처), U1 결정 (속성을 `ShopRamen` 으로) |

## Do not use as build scope

- v1 시드 (`backend/src/main/resources/db/seed/seed_mapo_ramen_v2.sql`) 의 메뉴 · 6축 분류 · 좌표 — 가게 이름 참고 외에는 쓰지 않는다
- v1 `docs/api-contract.md` 의 필드 — 참고만
- `shaping.md` 의 후보 A · B · C

## Must preserve

- 요구 : **R7** 정보가 비어도 앱이 쓸모 있어야 한다 → 필터 없이 30곳이 모두 보인다
- 좌표 · 주소 출처는 **공공데이터포털 "행정안전부_식품_일반음식점"** (U4). 카카오 로컬 API의 좌표 · 주소는 저장하지 않는다. 카카오 장소 ID는 링크용으로만 저장한다
- 속성은 메뉴 (`ShopRamen`) 에 둔다. `Ramen` 은 속성이 없는 "라멘 종류" 이름표 (11개)
- 영업 상태는 서버가 계산한다 (N4). Phase 1에서는 제보가 없으므로 정기 영업시간 기준만
- 30곳은 `seed-survey.md` 확정 목록 그대로. 무겐스위치 · 부탄츄 · 츠케루 공덕 · 세이쇼라멘바 · 멘야다이고미 · 백소정 · 멘지 망원점 · 멘야타케무쇼는 넣지 않는다
- 천하일면 고기국수 2종은 시드에서 뺀다

## Project language

- `RamenShop` (가게), `ShopRamen` (메뉴 = 한 그릇), `Ramen` (라멘 종류 이름표)
- 국물 값 : 청탕 / 백탕 / 비빔 / 모름. 해산물 값 : 포함 / 미포함 / 모름
- 근거 종류 : 메뉴 설명 / 메뉴 이름 / 관리자님 확인 (시드), 방문자 n명 (Phase 4부터)
- 영업 상태 근거 문구 예 : "영업 중 · 정기 영업시간 기준", "정기 휴무", "모름"

## Relevant behavior

| ID | 이 Phase에서 할 것 |
|---|---|
| P1 · U1 | 마포구 지도 (기존 카카오맵 WebView 재사용) |
| U2 · N12 | 마커 — **기본 배지 한 모양만**. 통과 n개 · 흐림은 Phase 3 |
| U3 · U4 | 불러오는 중, 실패 + 다시 시도 |
| P1.2 · U8 | 미리보기 시트 : 가게 이름 · 영업 상태 문구 (통과 n개는 Phase 3) |
| U9 | "가게 보기"는 Phase 2에서 연결. 이 Phase에서는 숨긴다 |
| N1 | 지도 데이터 조회 (필터 없음) : 가게 id · 이름 · 좌표 · 영업 상태 · 근거 문구 |
| N4 | 영업 상태 : 정기 영업시간 → 영업 중 / 브레이크 / 영업 종료 / 정기 휴무, 정기 시간이 없으면 모름. 서버 시각 Asia/Seoul |
| S1 | 가게 : 이름, 좌표 · 주소 (공공데이터), 정기 영업시간 · 정기 휴무, 인스타 계정, 카카오 장소 ID |
| S2 | 메뉴 : 가게, 종류, 이름, 가격, 형태, 시드 해산물 · 국물 + 근거 |
| S3 | 라멘 종류 11개 |

## 트랙별 작업

### 🎨 디자인

- 기본 마커 SVG (기존 `app/src/theme/marker.ts` 토큰 확인), 미리보기 시트
- 기존 토큰으로 부족한 값이 있으면 토큰을 추가하고 화면 코드에 상수를 쓰지 않는다

### ⚙️ 백엔드

1. Flyway 도입, `ddl-auto: update` → `validate`. 개발 DB는 v2 스키마로 새로 만든다 (v1 데이터 이관 없음)
2. v2 스키마 : `ramen` (종류 이름표), `ramen_shop` (정기 영업시간 구조 + 원문), `shop_ramen` (형태, 시드 해산물 · 국물, 근거 종류 · 근거 문구)
3. 공공데이터 좌표 : 30곳을 인허가 데이터에서 찾아 좌표를 변환 (EPSG:5174 → WGS84) 해 시드에 넣는다. 사업장명과 간판 이름이 다르면 주소로 맞춘다. 매칭 결과는 `docs/planning/phases/phase1-coordinates.md` 에 가게별로 기록한다
4. 시드 마이그레이션 : 30곳 · 94줄 (묶음 줄은 메뉴별로 풀어서). 영업시간은 `seed-survey.md` 표의 값
5. 지도 API (N1) + 영업 상태 계산 (N4) + 테스트. 영업 상태는 시각을 주입받아 테스트한다 (영업 중 · 브레이크 · 종료 · 정기 휴무 · 모름)
6. `docs/api-contract-v2.md` 에 지도 API를 먼저 적고 확인받는다

### 📱 프론트

1. `KakaoMap.tsx` / `KakaoMap.web.tsx` 중복 `buildMapHtml` → `mapHtml.ts` 로 추출, `index.tsx` 임시 디버그 `useEffect` 제거 (v1 기술 부채)
2. 지도 API 타입 · 호출 함수 · 훅
3. 지도 화면 : 로딩 · 실패 + 다시 시도, 기본 마커 30개
4. 미리보기 시트 : 이름 · 영업 상태 문구

## Execution appetite (제안 — 관리자님 수락 필요)

- Worth : 기한 없음. 이 Phase는 이후 모든 Phase의 바탕
- Protect : 공공데이터 좌표, 시드 30곳, 서버 계산 영업 상태, 로딩 · 오류 상태
- Cut first : 미리보기 시트의 꾸밈 (시트 대신 간단한 하단 카드로도 완료 기준을 채울 수 있음)
- Stop when : 완료 기준 충족 또는 아래 "기획으로 돌아갈 때"

## Execution contract

- Goal condition : 앱을 켜면 30개 마커가 보이고, 아무 마커나 누르면 가게 이름과 "영업 중 · 정기 영업시간 기준" 같은 문구가 보인다
- Required checks : 백엔드 테스트 전체 통과, 영업 상태 계산 단위 테스트, 앱에서 T1 직접 확인 (로딩 · 실패 포함)
- 바꿔도 되는 곳 : `backend/` 전체, `app/src/`, `app/app/(tabs)/index.tsx`, `docs/api-contract-v2.md`, `docs/planning/phases/`
- 바꾸지 않을 것 : 가게 상세 · 필터 · 로그인 (다음 Phase), `docs/planning/` 의 기획 문서 (frame · shaping · breadboard · seed-*)
- 기획으로 돌아갈 때 :
  - 공공데이터에 좌표가 없거나 30곳 중 매칭되지 않는 곳이 생긴다 (다른 좌표 출처를 임의로 쓰지 않는다)
  - 정기 영업시간을 구조화할 수 없는 가게가 있어 영업 상태 규칙이 바뀌어야 한다
  - 공공데이터포털 인증키가 필요하다 (관리자님이 발급)
- Checkpoint : 스키마 + 시드 / 지도 API / 화면 단위로 PR
- Verification caveat : 영업시간은 2026-11-12 카카오맵 값이다. 실제와 다를 수 있다는 점을 HANDOFF에 적는다

## Criterion bindings

| Req | breadboard refs | 구현 확인 (realized conformance) | 효과 질문 (effect) |
|---|---|---|---|
| R7 | S1, S2, N1, N4, U2, U8 | 시드만으로 30곳과 영업 상태가 보인다 | 첫 사용자가 지도에서 갈 곳을 고를 수 있었나 (베타에서 확인) |

## Open questions

- 없음. 좌표 매칭 결과에 따라 생길 수 있다

## Verification target

- T1이 앱에서 동작하고, `PHASE1_HANDOFF.md` 에 스키마 · API 계약 · 좌표 매칭 결과 · 남은 것이 적혀 있다
