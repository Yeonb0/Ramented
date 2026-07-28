# 🍜 라멘타쿠 (Ramentaku) — 나만의 라멘 지도 기록 앱 (Mobile)

> 지도 위에서 라멘 가게를 탐색하고, 특정 라멘을 파는 가게를 골라보고, 방문 인증샷과 라멘별 별점으로 나만의 라멘 지도를 완성하는 **모바일 앱**.

*(프로젝트명 `라멘타쿠 (Ramentaku)` — "라멘(Ramen)"과 "덕후(오타쿠, otaku)"를 합친 이름입니다.)*

---

## 📖 프로젝트 소개

라멘 가게를 지도에 시각화하고, 사용자가 직접 방문한 곳을 사진·라멘별 별점과 함께 기록하는 개인 모바일 앱입니다. **React Native + Expo**로 클라이언트를, **Java + Spring Boot**로 REST API 백엔드를 구성합니다. 백엔드는 클라이언트(웹/앱)와 무관하게 동작하므로, 이후 웹 확장 시에도 그대로 재사용할 수 있습니다.

**제품 한 줄** — 평점은 가게가 아니라 **메뉴 하나**에 붙는다. "이 가게 4.5"가 아니라 "이 가게의 돈코츠 4.5". 화면 어디서든 별점 옆에 **메뉴명 + '이 메뉴의 별점' 라벨**이 함께 읽혀야 한다.

**핵심 학습 목표**

- React Native + Expo + **TypeScript** 실전 (기존 React 지식 재사용 + 모바일 전환)
- Spring Boot REST API 설계 및 JPA **N:M 연관관계(중간 엔티티)** 매핑
- Spring Security + JWT 기반 인증/인가
- 카메라·이미지 업로드 및 외부 스토리지(S3/Cloudinary) 연동
- 집계 쿼리를 이용한 취향 분석 및 게이미피케이션(등급) 구현
- Expo EAS Build를 통한 앱 빌드/배포

---

## ✨ 주요 기능

| 기능                                 | 설명                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| 🗺️ **지도 탐색**                      | 지도 위에 라멘 가게를 마커로 표시                            |
| 🍜 **라멘별 탐색**                    | 특정 라멘(돈코츠/쇼유/미소/시오/츠케멘 등)을 선택하면 그 라멘을 파는 가게만 표시 |
| 🏆 **전문점 필터** *(옵션)*           | 그 라멘'만' 취급하는 전문점만 골라보기                       |
| 🔍 **필터**                           | 선택한 라멘 + 지역 조합으로 가게 필터링                      |
| 🔐 **인증**                           | 이메일 기반 회원가입 / 로그인 (JWT)                          |
| ⭐ **라멘별 별점**                    | 가게 전체가 아닌 "가게의 그 라멘"별 평균 별점 (같은 라멘을 가게별로 비교) |
| 📸 **인증샷 기록**                    | 카메라/앨범으로 방문 사진 첨부 리뷰 작성, 나만의 방문 기록   |
| 📊 **취향 분석**                      | 내 리뷰를 라멘 종류·지역별로 집계해 취향 리포트 제공         |
| 🎖️ **라멘 등급**                      | 최근 7일 라멘 방문 횟수에 따른 "이번 주 등급"을 프로필 아바타 테두리(링)로 표시 |
| 📣 **이벤트 알림 & 후기** *(Stretch)* | 가게 이벤트 푸시 알림 + 이벤트 전용 후기                     |
| 🍥 **사이드 궁합** *(Stretch)*        | 가게별 인기 메인+사이드 조합 평가 & 추천                     |

---

## 🛠 기술 스택

### Frontend (Mobile App)

- **React Native + Expo + TypeScript**
- **expo-router** — 파일 기반 라우팅 / 탭 내비게이션
- **TanStack Query** — 서버 상태 관리 / 캐싱 / 로딩·에러 처리
- **카카오맵 Web(JavaScript) SDK** — `react-native-webview`로 임베드 (Phase 1 결정)
- **react-native-webview** — 카카오맵 WebView 컨테이너
- **react-native-svg** — 아이콘 세트·등급 링·빈 상태 일러스트 렌더링
- **expo-font** — 나눔스퀘어라운드 로딩
- **expo-camera / expo-image-picker** — 인증샷 촬영·선택
- **expo-secure-store** — JWT 토큰 안전 저장
- **expo-notifications** — 푸시 알림 *(Stretch)*

> **지도 SDK 결정 (Phase 1): 카카오맵 Web SDK를 `react-native-webview`로 임베드**
> 국내 POI 강점 + 기존 카카오 지식 재사용. RN 네이티브 브리지 대신 WebView라
> 통합이 덜 매끄럽고 origin(도메인) 검증 이슈가 있으나 baseUrl로 해결.
> (대안: react-native-maps → 국내 데이터 약함 / 네이버 RN SDK → 후순위)

### Backend (변경 없음)

- **Java 25 + Spring Boot 3.x**
- **Spring Web** — REST API
- **Spring Data JPA** — ORM
- **Spring Security + JWT** — 인증/인가
- **PostgreSQL** — 데이터베이스
- (선택) **AWS S3** 또는 **Cloudinary** — 이미지 스토리지

### DevOps / 배포

- **App 빌드**: Expo **EAS Build** → 개발 중엔 Expo Go / 개발 빌드, 배포 시 TestFlight·Play Console 또는 Expo 공유 링크
- **Backend**: Railway 또는 Render (관리형 PostgreSQL 포함)
- **CI/CD**: GitHub Actions

---

## 🏗 아키텍처

```
┌──────────────┐       HTTPS / REST        ┌──────────────┐
│  Mobile App  │ ────────────────────────▶ │ Spring Boot  │
│ RN + Expo TS │ ◀──────────────────────── │   REST API   │
│              │       JSON / JWT          │ (Railway)    │
└──────┬───────┘                           └──────┬───────┘
       │                                          │
       │ 지도 SDK / 카메라                         │ JPA
       ▼                                          ▼
┌──────────────┐                           ┌──────────────┐
│  Map / Cam   │                           │  PostgreSQL  │
└──────────────┘                           └──────────────┘
       │
       │ 이미지 업로드
       ▼
┌──────────────┐        (Stretch)          ┌──────────────┐
│ S3/Cloudinary│      Expo Push  ◀──────────│  알림 트리거  │
└──────────────┘                           └──────────────┘
```

---

## 🎨 디자인 시스템 (시안 1차 확정)

> **원본 산출물** — 화면 시안 3종 + 마커 검수 패널: `docs/design/screens.dc.html` / SVG 아이콘 세트: `docs/design/icons.dc.html` / 재현용 프롬프트: `docs/design/screen-design.md`
> 코드에 색·크기를 하드코딩하지 않는다. 모든 값은 `app/src/theme/` 토큰을 거친다.

### 아트 디렉션 원칙

- 아이보리 배경 + 쇼유 브라운. **납작한(flat) 일러스트 톤**, 따뜻하고 만화적인 색감.
- **그림자 금지.** RN의 `shadow*` / `elevation` 을 쓰지 않는다. 깊이는 **면 + 아웃라인**으로만 낸다 — 모든 카드/박스 테두리는 `1.5px solid #CBB593`.
- 그라디언트·텍스처(사선 그레인, 노이즈) 금지. 색은 전부 단색 면.
- 라운드: 카드 14~20 / 기기 프레임 28 / 칩·토글 999.
- 상단(헤더)·하단(탭바)은 진한 갈색 `#6A4729` 단색. **바 자체에 border-radius를 주지 않는다.** SafeArea 영역까지 같은 색으로 확장.
- 갈색 바 위 요소는 반전: 텍스트/아이콘 크림 `#FDFAF4`, 보조 라벨 `#EFE0CC`, 라이트 칩 `#EFE0CC`+`#A2764C` 테두리, 반투명 칩 `rgba(253,250,244,0.18)`+`#EFE0CC` 테두리.
- **이모지를 아이콘 대신 쓰지 않는다.** 아이콘은 아래 SVG 세트만 사용.
- 라멘 스톡 사진을 배경으로 깔지 않는다. 앱에 존재하는 이미지는 **유저 인증샷뿐**이며, 로딩 전에는 줄무늬 플레이스홀더를 쓴다.

### 색 토큰

```
bg #FDFAF4 · surface #F5EDDF · surfaceSunken #EFE5D3
border #E2D2B6 · borderStrong #CBB593
primary #B98B5E · primaryPressed #A2764C · primaryDark #7A5334 · primarySoft #EFE0CC
바 배경 #6A4729
text #3B2C21 · textSecondary #6B5642 · textMuted #9C8B79 · textOnPrimary #FDFAF4
star #D9963F · danger #B5503F
```

### 타이포그래피

- **나눔스퀘어라운드** R/B/EB (400·700·800), 자간 -0.2px
- 스케일: `caption 12/18` · `footnote 13/20` · `body 15/24` · `subtitle 17/26` · `title 20/30` · `display 26/38`

### 지도 마커 규칙

색은 라멘 **이름**이 아니라 **타래 × 탁도** 조합으로 결정한다. (프런트가 이름 문자열로 색을 추론하지 않도록 API가 `tare`·`clarity`·`form`을 그대로 내려준다.)

| 조합 | fill | stroke | mark | 해당 라멘 |
| --- | --- | --- | --- | --- |
| 시오 × 백탕 | `#DBD0BA` | `#85694A` | `#5E4835` | 돈코츠 라멘 |
| 시오 × 청탕 | `#6E9BB8` | `#4F7A96` | `#FDFAF4` | 시오 츠케멘 |
| 쇼유 × 백탕 | `#E0CBA0` | `#A9884E` | `#5E4835` | 토리파이탄 쇼유 |
| 쇼유 × 청탕 | `#C08A2E` | `#96690F` | `#FDFAF4` | 마제소바 |
| 미소 × 백탕 | `#D9B6A6` | `#A9705A` | `#6E3A28` | 미소 라멘 |
| 미소 × 청탕 | `#A8503A` | `#83381F` | `#FDFAF4` | (미배정) |

- 백탕 계열은 아이보리·회색 배경에서 흐려지므로 **stroke는 장식이 아니라 가독성 장치**다. 절대 빼지 않는다.
- 내부 마크는 **형태(`Form`)** 로 구분: `RAMEN` = 원 / `TSUKEMEN` = 둥근 사각 / `MAZESOBA` = 마름모.
- **필터가 없는 상태**에서는 한 가게가 여러 라멘을 팔기 때문에 색을 쓰지 않는다 → 중립 마커 `#A89078` / stroke `#85705A` + 취급 라멘 수 배지.

### SVG 아이콘 세트

`viewBox 24` · `currentColor` · `stroke-width 1.75` · `round` · 아이콘당 path 2~3개 · mask/filter/clipPath/그라디언트 없음.

| 그룹 | 아이콘 |
| --- | --- |
| 내비게이션 | 지도 / 내 기록 / 프로필 (활성 크림 `#FDFAF4`, 비활성 `#EFE0CC`) |
| 라멘 형태 | 라멘(국물) / 츠케멘(그릇 두 개) / 마제소바(무국물+젓가락) |
| 기능 | 별 빈·반·꽉 / 카메라 / 위치 핀 / 영업시간 |
| 전문점 | 노렌 (= "이 집은 한 그릇만 낸다") |
| 등급 링 | `viewBox 96` 3종 — 색이 아니라 **겹의 수**로 등급 상승 (1겹 → 2겹+눈금 → 2겹+눈금+상단 마름모 3개) |
| 빈 상태 | `viewBox 160×120` 빈 돈부리 + 걸쳐둔 젓가락 |

- 15px 이하로 축소할 땐 국물 표면선·젓가락만 남기고 안쪽 디테일(면 웨이브, 김)은 뺀다.
- 등급 링의 아바타 지름은 링 viewBox의 78%(96 기준 r=38 안쪽)로 고정해야 세 등급이 같은 위치에 앉는다.

### 시안이 확정된 화면

| # | 화면 | 대응 Phase |
| --- | --- | --- |
| ① | 지도 홈 (라멘 선택 상태) | Phase 2 |
| ② | 가게 상세 (메뉴별 별점) | Phase 4 |
| ③ | 프로필 (이번 주 등급 + 취향 리포트) | Phase 6 |

### 아직 시안이 없는 화면 — 착수 직전에 결정

로그인·회원가입(Phase 3) / 리뷰 작성 "기록 남기기"(Phase 4~5) / 내 기록 목록(Phase 5) / 가게 검색(Phase 2, 스텁 가능) / 로딩·에러 상태(Phase 8).
→ 새 시안 없이 **토큰 + 공통 프리미티브 조합**으로 만든다. 새 색·새 형태를 만들지 않는 것이 규칙.

### 미결 이슈 (해결 전까지 구현 보류)

- **백탕 3색 구분도** — 나란히 두면 구분되지만 지도에 흩어지면 시오 백탕(`#DBD0BA`)과 미소 백탕(`#D9B6A6`)이 거의 같은 색으로 읽힌다. 현재 유일한 단서는 stroke. Phase 2에서 **실기기 검수** 후 필요 시 fill 조정.

### 결정 로그

- **탭 구성 → 3탭** (지도 · 내 기록 · 프로필). "라멘" 탭은 지도 홈의 칩 필터와 역할이 겹쳐 제외.
  라멘 상세는 탭이 아니라 `/ramens/[id]` push 라우트로. 스탬프·순례는 기록 탭 하위 세그먼트.
- **영업시간 → 원문 유지 + 구조화 병행.** `businessHoursRaw` 는 항상,
  `breakStart`/`breakEnd` 는 파싱 가능할 때만. 판정은 서버가 `openState` 로 내려줌.
  인스타 자동 수집은 불가(공식 API가 제3자 계정 스토리를 제공하지 않음) → 유저 제보 + 링크아웃.
  상세는 `docs/api-contract.md`.
  
---

## 🗂 데이터 모델

> **핵심 설계**: `Ramen`(라멘 종류)과 `RamenShop`(가게)은 다대다(N:M) 관계이며, 중간 엔티티 `ShopRamen`("어느 가게가 어느 라멘을 판다")으로 연결한다. 가격과 별점은 이 `ShopRamen`에 붙는다.
> **라멘 분류는 단일 카테고리가 아니라 6축**이다. 상세 배경·필터 조립 규칙은 `docs/ramen-classification.md` 참고.

```
User
 ├─ id: Long (PK)
 ├─ email: String (unique)
 ├─ password: String (BCrypt 해시)
 ├─ nickname: String
 ├─ profileImageUrl: String
 └─ createdAt: DateTime
     // 등급(tier)은 최근 7일간 visitedAt 기준 Review 수로 파생 (아래 '라멘 등급' 참고)

Ramen                          // 라멘 종류 카탈로그 (여러 가게가 공유)
 ├─ id: Long (PK)
 ├─ name: String              // 관용명, 표시용. 예: "돈코츠 라멘", "토리파이탄 쇼유"
 ├─ soup: SoupBase?           // PORK, CHICKEN, BEEF, DUCK, SEAFOOD, VEGETABLE, MIXED, ETC (무국물이면 null)
 ├─ clarity: Clarity?         // SEITAN(청탕) / PAITAN(백탕)  (무국물이면 null)
 ├─ temperature: Temperature  // HOT / COLD                    (필수, 기본 HOT)
 ├─ tare: Tare                // SHIO, SHOYU, MISO, SPICY, ETC (필수)
 ├─ form: Form                // RAMEN, TSUKEMEN, MAZESOBA, ABURASOBA, ETC (필수)
 ├─ style: Style?             // JIRO, IEKEI, HAKATA, SAPPORO, TOKYO, ETC (선택)
 └─ description: String
     // 마커 색 = tare × clarity, 마커 형태 = form → API 응답에 그대로 실어 보낸다

RamenShop                      // 가게
 ├─ id: Long (PK)
 ├─ name: String
 ├─ latitude: Double
 ├─ longitude: Double
 ├─ address: String
 ├─ region: String            // 예: "서울 마포구"
 ├─ openingHours: String      // 예: "11:30~22:00 (브레이크 15:00~17:00)"  ※ 구조화 검토 중
 └─ createdAt: DateTime

ShopRamen                      // 중간 엔티티: "이 가게가 파는 이 라멘"
 ├─ id: Long (PK)
 ├─ shop: RamenShop (FK, N:1)
 ├─ ramen: Ramen (FK, N:1)
 ├─ price: int
 └─ menuName: String          // 가게 고유 메뉴명, 예: "특제 돈코츠" — 화면에 별점과 always 함께 노출

Review                         // 별점·인증샷 → "가게의 그 라멘"에 연결
 ├─ id: Long (PK)
 ├─ shopRamen: ShopRamen (FK, N:1)
 ├─ user: User (FK, N:1)
 ├─ rating: int (1~5)
 ├─ comment: String
 ├─ photoUrl: String
 ├─ visitedAt: Date
 ├─ event: Event (FK, N:1, nullable)   // (Stretch) 이벤트 후기용
 └─ createdAt: DateTime

Event                          // (Stretch) 가게 이벤트
 ├─ id: Long (PK)
 ├─ shop: RamenShop (FK, N:1)
 ├─ title: String
 ├─ description: String
 ├─ startDate: Date
 └─ endDate: Date
```

**관계 요약**

- `RamenShop` N : M `Ramen` (중간 엔티티 `ShopRamen`으로 연결)
- `ShopRamen` 1 : N `Review`
- `User` 1 : N `Review`
- `RamenShop` 1 : N `Event` *(Stretch)*
- "가게의 그 라멘" 평균 별점 = 해당 `ShopRamen`의 `Review.rating` 집계
- 취향 분석 = 사용자의 `Review` → `ShopRamen` → `Ramen` 축별 조인·집계
- 라멘 등급 = 사용자의 `Review` 중 **최근 7일(`visitedAt` 기준)** 개수로 파생

**라멘 등급** — 최근 7일 방문 횟수 기준, 프로필 아바타 링(겹 수)으로 표현

| 등급          | 조건(주간 라멘 횟수) | 링 색     |
| ------------- | -------------------- | --------- |
| 라이트 라멘러 | 0 ~ 1                | `#CBB593` |
| 라멘 애호가   | 2 ~ 4                | `#B98B5E` |
| 주간 라멘왕   | 5+                   | `#7A5334` |

> 등급은 "이번 주 상태"라 매주 오르내린다. UI에 기간을 명시한다 — 예: "이번 주 등급 (7.20~7.26)", "등급은 매주 월요일에 다시 계산돼요."

---

## 🔌 API 설계 (초안)

| Method | Endpoint                        | 설명                                         | 인증 |
| ------ | ------------------------------- | -------------------------------------------- | ---- |
| `POST` | `/api/auth/signup`              | 회원가입                                     | ❌    |
| `POST` | `/api/auth/login`               | 로그인 (JWT 발급)                            | ❌    |
| `GET`  | `/api/ramens`                   | 라멘 종류 목록 (6축 값 + 필터 칩 선택지)     | ❌    |
| `GET`  | `/api/ramens/{ramenId}/shops`   | **그 라멘 파는 가게 + 가게별 그 라멘 평점**  | ❌    |
| `GET`  | `/api/shops`                    | 전체 가게 목록 (지역 필터, 취급 라멘 수 포함) | ❌    |
| `GET`  | `/api/shops/{id}`               | 가게 상세 + 취급 라멘 목록(각 평점 포함)     | ❌    |
| `POST` | `/api/shops`                    | 가게 등록                                    | ✅    |
| `POST` | `/api/shops/{id}/ramens`        | 가게에 라멘(메뉴) 추가 → `ShopRamen` 생성    | ✅    |
| `GET`  | `/api/shop-ramens/{id}/reviews` | 특정 "가게의 그 라멘" 리뷰 목록              | ❌    |
| `POST` | `/api/shop-ramens/{id}/reviews` | 리뷰 작성 (사진 업로드, multipart)           | ✅    |
| `GET`  | `/api/me/reviews`               | 내 방문 기록 목록                            | ✅    |
| `GET`  | `/api/me/taste`                 | 내 취향 분석 (종류·지역별 집계)              | ✅    |
| `GET`  | `/api/users/{id}/profile`       | 프로필 + 이번 주 등급(최근 7일 방문 수 기반) | ❌    |
| `GET`  | `/api/shops/{id}/events`        | 가게 이벤트 목록 *(Stretch)*                 | ❌    |
| `POST` | `/api/push/token`               | 기기 푸시 토큰 등록 *(Stretch)*              | ✅    |

**핵심 탐색 쿼리 예시**

```
GET /api/ramens/12/shops?region=마포구&specialistOnly=true&sort=rating
→ ramenId=12(돈코츠)를 파는 마포구 가게 중 '전문점'만 + 각 가게의 돈코츠 평균 별점, 별점 높은 순
```

**응답 형태 예시** (`GET /api/ramens/{ramenId}/shops`)

```jsonc
[
  {
    "shopRamenId": 101,        // 리뷰 작성 시 사용
    "shopId": 5,
    "shopName": "하카타 분코",
    "latitude": 37.5495, "longitude": 126.9138,
    "region": "마포구",
    "menuName": "하카타 돈코츠", // 별점과 항상 함께 노출되는 값
    "price": 10500,
    "avgRating": 4.6,
    "reviewCount": 28,
    "isSpecialist": true,      // 이 가게가 해당 라멘 전문점인지 (노렌 뱃지)
    "tare": "SHIO",            // ↓ 마커 fill/stroke 결정용
    "clarity": "PAITAN",
    "form": "RAMEN",           // 마커 내부 마크 형태 결정용
    "thumbnailUrl": null       // 대표 인증샷 (없으면 줄무늬 플레이스홀더)
  }
]
```

> **설계 규칙**: 마커 색·형태는 축(`tare`/`clarity`/`form`)에서 파생된다. 프런트가 `name` 문자열을 파싱해 색을 고르는 코드는 만들지 않는다.

---

## 🚀 개발 로드맵 (Phase별)

> **개발 방식**: 기능 단위 풀스택(수직 슬라이스). 각 Phase마다 `DB → API → 앱`을 하나로 완성한다.
> 각 Phase는 **🎨 Frontend / ⚙️ Backend** 로 나눠 적는다. 원칙적으로 **백엔드 먼저 → 프런트**지만, 응답 스펙은 화면 시안을 보고 함께 정한다.

### ✅ Phase 0 — 프로젝트 세팅 (로컬)

> MVP(Phase 1~5)까지는 로컬에서 개발하고, 첫 배포는 MVP 완성 후에 한 번에.

**🎨 Frontend**

- [x] Expo (React Native + TypeScript) 앱 초기화
- [x] `tsconfig` — 초기엔 `strict` 느슨하게, 이후 점진적으로 강화
- [x] `GET /api/health` 를 Expo Go 앱에서 호출 성공 확인

**⚙️ Backend**

- [x] Spring Boot (Web, JPA, Security) 백엔드 초기화
- [x] 로컬 PostgreSQL 연결 확인
- [x] `GET /api/health` 더미 엔드포인트

### ✅ Phase 1 — 라멘 · 가게 · 지도

> `Ramen` / `RamenShop` / `ShopRamen` 세 엔티티와 N:M 연관관계를 함께 세운다.

**🎨 Frontend**

- [x] **지도 SDK 결정** — 카카오맵 Web SDK + `react-native-webview` (웹은 `.web.tsx` iframe 분기)
- [x] 가게 데이터를 지도 마커로 표시
- [x] TanStack Query로 fetch·캐싱 / API 응답 타입(`Shop`, `Ramen`) 정의

**⚙️ Backend**

- [x] `Ramen`, `RamenShop`, `ShopRamen` 엔티티 및 리포지토리 작성
- [x] N:M 연관관계 매핑 (중간 엔티티 `ShopRamen` 방식)
- [x] 라멘 6축 분류 적용 (`SoupBase`/`Clarity`/`Temperature`/`Tare`/`Form`/`Style`)
- [x] `GET /api/shops` 구현 + 시드 데이터 삽입 (가게 3곳 × 메뉴 6개)

### ⬜ Phase 1.5 — 디자인 시스템 부트스트랩 *(신규 · 시안 반영)*

> 시안·아이콘 세트가 나왔으므로, Phase 2 화면을 만들기 전에 **토큰·아이콘·앱 셸**을 먼저 깔아둔다. 여기서 미루면 Phase 2~6 내내 색·간격을 화면마다 다시 정하게 된다. 이 Phase는 사실상 프런트 전용이며, 백엔드는 "화면이 필요로 하는 필드"만 맞춰준다.

**🎨 Frontend**

- [x] `app/src/theme/` — `colors.ts` / `typography.ts` / `radius.ts` / `spacing.ts`. 화면 코드에 헥사값 하드코딩 금지
- [x] 나눔스퀘어라운드 **ttf/otf 확보** 후 `expo-font` 로딩 (웹폰트 woff2는 RN에서 사용 불가 — 라이선스 확인 포함)
- [ ] `react-native-svg` 설치 → 아이콘 세트를 `app/src/components/icons/` 컴포넌트로 이식 (`size` / `color` prop, `currentColor` → `stroke={color}`)
- [ ] 공통 프리미티브: `Card`(1.5px border · radius 16 · **그림자 없음**), `Chip`, `Toggle`, `StarRating`, `SectionHeader`, `StripePlaceholder`
- [ ] 앱 셸 — 갈색 헤더 + 하단 탭바. SafeArea까지 `#6A4729` 확장, **바에 라운드 금지**
- [ ] **탭 구성 확정** (시안 4탭 vs 아이콘 3종) → 4탭이면 "라멘" 탭 아이콘 추가 발주
- [ ] 마커 렌더러 `buildMarkerSvg({ tare, clarity, form, size, selected })` — 마커는 RN이 아니라 **WebView 안에서 그려지므로** SVG 문자열을 생성해 주입한다
- [ ] WebView에 토큰을 주입해 **색 정의가 두 벌이 되지 않게** 한다 (theme → injectJavaScript)
- [ ] 카카오맵 기본 마커 → 커스텀 오버레이(중립 마커 `#A89078` + 취급 수 배지)로 교체
- [ ] `docs/design/` 에 시안 HTML 2종 + 프롬프트 커밋, README에서 링크

**⚙️ Backend**

- [ ] `GET /api/shops` 응답에 `ramenCount`(취급 라멘 수) 추가 — 필터 없는 상태의 중립 마커 배지에 필요
- [ ] 라멘 관련 응답에 `tare` / `clarity` / `form` 노출 (마커 색·형태 파생용)
- [ ] `openingHours` 구조화 여부 결정 — 상세 화면이 브레이크타임을 `danger` 색으로 분리 강조해야 함 (`openTime` / `closeTime` / `breakStart` / `breakEnd` 분리 검토)

### ⬜ Phase 2 — 라멘별 탐색 & 필터  ← **시안 ① 지도 홈**

> 이 앱의 핵심 경험. "특정 라멘 선택 → 그 라멘 파는 가게만 지도에".

**⚙️ Backend**

- [ ] `GET /api/ramens` — 6축 값 포함, 칩 목록용 응답(라벨 + 축·값 매핑)
- [ ] 칩 → (축, 값) 매핑 후 **같은 축은 OR / 다른 축은 AND** 로 쿼리 조립 (`docs/ramen-classification.md` 규칙)
- [ ] `GET /api/ramens/{ramenId}/shops` — `region` 필터 + `specialistOnly` + `sort=rating`
- [ ] `isSpecialist` 판정 기준 확정 (그 가게의 `ShopRamen`이 전부 같은 라멘/타래인지)
- [ ] 응답에 `menuName`·`price`·`avgRating`·`reviewCount`·`tare`·`clarity`·`form` 포함
- [ ] 거리("0.4km")를 서버에서 계산할지 클라에서 계산할지 결정 (서버라면 `lat`/`lng` 쿼리 파라미터 추가)

**🎨 Frontend**

- [ ] 라멘 종류 **칩 가로 스크롤** — 칩마다 마커 색 점, 선택 시 크림 솔리드 + 해제 `×`, 오른쪽 칩이 살짝 잘려 보이게(스크롤 가능함을 암시)
- [ ] 선택 상태를 expo-router 파라미터로 관리 (뒤로가기·딥링크로 상태 복원)
- [ ] 마커 색·형태 적용 — 타래×탁도 → fill/stroke, form → 원/둥근 사각/마름모
- [ ] 필터에서 빠진 가게는 **사라지지 않고** 점선 회색 원으로 흐리게 (지도 맥락 유지)
- [ ] 선택 마커 44px + 이름·★평점 라벨 / 비선택 36px + 이름 라벨
- [ ] 지도 오버레이 — 좌상단 "전문점만" 토글(노렌 아이콘, 기본 off), 우상단 내 위치 버튼(위치 핀 아이콘)
- [ ] 하단 **바텀시트** — 드래그 핸들, "돈코츠 라멘 파는 곳 2" + "별점 높은 순" 정렬 라벨
- [ ] 결과 카드 — 인증샷 썸네일 + 가게명 + 거리·지역 + **메뉴 블록**(`#EFE0CC` 면에 "이 메뉴의 별점" 캡션 / "특제 돈코츠 · 10,000원" / ★4.7 (34))
- [ ] 헤더 — 로고 + "라멘 지도" + "가게 검색" 필 버튼 (검색 화면은 시안 없음 → 스텁)
- [ ] **실기기에서 백탕 3색 구분도 검수** → 필요 시 fill 조정 제안

### ⬜ Phase 3 — 인증 (Auth)

> 유저 종속 데이터(리뷰·사진)가 나오기 직전에 추가하여 재작업 방지.

**⚙️ Backend**

- [ ] `User` 엔티티 및 회원가입/로그인 API
- [ ] Spring Security + JWT (토큰 발급·검증 필터), BCrypt 해싱
- [ ] 401/403 응답 포맷 통일 (앱이 만료를 구분해 재로그인 유도할 수 있게)

**🎨 Frontend**

- [ ] 로그인/회원가입 화면 — **시안 없음.** 갈색 헤더 + `Card` + 크림 솔리드 버튼으로 토큰 범위 안에서 구성
- [ ] 폼 입력 컴포넌트 신설 (`TextField` — 1.5px 테두리, 포커스 시 `primary`, 에러 시 `danger`)
- [ ] `expo-secure-store` 토큰 저장 + 요청 헤더 자동 첨부 인터셉터
- [ ] 비로그인 상태에서 "기록 남기기"·"저장"을 눌렀을 때의 흐름 결정 (모달 로그인 유도 권장)

### ⬜ Phase 4 — 라멘별 별점 평가  ← **시안 ② 가게 상세**

> 평점은 "가게의 그 라멘"(`ShopRamen`) 단위로 매겨 가게별 비교가 가능하게.

**⚙️ Backend**

- [ ] `Review` 엔티티 및 `ShopRamen`과의 연관관계(1:N) 매핑
- [ ] 리뷰 등록 API (`POST /api/shop-ramens/{id}/reviews`)
- [ ] `ShopRamen`별 평균 별점·리뷰 수 집계
- [ ] `GET /api/shops/{id}` 상세 응답 확장 — 취급 라멘 목록(각 `avgRating`·`reviewCount`), 태그 문구용 요약("돈코츠 · 미소 2종"), 내 방문 횟수
- [ ] 리뷰 목록 페이징 (`GET /api/shop-ramens/{id}/reviews`)

**🎨 Frontend**

- [ ] 가게 상세 화면 — 갈색 헤더(뒤로가기 원형 버튼 / "저장" 반투명 칩 / "기록 남기기" 크림 솔리드)
- [ ] 가게명 앞 중립 마커 + 취급 수 배지, 태그 칩("돈코츠 · 미소 2종", "방문 3회")
- [ ] 정보 카드 — 주소 / 영업시간, **브레이크타임은 `danger` 색으로 분리 강조**
- [ ] "취급 라멘 N" 섹션 — 카드마다 마커 스와치(색+형태) + 메뉴명 + "가격 · 시오 × 백탕" + 우측 24px 별점 + 리뷰 수
- [ ] `StarRating` — 별 빈/반/꽉 3종 아이콘 사용, 표시용/입력용 모드 분리
- [ ] 같은 가게 안에서도 메뉴별로 별점이 갈리는 게 한눈에 보이도록 (4.6 vs 4.2)
- [ ] 리뷰 작성 화면 — **시안 없음.** 별점 입력 + 코멘트 + 방문일. 사진 첨부는 Phase 5에서 합류
- [ ] 별점이 노출되는 모든 자리에 메뉴명 + "이 메뉴의 별점" 라벨이 함께 읽히는지 점검

### ⬜ Phase 5 — 인증샷 기록

> 가장 복잡한 파트. 카메라 + 파일 업로드 + 외부 스토리지.

**⚙️ Backend**

- [ ] `MultipartFile` 업로드 → S3/Cloudinary 저장, URL만 DB에
- [ ] 업로드 용량·확장자 제한, 리사이즈/썸네일 생성 여부 결정 (지도 카드 썸네일이 작아 원본 그대로는 낭비)
- [ ] `GET /api/me/reviews` — 내 방문 기록 목록

**🎨 Frontend**

- [ ] `expo-camera` / `expo-image-picker` 로 촬영·선택 (카메라 아이콘 사용, 권한 거부 상태 처리)
- [ ] 리뷰 작성 흐름에 사진 첨부 합류 + 업로드 진행 표시
- [ ] 가게 상세 "인증샷" 섹션 — 제목 옆 메뉴 태그 칩 + 리뷰 카드(썸네일 + 닉네임 + ★ + 코멘트 + 방문 날짜)
- [ ] 이미지 로딩 전/실패 시 **줄무늬 플레이스홀더** (스톡 사진 대체 금지)
- [ ] "내 기록" 탭 — 목록 화면 (시안 없음)
- [ ] **빈 상태** — "아직 비어 있는 그릇" 일러스트 + "첫 한 그릇을 기록하면 여기가 채워집니다." + "첫 기록 남기기" 버튼

---

### 🚀 MVP 배포 (Phase 1~5 완료 후 첫 배포)

> 핵심 경험(탐색·필터·인증·라멘별 별점·인증샷)이 완성되면 여기서 **처음으로** 실제 배포한다.

**⚙️ Backend / DevOps**

- [ ] (사전) 백엔드를 한 번 프로덕션 프로파일로 로컬 실행 → 환경 차이 미리 점검
- [ ] Railway(또는 Render) 배포 + 관리형 PostgreSQL 연결
- [ ] 환경변수/시크릿 정리 (DB, JWT 시크릿, 스토리지 키, CORS 허용 출처)
- [ ] (선택) GitHub Actions로 백엔드 CI/CD 구성

**🎨 Frontend**

- [ ] EAS Build 설정(`eas.json`) 및 프리뷰 빌드로 실기기 설치 확인
- [ ] API base URL을 배포된 백엔드로 전환 (`EXPO_PUBLIC_API_BASE_URL`)
- [ ] **카카오 JavaScript SDK 도메인**에 배포 환경 origin 등록 — WebView `baseUrl`과 100% 일치해야 지도가 뜬다
- [ ] 앱 아이콘·스플래시를 디자인 토큰(아이보리/쇼유 브라운)으로 교체 — 현재 Expo 기본값

---

### ⬜ Phase 6 — 취향 분석 & 라멘 등급  ← **시안 ③ 프로필**

**⚙️ Backend**

- [ ] `GET /api/me/taste` — 라멘 종류별 카운트, 지역별 카운트, 가장 자주 간 곳, 전체 기록 그릇 수
- [ ] 응답에 각 항목의 `tare`/`clarity`/`form` 포함 (막대 앞 마커 스와치용)
- [ ] 등급 로직 — 최근 7일 `visitedAt` 방문 수 → 이번 주 등급 파생, **주 시작은 월요일**
- [ ] 응답에 기간 문자열(`7.20~7.26`)과 다음 등급까지 남은 횟수 포함 (문구를 앱에서 계산하지 않게)

**🎨 Frontend**

- [ ] 프로필 화면 — 갈색 상단 바("내 라멘 기록" + 설정)
- [ ] 등급 카드 — 아바타 **등급 링 SVG 3종**(겹 수로 상승), 등급명 24px `#7A5334`, 방문 횟수, 3단 진행 바
- [ ] "이번 주 등급 (7.20~7.26)" 기간 명시 + "2번 더 가면 이번 주 라멘왕. 등급은 매주 월요일에 다시 계산돼요."
- [ ] 취향 리포트 — 라멘 종류별 막대(각 행 앞에 마커 색·형태 스와치), 지역별 타일, "가장 자주 간 곳 · 멘야 산다이메 5회"
- [ ] 차트는 라이브러리 없이 `View` + 토큰으로 구현 (차트 라이브러리 기본 팔레트·그림자가 톤을 깬다)

### ⬜ Phase 7 — 이벤트 & 알림 *(Stretch)*

**⚙️ Backend**

- [ ] `Event` 엔티티 및 가게 이벤트 API, 이벤트 후기(`Review.event`)
- [ ] 기기 푸시 토큰 등록 API + Expo Push 발송

**🎨 Frontend**

- [ ] `expo-notifications` 수신 및 딥링크(알림 → 해당 가게 상세)
- [ ] 가게 상세에 이벤트 섹션 — 새 색을 만들지 말고 `danger` 또는 `primarySoft` 재사용

### ⬜ Phase 8 — 최종 마무리 & 스토어 정식 배포

**🎨 Frontend**

- [ ] 로딩/에러/빈 상태 **전수 점검** (화면마다 3상태가 다 있는지)
- [ ] 시안 대비 검수 — 그림자 0개, 토큰 밖 색 0개, 이모지 아이콘 0개, 바 라운드 0개
- [ ] 접근성 — 터치 타겟 44px 이상, 갈색 바 위 텍스트 대비, 폰트 스케일 대응
- [ ] README에 스크린샷·데모 추가
- [ ] EAS Build로 프로덕션 빌드, (선택) 스토어 제출 또는 Expo 공유 링크

**⚙️ Backend**

- [ ] 에러 응답 포맷 통일, 로깅·헬스체크 정리
- [ ] 시드 데이터 → 실제 데이터 이관 방침 결정

### ⬜ Phase 9 — 사이드 메뉴 & 궁합 분석 *(Stretch)*

> 사이드(교자·차슈덮밥 등)를 기록하고, 리뷰에 함께 먹은 사이드를 곁들여 **가게별 인기 조합**을 집계한다. 신규 테이블 3개만 더하는 additive 변경이라, 리뷰(Phase 4)·집계(Phase 6) 인프라가 갖춰진 뒤 얹기 좋음.

**⚙️ Backend**

- [ ] `SideMenu` / `ShopSide` 엔티티 — `Ramen` / `ShopRamen`과 대칭 구조
- [ ] `ReviewSide` 중간 엔티티 — 리뷰(=메인 방문)에 함께 먹은 사이드 연결
- [ ] 리뷰 작성 API에 `sides` optional 필드 추가 (기존 흐름 비파괴)
- [ ] `ShopRamen` × `ShopSide` 조합 집계 (가게 국소 스코프)

**🎨 Frontend**

- [ ] 리뷰 작성에 사이드 선택 UI 추가 (기존 흐름을 무겁게 만들지 않게 optional 접힘 영역)
- [ ] 가게 상세에 "이 집 인기 조합 TOP N" 섹션
- [ ] 사이드 아이콘 필요 여부 결정 — 필요하면 기존 세트 규격(viewBox 24 · stroke 1.75)으로 발주

---

## 📁 프로젝트 구조

```
ramentaku/
├── app/                      # React Native + Expo (TypeScript)
│   ├── app/                  # expo-router 라우트 (index, shops/[id], profile ...)
│   ├── src/
│   │   ├── api/              # API 호출 함수 + 타입
│   │   ├── components/       # 재사용 컴포넌트 (KakaoMap, Card, Chip, StarRating ...)
│   │   │   └── icons/        # SVG 아이콘 세트 (react-native-svg)
│   │   ├── hooks/            # 커스텀 훅 (useShops, useAuth ...)
│   │   ├── theme/            # 🎨 색·타이포·라운드·간격 토큰 (단일 출처)
│   │   ├── map/              # 마커 SVG 생성 · WebView 주입 스크립트
│   │   └── types/            # 공용 타입 정의
│   ├── assets/fonts/         # 나눔스퀘어라운드 (ttf/otf)
│   ├── app.json              # Expo 설정
│   └── package.json
│
├── backend/                  # Spring Boot
│   └── src/main/java/com/ramentaku/backend
│       ├── domain/           # 엔티티 (+ 6축 enum)
│       ├── repository/       # JPA 리포지토리
│       ├── service/          # 비즈니스 로직
│       ├── controller/       # REST 컨트롤러
│       ├── dto/              # 요청·응답 DTO
│       └── config/           # Security, JWT, DataSeeder
│
└── docs/
    ├── ramen-classification.md   # 라멘 6축 분류 설계
    └── design/
        ├── screens.dc.html       # 화면 시안 3종 + 마커 검수 패널
        ├── icons.dc.html         # SVG 아이콘 세트
        └── screen-design.md      # 시안 재현용 프롬프트 / 아트 디렉션 원문
```

---

## 🎯 Phase별 핵심 학습 포인트

| Phase   | 🎨 앱(Frontend) 학습                        | ⚙️ 백엔드 학습                          |
| ------- | ------------------------------------------ | -------------------------------------- |
| 0       | Expo·TS 설정, 로컬 실행                     | Spring 구조, 로컬 DB                    |
| 1       | 지도 SDK(WebView 임베드), TanStack Query    | 엔티티 설계, **N:M 중간 엔티티 매핑**   |
| **1.5** | **디자인 토큰·SVG 아이콘·앱 셸 설계**       | 화면이 요구하는 필드 역산(응답 스펙)    |
| 2       | 필터 상태·라우팅 파라미터, 커스텀 마커 오버레이 | 다축 faceted 쿼리(축 내 OR / 축 간 AND) |
| 3       | SecureStore 토큰, 인증 헤더, 폼 컴포넌트     | Spring Security, JWT                    |
| 4       | 컴포넌트 설계, 별점 입력·표시, 폼 검증        | 연관관계 집계, `ShopRamen`별 평균        |
| 5       | 카메라·이미지피커, 업로드, 빈 상태 설계       | MultipartFile, 외부 스토리지             |
| 🚀 배포  | EAS 빌드, 실기기 설치, API URL 전환          | 클라우드 배포, 환경변수·시크릿, CI/CD    |
| 6       | SVG 링·막대 차트 직접 구현                   | 집계·통계 쿼리, 주간 파생 로직           |
| 7       | 푸시 알림 수신·딥링크                        | 이벤트 도메인, Expo Push 연동            |

---

## 📌 개발 원칙 메모

- **TypeScript는 처음부터 도입.** `strict`는 느슨하게 시작해 점진적으로 강화한다.
- **한 Phase = 하나의 완결된 수직 슬라이스.** DB부터 화면까지 끝낸 뒤 다음으로.
- **Phase 안에서는 백엔드 → 프런트 순서.** 단, 응답 스펙은 화면 시안을 먼저 보고 정한다. "화면이 필요로 하는 것"을 API가 내려주는 방향이지 그 반대가 아니다.
- **디자인 값의 단일 출처는 `app/src/theme`.** 화면 코드에 헥사값·픽셀 상수를 직접 쓰지 않는다. WebView 안의 지도 코드도 토큰을 주입받는다.
- **그림자·그라디언트·이모지 아이콘·토큰 밖의 색은 쓰지 않는다.** 이 톤에서 제일 먼저 어색해지는 것들이다.
- **별점 옆에는 항상 메뉴명이 붙는다.** 제품의 핵심 주장이 "가게가 아니라 한 그릇"이므로, 이 규칙이 깨지면 앱의 차별점이 사라진다.
- **마커 색은 축(`tare`×`clarity`)에서 파생한다.** 라멘 이름 문자열로 색을 고르는 코드는 만들지 않는다.
- **배포는 MVP(Phase 1~5) 완성 후 첫 진행.** 단, 로컬↔배포 환경 차이(시크릿·CORS·빌드) 리스크를 줄이려 배포 직전 백엔드를 프로덕션 프로파일로 한 번 로컬 실행해 점검한다.
- 인증(Phase 3)은 유저 종속 데이터 등장 직전에 넣어 재작업을 최소화한다.
- **`Ramen`(종류)과 `RamenShop`(가게)은 분리하고 `ShopRamen`으로 연결한다.** 평점은 "가게의 그 라멘"에 붙여 같은 라멘의 가게별 비교를 가능하게 한다.
- **클라이언트는 RN+Expo, 백엔드는 Spring 그대로.** REST API는 클라이언트 무관이라 이후 웹 확장 시에도 재사용된다.
- 이벤트·알림(Phase 7)은 Stretch. 핵심 경험(탐색·별점·인증샷·취향)을 먼저 완성한 뒤 얹는다.
