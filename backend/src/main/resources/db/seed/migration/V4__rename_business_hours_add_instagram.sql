BEGIN;

-- ddl-auto=update 는 컬럼 "이름 변경"을 못 한다.
-- 그냥 두면 business_hours_raw 를 새로 만들고 business_hours 는 고아로 남는다.
ALTER TABLE ramen_shop RENAME COLUMN business_hours TO business_hours_raw;

-- 인스타 자동 수집은 불가로 결정됐으므로, 링크아웃용 핸들만 보관한다.
-- '@' 없이 저장한다. 표시할 때 앱이 붙인다.
ALTER TABLE ramen_shop ADD COLUMN IF NOT EXISTS instagram_handle varchar(255);

COMMIT;

-- 검증: business_hours 가 사라지고 business_hours_raw / instagram_handle 이 있어야 한다
SELECT column_name FROM information_schema.columns
WHERE table_name = 'ramen_shop'
  AND column_name IN ('business_hours', 'business_hours_raw', 'instagram_handle');