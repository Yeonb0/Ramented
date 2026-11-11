---
planning: true
shaping: true
artifact_type: shaping
status: selected
feeds:
  - breadboarding
---

# 라멘타쿠 — Shaping (v2)

## Working mode
- Profile : collaborative
- Current move : 선택 완료 → selected-design breadboard

## Frame source
- `docs/planning/frame.md` (accepted)
- x : 라멘 가게를 고를 때 메뉴별 국물 속성 · 별점 · 오늘의 영업 / 이벤트 정보가 없거나 인스타에 흩어져 있고, 다녀온 경험은 쌓이지 않는다
- f() : 이 문서에서 탐색
- y : 원하지 않는 국물의 메뉴를 빼고, 청탕 / 백탕과 메뉴 별점을 보고, 인스타 없이 휴무를 알고 고른다. 다녀온 기록이 등급 · 경쟁이 된다
- gap : 메뉴 단위 구조화 부재 · 평가 부재 · 정보 분산
- boundaries : 범용 맛집 리뷰 · 소셜이 아니다. 가게 단위 평가가 아니다
- M (Working) : M1 공개 데이터 없음 (가정) · M2 정보는 사용자들이 채운다 · M3 인스타 정보 수집 범위는 Spike S-2 결과로 갱신 (아래)

## Project language and decisions
- Canonical terms (v1 코드 기준) : `Ramen` (라멘 종류 카탈로그), `RamenShop` (가게), `ShopRamen` (가게의 메뉴 = "한 그릇")
- 이 문서에서 "메뉴"는 `ShopRamen` 을 뜻한다

## Requirements

| ID | Requirement | Status | Authority | Origin | Evidence refs |
|---|---|---|---|---|---|
| R0 | 국물 속성 (해산물 포함 여부, 청탕 / 백탕) 으로 포함 · **제외**할 수 있어야 한다 | Core goal | Accepted | FROM_X | S3 |
| R1 | 정통 / 조립식은 별도 표시 없이, 메뉴 별점을 통해 사용자들이 스스로 알아갈 수 있어야 한다 | Must-have | Accepted | FROM_X | S4, S5, S10 |
| R2 | 인스타를 쓰지 않아도 휴무 · 이벤트를 알 수 있어야 한다 | Must-have | Accepted | FROM_GAP | S2 |
| R3 | 영업 정보가 불확실하면 확실한 척하지 않아야 한다 | Must-have | Accepted | FROM_M | M3 |
| R4 | 국물 속성과 별점은 가게가 아니라 메뉴 단위로 다뤄야 한다 | Core goal | Accepted | FROM_X | S7 |
| R5 | 사용자가 다녀온 메뉴를 기록할 수 있어야 한다 | Must-have | Accepted | FROM_Y | S8 |
| R6 | 기록이 등급으로 이어져, 자기 등급 상승과 다른 사용자와의 비교가 둘 다 있어야 한다 | Nice-to-have | Accepted | FROM_Y | S8, S9 |
| R7 | 사용자가 채운 정보가 비어 있거나 낡았을 때도 앱이 쓸모 있어야 한다 | Must-have | Accepted | FROM_M | M2 |
| R8 | 가게 · 메뉴가 늘어나도 국물 속성 정보를 운영자 한 명이 전부 채우지 않아도 되어야 한다 | Must-have | Accepted | FROM_M | M2, S6 |

수락 근거 : 관리자님 2026-11-11 19:59 ("둘다 맞아" — R6 Nice-to-have, R8 수락)

## Appetite
- Authority : **Accepted** (관리자님 2026-11-11 20:02 "그래")
- 관리자님 답변 : 정해진 기한 없음, 시간 나는 대로
- 기한이 없으므로 **시간 대신 범위를 고정**한다 (아래 cut line). 범위가 고정돼 있어야 "다 됐다"가 정의되고, 끝없이 늘어나지 않는다
- 제안 cut line — 첫 공개 버전 (v2.0) 에 들어가는 것 :
  - 지역 1곳의 가게 · 메뉴 (운영자 시드)
  - 지도 + 국물 속성 필터 (해산물 제외, 청탕 / 백탕)
  - 메뉴 상세 + 메뉴 단위 별점
  - 방문 기록 (메뉴 + 별점 + 방문일 + 속성 태깅)
  - 휴무 제보 + 인스타 링크아웃
  - 회원가입 / 로그인
- cut line 밖 (v2.0 이후) : 등급 · 랭킹 (R6), 인증샷, 가게 · 메뉴 사용자 등록, 이벤트, 인스타 게시물 앱 내 표시 (D4)
- Revisit conditions : 시드 지역 밖에서 사용자가 생기면 / 한 슬라이스가 두 달 넘게 끝나지 않으면

## Shapes

### CURRENT : v1 구현 (근거로만 사용)

| Part | Mechanism | Flag |
|---|---|:---:|
| CURRENT1 | 국물 속성 (`soupBase` · `clarity` 등 6축) 이 **`Ramen` 카탈로그**에 붙고, `ShopRamen` 은 가게와 카탈로그를 잇기만 한다 | |
| CURRENT2 | `soupBase` 는 단일 값 (PORK, SEAFOOD, MIXED …) | |
| CURRENT3 | 운영자 시드 데이터로 가게 · 메뉴 입력 | |
| CURRENT4 | 별점 · 기록 · 영업 정보 미구현 | |

CURRENT에서 드러난 사실 :
- 같은 가게의 시오 / 쇼유가 육수가 다를 때 (S7) 카탈로그 `Ramen` 하나로 표현할 수 없다
- `soupBase` 가 단일 값이라 더블 수프는 `MIXED` 가 되고 해산물 포함 사실이 사라진다 → R0 판정 불가

### 공통 부품 (모든 후보에 들어감)

| Part | Mechanism | Flag |
|---|---|:---:|
| X1 | 국물 속성을 메뉴 (`ShopRamen`) 단위로 가진다 | |
| X2 | 해산물 포함 여부를 `soupBase` 단일 값이 아니라 **별도 값** (포함 / 미포함 / 모름) 으로 가진다 | |
| X3 | 별점은 메뉴 단위, 별점 옆에 항상 메뉴명 | |
| X4 | 방문 기록 = 메뉴 하나 + 별점 + 방문일. 기록 수로 주간 등급 · 랭킹 | ⚠️ |
| X5 | 영업 상태는 확신도 문구와 함께 표시, 모르면 "모름" (R3) | |

⚠️ X4 : 랭킹이 가짜 방문 기록 동기를 만들 수 있다. R6이 cut line 밖이므로 v2.0에서는 미해결로 둔다.

### A : 운영자 큐레이션
| Part | Mechanism |
|---|---|
| A1 | 운영자가 지역 하나의 가게 · 메뉴 · 국물 속성을 직접 조사해 입력 |
| A2 | 사용자는 별점 · 기록만, 속성은 수정 제안 → 운영자 반영 |
| A3 | 휴무 · 이벤트는 사용자 제보 (24시간 유효) + 인스타 링크아웃 |

### B : 방문자 태깅
| Part | Mechanism |
|---|---|
| B1 | 기록할 때 해산물 · 청탕 / 백탕을 탭 몇 번으로 태깅 (선택지에 "메뉴판에 적혀 있었음 / 먹어보니 그랬음 / 모르겠음") |
| B2 | 메뉴 속성 = 태깅 다수결 + 응답 수. 적으면 "확인 중" |
| B3 | 가게 · 메뉴도 사용자가 등록 |
| B4 | 휴무 · 이벤트는 A3과 같음 |

### C : 사장님 참여 — **보류**
관리자님 판단 (19:59) : 있으면 좋지만 주 경로로 두지 않는다. 이후 확장 후보로만 남긴다.

### D : 시드로 시작 + 방문자 태깅으로 확장 (A + B)
| Part | Mechanism | Flag |
|---|---|:---:|
| D1 | 첫 지역은 운영자가 큐레이션 (= A1) | |
| D2 | 이후 속성 확인 · 가게 등록은 방문자 태깅 (= B1 ~ B3). 시드 값도 태깅으로 확인 · 수정됨 | |
| D3 | 휴무 · 이벤트 : 사용자 제보 (24시간 유효) + 인스타 링크아웃. 제보할 때 근거를 고른다 : "직접 가봄" / "인스타 (게시물 · 스토리) 에서 봄". 인스타 사용자가 본 스토리를 비사용자에게 옮겨주는 통로 | |
| D4 | **(선택 부품)** 가게가 인스타 프로페셔널 계정이면 최신 피드 게시물을 앱에서 보여준다 (Business Discovery) | ⚠️ |

⚠️ D4 : 스토리는 못 가져온다 (휴무 공지가 주로 스토리라면 효과 작음). Meta 앱 검수, 운영자 프로페셔널 계정, 게시물 표시 약관 확인이 필요하다. 캡션을 파싱해 "휴무"를 판정하지 않고 원문 그대로 보여주는 것까지만.

## Candidate evidence

| Candidate | Evidence | Question | R/S implication | Remaining uncertainty |
|---|---|---|---|---|
| CURRENT | v1 엔티티 (`Ramen.java`, `ShopRamen.java`, `SoupBase.java`) | 지금 구조로 R0 · R4를 만족하나 | ❌ → 공통 부품 X1 · X2 | — |
| B, D | **S-1 결과** : 관리자님 경험상 해산물 육수를 먹어보고 안 적도, 메뉴판에서 본 적도 있음 | 방문자가 판단할 수 있나 | 부분적으로 가능 → B1에 "근거 + 모르겠음" 선택지 필수. "모르겠음"은 다수결에서 빼고 응답 수로만 셈 | 숨은 다시처럼 둘 다 안 되는 경우는 "모름"으로 남음 |
| A ~ D | **S-2 결과** : Meta 문서상 Business Discovery로 다른 프로페셔널 계정의 게시된 미디어 · 기본 지표는 조회 가능, 스토리 언급 없음 | 인스타 정보를 자동으로 가져올 수 있나 | M3 수정 : "전혀 불가" → "프로페셔널 계정의 피드 게시물만 가능". D4 부품 추가 | 스토리 불가, 앱 검수 · 약관 미확인 |

## Fit check
- Authority : **Decision-ready** (R 수락 완료, appetite는 Working)

| Req | Requirement | Status | CURRENT | A | B | D |
|---|---|---|:---:|:---:|:---:|:---:|
| R0 | 국물 속성으로 포함 · 제외 | Core goal | ❌ | ✅ | ✅ | ✅ |
| R1 | 메뉴 별점으로 정통성을 알아감 | Must-have | ❌ | ✅ | ✅ | ✅ |
| R2 | 인스타 없이 휴무 · 이벤트 | Must-have | ❌ | ✅ | ✅ | ✅ |
| R3 | 불확실하면 확실한 척 안 함 | Must-have | ❌ | ✅ | ✅ | ✅ |
| R4 | 메뉴 단위 | Core goal | ❌ | ✅ | ✅ | ✅ |
| R5 | 다녀온 메뉴 기록 | Must-have | ❌ | ✅ | ✅ | ✅ |
| R6 | 등급 + 비교 | Nice-to-have | ❌ | ✅ | ✅ | ✅ |
| R7 | 정보가 비어도 쓸모 있음 | Must-have | ❌ | ✅ | ❌ | ✅ |
| R8 | 운영자 혼자 다 채우지 않음 | Must-have | ❌ | ❌ | ✅ | ✅ |

- A는 R8 (Must-have) 에서, B는 R7 (Must-have) 에서 탈락한다
- D만 Must-have를 모두 통과한다. S-1 결과로 D2의 근거가 생겼다
- R2는 D3만으로 통과한다. D4는 R2를 강화하지만 필수는 아니다

## Reverse fit check (D)

| Shape part | Mechanism | Requirement(s) served | Justified? |
|---|---|---|:---:|
| D1 | 첫 지역 큐레이션 | R7 | ✅ |
| D2 | 방문자 태깅 | R0, R8 | ✅ |
| D3 | 휴무 제보 + 링크아웃 | R2, R3 | ✅ |
| D4 | 인스타 피드 표시 | R2 (보강) | ✅ — 단 필수 아님, cut line 밖 제안 |
| X4 랭킹 | 다른 사용자와 비교 | R6 | ✅ (Nice-to-have, cut line 밖) |

## Requirement coverage (D 선택 시)

| Req | Supporting part(s) | Coverage | Realization question |
|---|---|:---:|---|
| R0 | X1, X2, D1, D2 | ✅ | 해산물 "포함" 메뉴가 필터에서 실제로 빠지는가, "모름"은 어떻게 처리되는가 |
| R1 | X3 | ✅ | 별점이 보이는 모든 자리에 메뉴명이 붙어 있는가 |
| R2 | D3 (+ D4) | ✅ | 인스타 미사용자가 앱만으로 오늘 휴무를 알 수 있는가 |
| R3 | X5 | ✅ | 제보가 없을 때 "영업중"이라고 단언하지 않는가 |
| R4 | X1, X3 | ✅ | 같은 가게 두 메뉴의 속성이 다르게 저장 · 표시되는가 |
| R5 | X4 | ✅ | 메뉴 하나에 기록을 남길 수 있는가 |
| R6 | X4 | ✅ | (cut line 밖) |
| R7 | D1 | ✅ | 시드 지역 지도가 첫 실행에 비어 있지 않은가 |
| R8 | D2 | ✅ | 운영자 개입 없이 태깅만으로 메뉴 속성이 바뀌는가 |

## Appetite fit
- appetite Working → D는 제안 cut line 안에 D1 · D2 (태깅) · D3이 들어간다. D2의 "가게 · 메뉴 사용자 등록"과 D4는 cut line 밖

## Generation-omission check
- A ~ C는 운영자 / 방문자 / 사장님이라는 서로 다른 가족. D는 A + B
- 생성하지 않은 가족 : 외부 장소 데이터의 메뉴판 텍스트로 속성 추정 — 이름 문자열 파싱 금지 원칙 · M1과 충돌하여 제외

## Decision
- Status : **selected** (관리자님 2026-11-11 20:02)
- Chosen direction : **D** (시드로 시작 + 방문자 태깅으로 확장) + 공통 부품 X1 ~ X5
- D4 (인스타 피드 앱 내 표시) : cut line 밖. 관리자님 관찰상 가게들은 휴무 · 이벤트를 **스토리**에도 올리는데 Business Discovery는 스토리를 다루지 않으므로, D4만으로는 R2를 채우지 못한다
- Rationale : Must-have R7 · R8을 동시에 통과하는 유일한 후보. S-1로 방문자 태깅의 근거 확보
- D3 보강 : 스토리 문제는 "인스타를 쓰는 사용자가 본 것을 앱에 제보"로 메운다. 제보 근거 (직접 가봄 / 인스타에서 봄) 가 확신도 문구 (R3) 의 재료가 된다
- Cuts / non-goals : 등급 · 랭킹, 인증샷, 사용자 가게 · 메뉴 등록, 이벤트 상세, D4, 사장님 참여 (C)
- Accepted uncertainty : 숨은 다시는 태깅으로도 "모름"으로 남을 수 있음. 제보가 없으면 영업 상태는 "모름"
- Remaining unknowns : 시드 지역 선정, 태깅 다수결의 최소 응답 수
- Next : selected-design breadboard
