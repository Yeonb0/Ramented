---
planning: true
shaping: true
artifact_type: shaping
status: exploring
feeds:
  - breadboarding
---

# 라멘타쿠 — Shaping (v2)

## Working mode
- Profile : collaborative
- Current move : R 정리 → S 후보 → working fit check (선택 전)

## Frame source
- `docs/planning/frame.md` (accepted)
- x : 라멘 가게를 고를 때 메뉴별 국물 속성 · 별점 · 오늘의 영업 / 이벤트 정보가 없거나 인스타에 흩어져 있고, 다녀온 경험은 쌓이지 않는다
- f() : 이 문서에서 탐색
- y : 원하지 않는 국물의 메뉴를 빼고, 청탕 / 백탕과 메뉴 별점을 보고, 인스타 없이 휴무를 알고 고른다. 다녀온 기록이 등급 · 경쟁이 된다
- gap : 메뉴 단위 구조화 부재 · 평가 부재 · 정보 분산
- boundaries : 범용 맛집 리뷰 · 소셜이 아니다. 가게 단위 평가가 아니다
- M (Working) : M1 공개 데이터 없음 (가정) · M2 정보는 사용자들이 채운다 · M3 인스타 자동 수집 경로 없음 (재확인 필요)

## Project language and decisions
- Canonical terms (v1 코드 기준) : `Ramen` (라멘 종류 카탈로그), `RamenShop` (가게), `ShopRamen` (가게의 메뉴 = "한 그릇")
- 이 문서에서 "메뉴"는 `ShopRamen` 을 뜻한다
- 관련 결정 : v1 결정 로그는 재검토 대상 (frame 참조)

## Requirements

Status는 **제안**이며, 관리자님 확인 전까지 Authority는 Working이다.

| ID | Requirement | Status (제안) | Authority | Origin | Evidence refs |
|---|---|---|---|---|---|
| R0 | 국물 속성 (해산물 포함 여부, 청탕 / 백탕) 으로 포함 · **제외**할 수 있어야 한다 | Core goal | Working | FROM_X | S3 |
| R1 | 정통 / 조립식은 별도 표시 없이, 메뉴 별점을 통해 사용자들이 스스로 알아갈 수 있어야 한다 | Must-have | Working | FROM_X | S4, S5, S10 |
| R2 | 인스타를 쓰지 않아도 휴무 · 이벤트를 알 수 있어야 한다 | Must-have | Working | FROM_GAP | S2 |
| R3 | 영업 정보가 불확실하면 확실한 척하지 않아야 한다 | Must-have | Working | FROM_M | M3 |
| R4 | 국물 속성과 별점은 가게가 아니라 메뉴 단위로 다뤄야 한다 | Core goal | Working | FROM_X | S7 |
| R5 | 사용자가 다녀온 메뉴를 기록할 수 있어야 한다 | Must-have | Working | FROM_Y | S8 |
| R6 | 기록이 등급으로 이어져, 자기 등급 상승과 다른 사용자와의 비교가 둘 다 있어야 한다 | Nice-to-have | Working | FROM_Y | S8, S9 |
| R7 | 사용자가 채운 정보가 비어 있거나 낡았을 때도 앱이 쓸모 있어야 한다 | Must-have | Working | FROM_M | M2 |
| R8 | **(신규)** 가게 · 메뉴가 늘어나도 국물 속성 정보를 운영자 한 명이 전부 채우지 않아도 되어야 한다 | Undecided | Working | FROM_M | M2, S6 |

R8은 fit check 중 드러났다. "운영자가 시드 데이터를 직접 채운다"는 후보가 R0 · R7은 통과하지만 M2 (정보는 사용자들이 채운다) 와 어긋나는데, 이를 잡을 R이 없었다. 관리자님이 받아들이실지 결정이 필요하다.

## Appetite
- Authority : **Unset** — 관리자님 결정 필요
- Budget : 미정 (예 : MVP까지 몇 주 / 학기 중 주당 몇 시간)
- Cut line : 미정
- 아래 모든 적합성 판단은 appetite 미정 상태의 working 판단이다

## Shapes

### CURRENT : v1 구현 (근거로만 사용)

| Part | Mechanism | Flag |
|---|---|:---:|
| CURRENT1 | 국물 속성 (`soupBase` · `clarity` 등 6축) 이 **`Ramen` 카탈로그**에 붙고, `ShopRamen` 은 가게와 카탈로그를 잇기만 한다 | |
| CURRENT2 | `soupBase` 는 단일 값 (PORK, SEAFOOD, MIXED …) | |
| CURRENT3 | 운영자 시드 데이터로 가게 · 메뉴 입력 | |
| CURRENT4 | 별점 · 기록 · 영업 정보 미구현 | |

CURRENT에서 드러난 사실 :
- 같은 가게의 시오 / 쇼유가 육수가 다를 때 (S7), 카탈로그 `Ramen` 이 "쇼유 라멘" 하나뿐이면 표현할 수 없다. 메뉴마다 별도 카탈로그를 만들어야 해서 카탈로그가 사실상 메뉴 수만큼 늘어난다
- `soupBase` 가 단일 값이라, 돈코츠 + 어패 같은 더블 수프는 `MIXED` 가 되고 **해산물이 들어갔다는 사실이 사라진다.** R0의 "해산물 빼기"를 판정할 수 없다

### 공통 부품 (모든 후보에 들어감)

후보 간에 차이가 없어서 비교에서 빼고 공통으로 둔다.

| Part | Mechanism | Flag |
|---|---|:---:|
| X1 | 국물 속성을 메뉴 (`ShopRamen`) 단위로 가진다 | |
| X2 | 해산물 포함 여부를 `soupBase` 단일 값이 아니라 **별도 값** (포함 / 미포함 / 모름) 으로 가진다 | |
| X3 | 별점은 메뉴 단위, 별점 옆에 항상 메뉴명 | |
| X4 | 방문 기록 = 메뉴 하나 + 별점 + 방문일. 기록 수로 주간 등급 · 랭킹 | ⚠️ |
| X5 | 영업 상태는 확신도 문구와 함께 표시, 모르면 "모름" (R3) | |

⚠️ X4 : 랭킹이 기록을 부풀리는 동기 (가짜 방문 기록) 를 만들 수 있다. 막는 방식은 아직 윤곽만 있음.

후보를 가르는 질문은 하나다 : **메뉴별 국물 속성과 휴무 정보를 누가 채우는가.**

### A : 운영자 큐레이션

| Part | Mechanism | Flag |
|---|---|:---:|
| A1 | 운영자가 지역 하나 (예 : 마포구) 의 가게 · 메뉴 · 국물 속성을 직접 조사해 입력 | |
| A2 | 사용자는 별점 · 기록만 남긴다. 속성은 수정 제안만 가능, 운영자가 반영 | |
| A3 | 휴무 · 이벤트는 사용자가 "오늘 닫혀 있었어요" 제보 (24시간 유효) + 인스타 링크아웃 | |

### B : 방문자 태깅 (크라우드)

| Part | Mechanism | Flag |
|---|---|:---:|
| B1 | 기록을 남길 때 "해산물 맛이 났나요? / 국물이 맑았나요?" 를 한 번에 탭 몇 번으로 답한다 | ⚠️ |
| B2 | 메뉴의 속성 = 태깅 다수결 + 응답 수. 응답이 적으면 "확인 중"으로 표시 | |
| B3 | 가게 · 메뉴 자체도 사용자가 등록 | |
| B4 | 휴무 · 이벤트는 A3과 같음 | |

⚠️ B1 : **방문자가 해산물 육수 여부를 맛으로 알 수 있는지 모른다.** 니보시 · 어패 계열은 메뉴판에 적혀 있는 경우도 있지만, 숨은 다시는 손님이 알기 어렵다. Spike 필요.

### C : 사장님 참여

| Part | Mechanism | Flag |
|---|---|:---:|
| C1 | 사장님이 가게를 인증하고 메뉴별 국물 속성을 직접 입력 | |
| C2 | 사장님이 휴무 · 이벤트를 앱에 직접 올린다 (인스타 대신 또는 함께) | ⚠️ |
| C3 | 사장님이 없는 가게는 비어 있음 | |

⚠️ C2 : 이미 인스타에 올리는 사장님이 앱에 한 번 더 올릴 이유가 있는지 모른다.

### D : 시드로 시작 + 방문자 태깅으로 확장 (A + B 조합)

| Part | Mechanism | Flag |
|---|---|:---:|
| D1 | 첫 지역은 운영자가 큐레이션 (= A1) | |
| D2 | 이후 가게 · 메뉴 등록과 속성 확인은 방문자 태깅 (= B1 ~ B3). 시드 값도 태깅으로 확인 · 수정됨 | ⚠️ |
| D3 | 휴무 · 이벤트는 A3과 같음 | |

⚠️ D2 : B1과 같은 미확인.

## Candidate evidence

| Candidate | Evidence | Question | R/S implication | Remaining uncertainty |
|---|---|---|---|---|
| CURRENT | v1 엔티티 (`Ramen.java`, `ShopRamen.java`, `SoupBase.java`) | 지금 구조로 R0 · R4를 만족하나 | ❌ → 공통 부품 X1 · X2 도출 | — |
| B, D | 아직 없음 | 방문자가 해산물 육수 여부를 판단할 수 있나 | 판단 불가면 B1 · D2를 "메뉴판 표기 확인" 등으로 바꿔야 함 | **Spike S-1 필요** |
| A, B, C, D | 아직 없음 | 인스타 자동 수집이 정말 불가능한가 (M3) | 가능하면 R2 메커니즘 전체가 달라짐 | **Spike S-2 필요** |

## Fit check
- Authority : **Working** (R · appetite 미확정)

| Req | Requirement | Status (제안) | CURRENT | A | B | C | D |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| R0 | 국물 속성으로 포함 · 제외 | Core goal | ❌ | ✅ | ✅ | ✅ | ✅ |
| R1 | 메뉴 별점으로 정통성을 알아감 | Must-have | ❌ | ✅ | ✅ | ✅ | ✅ |
| R2 | 인스타 없이 휴무 · 이벤트 | Must-have | ❌ | ✅ | ✅ | ✅ | ✅ |
| R3 | 불확실하면 확실한 척 안 함 | Must-have | ❌ | ✅ | ✅ | ✅ | ✅ |
| R4 | 메뉴 단위 | Core goal | ❌ | ✅ | ✅ | ✅ | ✅ |
| R5 | 다녀온 메뉴 기록 | Must-have | ❌ | ✅ | ✅ | ✅ | ✅ |
| R6 | 등급 + 비교 | Nice-to-have | ❌ | ✅ | ✅ | ✅ | ✅ |
| R7 | 정보가 비어도 쓸모 있음 | Must-have | ❌ | ✅ | ❌ | ❌ | ✅ |
| R8 | 운영자 혼자 다 채우지 않음 | Undecided | ❌ | ❌ | ✅ | ✅ | ✅ |

설명 :
- R0 ~ R6은 공통 부품 X1 ~ X5가 담당하므로 A ~ D가 모두 통과한다. 후보 차이는 R7 · R8에서만 난다
- B · C의 R7 ❌ : 첫 사용자가 들어왔을 때 지도가 비어 있다 (B는 기록이 쌓이기 전, C는 사장님이 오기 전)
- A의 R8 ❌ : 지역이 늘수록 운영자 작업이 선형으로 늘어난다
- D는 두 행을 다 통과하지만, D2가 Spike S-1 결과에 달려 있다. **S-1이 실패하면 D의 R0 커버리지가 시드 지역 밖에서 무너진다**
- C의 R2는 사장님이 실제로 참여할 때만 의미가 있다 (C2 ⚠️)

## Reverse fit check (D 기준, 가장 깊이 본 후보)

| Shape part | Mechanism | Requirement(s) served | Justified? |
|---|---|---|:---:|
| D1 | 첫 지역 큐레이션 | R7 | ✅ |
| D2 | 방문자 태깅 | R0, R8 | ✅ |
| D3 | 휴무 제보 + 링크아웃 | R2, R3 | ✅ |
| X4 의 랭킹 | 다른 사용자와 비교 | R6 | ✅ (Nice-to-have) |

## Appetite fit
- appetite 미정 → 판단 보류

## Generation-omission check
- A ~ C는 "운영자 / 방문자 / 사장님"이라는 서로 다른 메커니즘 가족이다. D는 A와 B의 조합
- 빠졌을 수 있는 가족 : **외부 데이터 연동** (카카오 · 네이버 장소 정보의 메뉴판 텍스트를 읽어 속성을 추정) — 메뉴판에 "어패", "니보시"가 적힌 경우를 잡을 수 있으나, M1 (공개 데이터 없음) 과 이름 문자열 파싱 금지 원칙에 걸린다. 아직 후보로 만들지 않음

## Spikes 필요

- **S-1 : 방문자가 해산물 육수 여부를 판단할 수 있나** — 관리자님이 다녀본 가게 몇 곳을 떠올려, "먹어보고 알았는지 / 메뉴판에 적혀 있었는지 / 몰랐는지" 를 적어 보는 것만으로도 충분한 근거가 됨
- **S-2 : 인스타 자동 수집 가능 여부 재확인** — Instagram Graph API의 현재 제공 범위 조사

## Decision
- Status : exploring
- Chosen direction : 없음
- 관리자님 결정 필요 : R 상태 (특히 R6 · R8), appetite, S-1 진행 여부

## Next useful move
- R 상태 확정 → appetite 설정 → S-1 → 선택
