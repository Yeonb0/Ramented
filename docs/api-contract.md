# API 계약 — 화면이 요구하는 응답 스펙

> Phase 1.5 기준. 전체 API 목록은 README의 「🔌 API 설계」를 보고,
> 이 문서는 **화면 시안을 보고 역산한 필드**와 그 근거만 다룬다.
>
> 원칙: "화면이 필요로 하는 것을 API가 내려준다." 그 반대가 아니다.
> 프런트가 문자열을 파싱하거나 조건을 계산해서 만들어내는 값은 이 문서에 없어야 한다.

---

## 1. `GET /api/shops`

지도 홈에서 **필터가 걸리지 않은 초기 상태**를 그리는 데 쓴다.

### 현재 응답

```ts
type Shop = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  region: string;
  businessHours: string;
  description: string;
};
```

### 목표 응답

```ts
type Shop = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  region: string;

  ramenCount: number;                 // 🔴 Phase 1.5 필수

  businessHoursRaw: string;           // 🟡 businessHours 개명
  breakStart: string | null;          // 🟡 Phase 4
  breakEnd: string | null;            // 🟡 Phase 4

  openState: OpenState;               // 🟢 자리만 · Phase 4에서 채움
  openStateLabel: string;             // 🟢
  openStateSource: OpenStateSource;   // 🟢

  instagramHandle: string | null;     // 🟢 Phase 4

  description: string;
};

type OpenState = 'OPEN' | 'BREAK' | 'CLOSED' | 'UNKNOWN';
type OpenStateSource = 'SCHEDULE' | 'REPORT' | 'OWNER';
```

🔴 Phase 1.5를 막는 것 · 🟡 Phase 4 전까지 · 🟢 지금은 자리만(값은 상수여도 됨)

### 필드별 근거

| 필드 | 쓰이는 자리 | 없으면 |
| --- | --- | --- |
| `ramenCount` | 지도 중립 마커 위 취급 수 배지, 가게 상세 가게명 앞 배지 | 마커를 그릴 수 없음. **Step 6이 여기서 막힌다** |
| `businessHoursRaw` | 가게 상세 정보 카드 (원문 그대로 표시) | — (이름만 바뀜) |
| `breakStart` / `breakEnd` | 가게 상세에서 브레이크타임을 `danger` 색으로 **분리** 강조 | 원문 한 줄로만 표시하고 강조 없음 (허용 가능한 저하) |
| `openState` 계열 | 카드·상세의 영업 상태 배지, "지금 영업중만" 필터 | 상태 표시 불가 |
| `instagramHandle` | 가게 상세 "인스타 확인" 버튼 | 버튼 숨김 |

---

## 2. 라멘 관련 응답 — 6축 값 노출

`GET /api/ramens`, `GET /api/ramens/{ramenId}/shops`, `GET /api/shops/{id}` 의
라멘 항목에 **enum 원문**을 그대로 넣는다.

```ts
tare:    'SHIO' | 'SHOYU' | 'MISO';
clarity: 'PAITAN' | 'SEITAN' | null;   // 무국물이면 null
form:    'RAMEN' | 'TSUKEMEN' | 'MAZESOBA';
```

### 왜 원문 enum인가

마커의 **색은 `tare × clarity`, 내부 마크 형태는 `form`** 에서 파생된다.
`getMarkerStyle(tare, clarity)` 가 프런트의 `theme/marker.ts` 한 곳에서 이걸 결정한다.

서버가 색이나 라벨("시오 × 백탕")을 미리 만들어 내려주면 안 된다.
디자인 토큰이 서버에 복제되어 두 벌이 되고, 색을 바꿀 때 배포가 필요해진다.

반대로 프런트가 `name` 문자열("돈코츠 라멘")을 파싱해 색을 고르는 코드도 만들지 않는다.
이름은 표시용이고, 색의 근거는 축이다.

---

## 3. 영업 상태 — 설계 메모

### 왜 서버에서 계산하는가

- 자정 넘김(`09:00~02:30`), 24시간 영업, 요일별 변동을 클라에서 처리하면 지저분해진다
- 앱 여러 화면(지도 카드 · 가게 상세 · 필터)이 같은 판정을 필요로 한다
- 프로젝트 원칙: 파생 로직을 프런트에 두지 않는다

### 3층 구조

| 층 | 출처 | 갱신 주기 | 도입 |
| --- | --- | --- | --- |
| `RegularHours` | 요일별 open / close / break | 거의 안 바뀜 | Phase 4 |
| `HoursException` | 특정 날짜의 휴무·단축 (오너 입력) | 수시 | Phase 7 |
| `StatusReport` | 유저 제보 (리뷰 작성 시 한 줄) | 방문 시마다 · 24시간 유효 | Phase 4 |

우선순위는 `StatusReport` > `HoursException` > `RegularHours`.
가장 최근의 실제 관측이 이긴다.

### `UNKNOWN` 은 실패값이 아니라 1급 상태다

라멘집은 예고 없이 닫는다. 앱이 "영업중"이라고 단언했다가 헛걸음시키면
그 순간 신뢰를 잃는다. 확신도를 `openStateLabel` 문구에 실어서 내려준다.

```
SCHEDULE → "영업중 (정규 시간 기준)"
REPORT   → "영업중 · 2시간 전 방문 확인"
OWNER    → "오늘 휴무"
```

문구를 앱에서 조립하지 않는다. 서버가 완성된 문자열을 준다.

### 인스타그램 자동 수집은 하지 않는다

Instagram Graph API는 **앱에 권한을 부여한 자기 계정**만 읽을 수 있고,
제3자 계정의 스토리를 가져오는 엔드포인트는 존재하지 않는다.
스토리는 24시간 후 소멸한다. 비공식 스크래핑 API는 약관 위반이고
봇 탐지로 자주 깨진다.

→ 대신 **유저 제보 + 인스타 링크아웃**으로 간다.
   리뷰 = 방문 증거이므로 제보에 신뢰도가 자동으로 붙는다.

---

## 4. 도입 순서

```
Phase 1.5   ramenCount              ← 지금 막고 있는 것
            tare / clarity / form
            businessHours → businessHoursRaw 개명
            openState 계열 필드 자리 (전부 'UNKNOWN' 상수여도 됨)

Phase 4     RegularHours 구조화 → breakStart / breakEnd
            StatusReport (리뷰 폼에 영업 제보 한 줄)
            openState 실제 판정 로직
            instagramHandle

Phase 7     HoursException (오너 모드 · 이벤트 도메인과 같은 구조)
```

---

## 5. 변경 이력

| 날짜 | 내용 |
| --- | --- |
| Phase 1.5 착수 | 최초 작성. 탭 3개 확정, 영업 상태 3층 구조 결정 |
