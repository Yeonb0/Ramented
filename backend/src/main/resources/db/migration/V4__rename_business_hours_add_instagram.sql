-- ddl-auto=update 는 컬럼 "이름 변경"을 못 한다.
-- Hibernate 가 먼저 뜨면 business_hours_raw 를 빈 컬럼으로 새로 만들어버리므로,
-- 두 컬럼이 공존하는 상태와 그렇지 않은 상태를 모두 처리한다.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'ramen_shop' AND column_name = 'business_hours')
       AND EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'ramen_shop' AND column_name = 'business_hours_raw')
    THEN
        UPDATE ramen_shop
           SET business_hours_raw = business_hours
         WHERE business_hours_raw IS NULL;
        ALTER TABLE ramen_shop DROP COLUMN business_hours;
        RAISE NOTICE '원문 이전 후 business_hours 삭제';

    ELSIF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'ramen_shop' AND column_name = 'business_hours')
    THEN
        ALTER TABLE ramen_shop RENAME COLUMN business_hours TO business_hours_raw;
        RAISE NOTICE '컬럼 개명 완료';

    ELSE
        RAISE NOTICE '이미 정리된 상태';
    END IF;
END $$;

-- 인스타 자동 수집은 불가로 결정됐으므로, 링크아웃용 핸들만 보관한다.
-- '@' 없이 저장한다. 표시할 때 앱이 붙인다.
ALTER TABLE ramen_shop ADD COLUMN IF NOT EXISTS instagram_handle varchar(255);