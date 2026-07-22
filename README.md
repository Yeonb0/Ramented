# 🍜 RamenLog — 나만의 라멘 지도 기록 앱 (Mobile)

> 지도 위에서 라멘 가게를 탐색하고, 특정 라멘을 파는 가게를 골라보고, 방문 인증샷과 라멘별 별점으로 나만의 라멘 지도를 완성하는 **모바일 앱**.

*(프로젝트명 `RamenLog`은 "기록(Log)" 컨셉을 반영한 제안입니다. 자유롭게 변경하세요.)*

---

## 📖 프로젝트 소개

라멘 가게를 지도에 시각화하고, 사용자가 직접 방문한 곳을 사진·라멘별 별점과 함께 기록하는 개인 모바일 앱입니다. **React Native + Expo**로 클라이언트를, **Java + Spring Boot**로 REST API 백엔드를 구성합니다. 백엔드는 클라이언트(웹/앱)와 무관하게 동작하므로, 이후 웹 확장 시에도 그대로 재사용할 수 있습니다.

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
- **React Navigation** — 화면 내비게이션
- **TanStack Query** — 서버 상태 관리 / 캐싱 / 로딩·에러 처리
- **지도 SDK** — Phase 1에서 결정 (아래 참고)
- **expo-camera / expo-image-picker** — 인증샷 촬영·선택
- **expo-secure-store** — JWT 토큰 안전 저장
- **expo-notifications** — 푸시 알림 *(Stretch)*

- **카카오맵 Web(JavaScript) SDK** — `react-native-webview`로 임베드 (Phase 1 결정)
- **react-native-webview** — 카카오맵 WebView 컨테이너

- > **지도 SDK 결정 (Phase 1): 카카오맵 Web SDK를 `react-native-webview`로 임베드**
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

## 🗂 데이터 모델 (초안)

> **핵심 설계**: `Ramen`(라멘 종류)과 `RamenShop`(가게)은 다대다(N:M) 관계이며, 중간 엔티티 `ShopRamen`("어느 가게가 어느 라멘을 판다")으로 연결한다. 가격과 별점은 이 `ShopRamen`에 붙는다.

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
 ├─ name: String              // 예: "돈코츠 라멘", "미소 라멘", "츠케멘"
 ├─ category: enum            // TONKOTSU, SHOYU, MISO, SHIO, TSUKEMEN, ETC
 └─ description: String        // 취향 분석·필터 그룹핑에 사용

RamenShop                      // 가게
 ├─ id: Long (PK)
 ├─ name: String
 ├─ latitude: Double
 ├─ longitude: Double
 ├─ address: String
 ├─ region: String            // 예: "서울 마포구"
 └─ createdAt: DateTime

ShopRamen                      // 중간 엔티티: "이 가게가 파는 이 라멘"
 ├─ id: Long (PK)
 ├─ shop: RamenShop (FK, N:1)
 ├─ ramen: Ramen (FK, N:1)
 ├─ price: int
 └─ menuName: String          // (선택) 가게 고유 메뉴명, 예: "특제 돈코츠"

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
- 취향 분석 = 사용자의 `Review` → `ShopRamen` → `Ramen.category` 로 조인·집계
- 라멘 등급 = 사용자의 `Review` 중 **최근 7일(`visitedAt` 기준)** 개수로 파생

**라멘 등급(예시)** — 최근 7일 방문 횟수 기준, 프로필 아바타 링으로 표현

| 등급            | 조건(주간 라멘 횟수) |
| --------------- | -------------------- |
| 🍜 라이트 라멘러 | 0 ~ 1                |
| 🔥 라멘 애호가   | 2 ~ 4                |
| 👑 주간 라멘왕   | 5+                   |

> 등급은 "이번 주 상태"라 매주 오르내린다. UI에 "이번 주 등급"임을 명시하는 걸 권장.

---

## 🔌 API 설계 (초안)

| Method | Endpoint                        | 설명                                         | 인증 |
| ------ | ------------------------------- | -------------------------------------------- | ---- |
| `POST` | `/api/auth/signup`              | 회원가입                                     | ❌    |
| `POST` | `/api/auth/login`               | 로그인 (JWT 발급)                            | ❌    |
| `GET`  | `/api/ramens`                   | 라멘 종류 목록 (category 포함, 필터 선택지)  | ❌    |
| `GET`  | `/api/ramens/{ramenId}/shops`   | **그 라멘 파는 가게 + 가게별 그 라멘 평점**  | ❌    |
| `GET`  | `/api/shops`                    | 전체 가게 목록 (지역 필터 지원)              | ❌    |
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
GET /api/ramens/12/shops?region=마포구&specialistOnly=true
→ ramenId=12(예: 돈코츠)를 파는 마포구 가게 중 '전문점'만 + 각 가게의 돈코츠 평균 별점
```

**응답 형태 예시** (`GET /api/ramens/{ramenId}/shops`)

```jsonc
[
  {
    "shopRamenId": 101,      // 리뷰 작성 시 사용
    "shopId": 5,
    "shopName": "멘야 A",
    "latitude": 37.55, "longitude": 126.92,
    "price": 12000,
    "avgRating": 4.8,
    "reviewCount": 23,
    "isSpecialist": true     // 이 가게가 해당 라멘 전문점인지
  }
]
```

---

## 🚀 개발 로드맵 (Phase별)

> **개발 방식**: 기능 단위 풀스택(수직 슬라이스). 각 Phase마다 `DB → API → 앱`을 하나로 완성한다.

### ⬜ Phase 0 — 프로젝트 세팅 (로컬)  ← 여기서 시작

> MVP(Phase 1~5)까지는 로컬에서 개발하고, 첫 배포는 MVP 완성 후에 한 번에. (아래 'MVP 배포' 참고)

- [x] Expo (React Native + TypeScript) 앱 초기화
- [x] Spring Boot (Web, JPA, Security) 백엔드 초기화
- [x] `tsconfig` — 초기엔 `strict` 느슨하게, 이후 점진적으로 강화
- [x] 로컬 PostgreSQL 연결 확인
- [x] `GET /api/health` 더미 엔드포인트 → Expo Go 앱에서 호출 성공 확인

### ⬜ Phase 1 — 라멘 · 가게 · 지도

> `Ramen`(+category) / `RamenShop` / `ShopRamen` 세 엔티티와 N:M 연관관계를 함께 세운다.

- [x] `Ramen`, `RamenShop`, `ShopRamen` 엔티티 및 리포지토리 작성
- [x] N:M 연관관계 매핑 (중간 엔티티 `ShopRamen` 방식)
- [x] `GET /api/shops` 구현 (라멘·가게·ShopRamen 시드 데이터 삽입)
- [x] **지도 SDK 결정** 및 연동 (react-native-maps / 네이버 / 카카오 WebView)
- [ ] 가게 데이터를 지도 마커로 표시
- [ ] TanStack Query로 fetch·캐싱 / API 응답 타입(`Shop`, `Ramen`) 정의

### ⬜ Phase 2 — 라멘별 탐색 & 필터

> 이 앱의 핵심 경험. "특정 라멘 선택 → 그 라멘 파는 가게만 지도에".

- [ ] `GET /api/ramens` (category 포함)
- [ ] `GET /api/ramens/{ramenId}/shops` (지역 필터 + `specialistOnly` 옵션)
- [ ] 앱 라멘 선택 UI (칩/드롭다운) 및 마커 갱신
- [ ] 전문점 필터 토글 (옵션)
- [ ] 선택 상태를 내비게이션 파라미터로 관리

### ⬜ Phase 3 — 인증 (Auth)

> 유저 종속 데이터(리뷰·사진)가 나오기 직전에 추가하여 재작업 방지.

- [ ] `User` 엔티티 및 회원가입/로그인 API
- [ ] Spring Security + JWT (토큰 발급·검증 필터), BCrypt 해싱
- [ ] 앱 로그인/회원가입 화면
- [ ] `expo-secure-store`로 토큰 저장 + 요청 헤더 자동 첨부

### ⬜ Phase 4 — 라멘별 별점 평가

> 평점은 "가게의 그 라멘"(`ShopRamen`) 단위로 매겨 가게별 비교가 가능하게.

- [ ] `Review` 엔티티 및 `ShopRamen`과의 연관관계(1:N) 매핑
- [ ] 리뷰 등록 API (`POST /api/shop-ramens/{id}/reviews`)
- [ ] `ShopRamen`별 평균 별점 집계 로직
- [ ] 앱 별점 입력·표시 컴포넌트 및 가게 상세 화면

### ⬜ Phase 5 — 인증샷 기록

> 가장 복잡한 파트. 카메라 + 파일 업로드 + 외부 스토리지.

- [ ] `expo-camera` / `expo-image-picker`로 사진 촬영·선택
- [ ] 백엔드 `MultipartFile` 업로드 → S3/Cloudinary 저장, URL만 DB에
- [ ] 리뷰 작성 시 사진 첨부 흐름 완성
- [ ] `GET /api/me/reviews` — 나만의 방문 기록 화면

---

### 🚀 MVP 배포 (Phase 1~5 완료 후 첫 배포)

> 핵심 경험(탐색·필터·인증·라멘별 별점·인증샷)이 완성되면 여기서 **처음으로** 실제 배포한다. 이후 Phase는 이 파이프라인 위에 얹기만 하면 된다.

- [ ] (사전) 백엔드를 한 번 프로덕션 프로파일로 로컬 실행 → 환경 차이 미리 점검
- [ ] 백엔드 Railway(또는 Render) 배포 + 관리형 PostgreSQL 연결
- [ ] 환경변수/시크릿 정리 (DB, JWT 시크릿, 스토리지 키, CORS 허용 출처)
- [ ] EAS Build 설정(`eas.json`) 및 프리뷰 빌드로 실기기 설치 확인
- [ ] 앱의 API base URL을 배포된 백엔드로 전환
- [ ] (선택) GitHub Actions로 백엔드 CI/CD 구성

---

### ⬜ Phase 6 — 취향 분석 & 라멘 등급

- [ ] `GET /api/me/taste` — 종류·지역별 집계(조인 쿼리)
- [ ] 등급 로직 (최근 7일 `visitedAt` 방문 수 → 이번 주 등급 파생)
- [ ] 취향 리포트 화면
- [ ] 프로필 아바타 등급 링 컴포넌트

### ⬜ Phase 7 — 이벤트 & 알림 *(Stretch)*

- [ ] `Event` 엔티티 및 가게 이벤트 API, 이벤트 후기(`Review.event`)
- [ ] 기기 푸시 토큰 등록 API
- [ ] `expo-notifications` + Expo Push로 이벤트 알림 발송

### ⬜ Phase 8 — 최종 마무리 & 스토어 정식 배포

> 'MVP 배포'에서 이미 파이프라인은 살아 있으므로, 여기선 다듬기와 정식 제출에 집중.

- [ ] 로딩/에러 UX 및 화면 전환 정리
- [ ] README에 스크린샷·데모 추가
- [ ] EAS Build로 프로덕션 빌드, (선택) 스토어 제출 또는 Expo 공유 링크

### ⬜ Phase 9 — 사이드 메뉴 & 궁합 분석 *(Stretch)*

> 사이드(교자·차슈덮밥 등)를 기록하고, 리뷰에 함께 먹은 사이드를 곁들여 **가게별 인기 조합**을 집계한다. 신규 테이블 3개만 더하는 additive 변경이라, 리뷰(Phase 4)·집계(Phase 6) 인프라가 갖춰진 뒤 얹기 좋음. 세부(사이드 별점 분리·조합 입력 UX)는 착수 시점에 결정.

- [ ] `SideMenu` / `ShopSide` 엔티티 — `Ramen` / `ShopRamen`과 대칭 구조
- [ ] `ReviewSide` 중간 엔티티 — 리뷰(=메인 방문)에 함께 먹은 사이드 연결
- [ ] 리뷰 작성 API에 `sides` optional 필드 추가 (기존 흐름 비파괴)
- [ ] 가게 상세에 "이 집 인기 조합 TOP N" 섹션 (`ShopRamen`×`ShopSide` 집계, 가게 국소 스코프)

---

## 📁 프로젝트 구조 (제안)

```
ramenlog/
├── app/                      # React Native + Expo (TypeScript)
│   ├── src/
│   │   ├── api/              # API 호출 함수 + 타입
│   │   ├── components/       # 재사용 컴포넌트 (Map, StarRating, ProfileRing ...)
│   │   ├── hooks/            # 커스텀 훅 (useShops, useAuth ...)
│   │   ├── screens/          # 화면 단위 (Home, ShopDetail, Profile ...)
│   │   ├── navigation/       # React Navigation 설정
│   │   └── types/           # 공용 타입 정의
│   ├── app.json             # Expo 설정
│   └── package.json
│
└── backend/                  # Spring Boot
    ├── src/main/java/com/ramenlog/backend
    │   ├── domain/          # 엔티티
    │   ├── repository/      # JPA 리포지토리
    │   ├── service/         # 비즈니스 로직
    │   ├── controller/      # REST 컨트롤러
    │   ├── dto/             # 요청·응답 DTO
    │   └── config/          # Security, JWT 등 설정
    └── build.gradle
```

---

## 🎯 Phase별 핵심 학습 포인트

| Phase  | 앱(Frontend) 학습                   | 백엔드 학습                           |
| ------ | ----------------------------------- | ------------------------------------- |
| 0      | Expo·TS 설정, 로컬 실행             | Spring 구조, 로컬 DB                  |
| 1      | 지도 SDK, TanStack Query            | 엔티티 설계, **N:M 중간 엔티티 매핑** |
| 2      | 라멘 선택 상태, 내비게이션 파라미터 | 중간 엔티티 기준 조회, 조인 쿼리      |
| 3      | SecureStore 토큰, 인증 헤더         | Spring Security, JWT                  |
| 4      | 컴포넌트 설계, 폼 검증              | 연관관계 집계, `ShopRamen`별 평균     |
| 5      | 카메라·이미지피커, 업로드           | MultipartFile, 외부 스토리지          |
| 🚀 배포 | EAS 빌드, 실기기 설치, API URL 전환 | 클라우드 배포, 환경변수·시크릿, CI/CD |
| 6      | 차트/시각화, 커스텀 링 UI           | 집계·통계 쿼리, 파생 로직             |
| 7      | 푸시 알림 수신                      | 이벤트 도메인, Expo Push 연동         |

---

## 📌 개발 원칙 메모

- **TypeScript는 처음부터 도입.** `strict`는 느슨하게 시작해 점진적으로 강화한다.
- **한 Phase = 하나의 완결된 수직 슬라이스.** DB부터 화면까지 끝낸 뒤 다음으로.
- **배포는 MVP(Phase 1~5) 완성 후 첫 진행.** 초반 DevOps 부담을 줄이고 핵심 학습에 집중한다. 단, "첫 배포를 마지막에 몰아서" 할 때의 리스크(로컬↔배포 환경 차이: 시크릿·CORS·빌드)를 줄이기 위해, 배포 직전 백엔드를 한 번 프로덕션 프로파일로 로컬 실행해 점검한다.
- 인증(Phase 3)은 유저 종속 데이터 등장 직전에 넣어 재작업을 최소화한다.
- **`Ramen`(종류)과 `RamenShop`(가게)은 분리하고 `ShopRamen`으로 연결한다.** 평점은 "가게의 그 라멘"에 붙여 같은 라멘의 가게별 비교를 가능하게 한다.
- **클라이언트는 RN+Expo, 백엔드는 Spring 그대로.** REST API는 클라이언트 무관이라 이후 웹 확장 시에도 재사용된다.
- 이벤트·알림(Phase 7)은 Stretch. 핵심 경험(탐색·별점·인증샷·취향)을 먼저 완성한 뒤 얹는다.