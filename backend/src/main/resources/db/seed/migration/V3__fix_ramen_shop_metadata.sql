-- ============================================================
--  라멘티드(Ramented) — Phase 1.5 / B-1
--  ramen_shop 메타데이터 컬럼 보정 마이그레이션
--
--  배경
--   RamenShop 엔티티에 kakaoPlaceId / dataSource / verified / closedAt 가
--   추가됐지만, ddl-auto=update 는 데이터가 이미 든 테이블에
--   NOT NULL 컬럼을 붙이지 못하고 WARN 만 남기고 넘어간다.
--   그 결과 "엔티티는 NOT NULL, DB 는 아님" 상태로 어긋나 있다.
--
--   이 스크립트는 컬럼 추가 → 기존 행 채움 → 제약 부여 순으로
--   그 격차를 메운다.
--
--  성격
--   멱등(idempotent). 몇 번을 다시 실행해도 결과가 같다.
--   컬럼이 이미 있으면 건너뛰고, 값이 이미 차 있으면 UPDATE 대상이 0건이다.
--
--  전제
--   ramen_shop 30행 / ramen 20행 / shop_ramen 57행
--   (seed_mapo_ramen_v2.sql 이 적용된 상태)
--
--  실행 위치
--   pgAdmin 4 쿼리 도구. 백엔드는 내려두고 실행할 것.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
--  1. 누락 컬럼 추가
--     타입은 Hibernate 기본 매핑에 맞춘다.
--       String        -> varchar(255)
--       enum(STRING)  -> varchar(255)
--       boolean       -> boolean
--       LocalDateTime -> timestamp(6)
--     일단 nullable 로 붙인다. 값을 채우기 전에 NOT NULL 을 걸면
--     기존 30행 때문에 바로 실패하기 때문이다. (원래 문제의 재현)
-- ------------------------------------------------------------
ALTER TABLE ramen_shop ADD COLUMN IF NOT EXISTS kakao_place_id varchar(255);
ALTER TABLE ramen_shop ADD COLUMN IF NOT EXISTS data_source    varchar(255);
ALTER TABLE ramen_shop ADD COLUMN IF NOT EXISTS verified       boolean;
ALTER TABLE ramen_shop ADD COLUMN IF NOT EXISTS closed_at      timestamp(6);


-- ------------------------------------------------------------
--  2. 기존 행 채우기
--     현재 30행은 전부 시드 데이터이므로 SEED / 미검증으로 표시한다.
--     kakao_place_id 와 closed_at 은 NULL 이 정상이다.
--       kakao_place_id NULL = 아직 카카오 장소와 매칭 안 됨
--       closed_at      NULL = 영업 중
-- ------------------------------------------------------------
UPDATE ramen_shop SET data_source = 'SEED' WHERE data_source IS NULL;
UPDATE ramen_shop SET verified    = false  WHERE verified    IS NULL;


-- ------------------------------------------------------------
--  3. DB 레벨 기본값
--     이게 원래 사고의 진짜 방지책이다.
--     자바 필드 초기화(= DataSource.USER)는 JPA 로 persist 할 때만 먹고
--     순수 SQL INSERT 에는 적용되지 않는다.
--     DEFAULT 를 걸어두면 두 경로 모두 안전해진다.
--
--     기존 행은 SEED, 앞으로 들어올 행은 USER 가 기본이다.
--     (공공데이터 적재 시에는 PUBLIC_DATA 를 명시적으로 넣을 것)
-- ------------------------------------------------------------
ALTER TABLE ramen_shop ALTER COLUMN data_source SET DEFAULT 'USER';
ALTER TABLE ramen_shop ALTER COLUMN verified    SET DEFAULT false;


-- ------------------------------------------------------------
--  4. NOT NULL 제약
--     2번에서 값을 다 채웠으므로 이제 통과한다.
-- ------------------------------------------------------------
ALTER TABLE ramen_shop ALTER COLUMN data_source SET NOT NULL;
ALTER TABLE ramen_shop ALTER COLUMN verified    SET NOT NULL;


-- ------------------------------------------------------------
--  5. kakao_place_id 유니크 인덱스
--     엔티티의 @Column(unique = true) 에 대응한다.
--     Postgres 유니크 인덱스는 NULL 을 서로 다른 값으로 취급하므로
--     "아직 매칭 안 된 가게 30곳"이 전부 NULL 이어도 충돌하지 않는다.
--     여러 소스를 병합할 때 중복 가게를 막는 upsert 키가 된다.
-- ------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS uk_ramen_shop_kakao_place_id
    ON ramen_shop (kakao_place_id);

COMMIT;


-- ============================================================
--  검증 — 아래를 실행해 결과를 확인한다
-- ============================================================

-- 6-1. 스키마: data_source / verified 가 NO(=NOT NULL) 이고 DEFAULT 가 잡혀야 한다
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'ramen_shop'
  AND column_name IN ('kakao_place_id', 'data_source', 'verified', 'closed_at')
ORDER BY column_name;

-- 6-2. 데이터: 30 / 30 / 0 이 나와야 한다
SELECT
  COUNT(*)                                        AS total,        -- 30
  COUNT(*) FILTER (WHERE data_source = 'SEED')    AS seed_rows,    -- 30
  COUNT(*) FILTER (WHERE verified)                AS verified_rows -- 0
FROM ramen_shop;

-- 6-3. 건수 불변 확인: 30 / 20 / 57 그대로여야 한다
SELECT
  (SELECT COUNT(*) FROM ramen_shop) AS shops,
  (SELECT COUNT(*) FROM ramen)      AS ramens,
  (SELECT COUNT(*) FROM shop_ramen) AS links;
