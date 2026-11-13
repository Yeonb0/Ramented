# API 계약 v2 — 화면이 요구하는 응답

> v2.0 기준. 새 엔드포인트는 구현 전에 여기 먼저 적고 관리자님 확인을 받는다 (phases.md 공통 규칙).
> 원칙 : 파생 값 (영업 상태 · 속성 상태 · 별점 · 필터 판정) 은 서버가 계산한다. 클라는 재계산하지 않는다.
> v1 `docs/api-contract.md` 는 참고만 한다.

상태 : **§ 1 확정 (관리자님 2026-11-13)**

---

## 1. `GET /api/shops` — 지도 데이터 (breadboard N1, Phase 1)

지도 첫 화면 (T1) 과 미리보기 시트 (U8) 가 쓴다. Phase 1은 필터 없음. 필터 파라미터와 "통과 n개"는 Phase 3에서 이 엔드포인트에 더한다.

v1의 같은 경로를 **대체**한다 (v1 데이터는 이관하지 않음).

### 응답

```ts
type MapShop = {
  id: number;
  name: string;               // 지점명을 뺀 가게 이름. 예 : "멘야산다이메"
  branchName: string | null;  // 예 : "홍대점". 없으면 null
  latitude: number;           // WGS84. 공공데이터 좌표 (EPSG:5174) 를 변환한 값
  longitude: number;
  openState: OpenState;
  openStateLabel: string;     // 시트에 그대로 쓰는 한 줄. 예 : "영업 중 · 정기 영업시간 기준"
};

type OpenState = 'OPEN' | 'BREAK' | 'CLOSED' | 'DAY_OFF' | 'UNKNOWN';

// 응답 본문
type Response = MapShop[];  // 30개, 정렬 없음
```

### 필드 근거

| 필드 | 쓰는 자리 | 없으면 |
|---|---|---|
| `id` | 마커 탭 → 시트, Phase 2 가게 상세 이동 | 마커와 가게를 잇지 못함 |
| `name` · `branchName` | 시트 리본 (이름) + 리본 아래 작은 글자 (지점명) | 앱이 이름을 잘라야 함 → 원칙 위반 |
| `latitude` · `longitude` | 마커 위치 | 지도에 못 그림 |
| `openState` | 문구 색 톤 (앱 매핑 : `OPEN` → open, `BREAK` · `CLOSED` · `DAY_OFF` → stop, `UNKNOWN` → unknown) | 색을 못 고름 |
| `openStateLabel` | 시트의 영업 상태 한 줄 | 앱이 문구를 조합해야 함 |

주소 · 인스타 · 카카오 장소 ID · 메뉴는 지도 응답에 넣지 않는다 (Phase 2 가게 상세에서).

### 영업 상태 계산 (N4, Phase 1 = 정기 영업시간만)

서버 시각은 `Asia/Seoul`. 오늘 요일의 정기 영업시간으로 판정한다.

| 상황 | `openState` | `openStateLabel` |
|---|---|---|
| 오늘이 정기 휴무 요일 | `DAY_OFF` | `정기 휴무 · 정기 영업시간 기준` |
| 여는 시각 전 | `CLOSED` | `영업 전 · 정기 영업시간 기준` |
| 영업 시간 안, 브레이크 밖 | `OPEN` | `영업 중 · 정기 영업시간 기준` |
| 브레이크 시간 안 | `BREAK` | `브레이크 · 정기 영업시간 기준` |
| 닫는 시각 이후 | `CLOSED` | `영업 종료 · 정기 영업시간 기준` |
| 정기 영업시간 정보가 없음 | `UNKNOWN` | `모름` |

- 경계 : 여는 시각 · 브레이크 끝 시각은 포함 (그때부터 영업 중), 닫는 시각 · 브레이크 시작 시각은 미포함
- 주문마감 · "재료 소진 시 종료" · 임시 영업시간은 Phase 1에서 판정에 쓰지 않는다 (원문은 보존)
- Phase 6에서 제보가 들어오면 같은 필드에 제보 기반 값이 나온다 (예 : `제보 (인스타에서 봄) · 방금`)

### 오류

| 상황 | 응답 |
|---|---|
| 서버 오류 | `500`. 앱은 U4 "불러오기 실패 + 다시 시도" |

## 2. 저장 구조 (참고 — API 아님)

정기 영업시간은 요일별 행으로 구조화하고 원문을 같이 둔다.

```
ramen_shop       id, name, branch_name (null), latitude, longitude, address (공공데이터),
                 hours_raw (seed-survey 원문), instagram_handle (null), kakao_place_id (null)
shop_hours       shop_id, day_of_week (1 = 월 … 7 = 일, INTEGER), open_time, close_time,
                 break_start (null), break_end (null)
                 → 정기 휴무 요일은 행이 없다. 가게에 행이 하나도 없으면 UNKNOWN
```
