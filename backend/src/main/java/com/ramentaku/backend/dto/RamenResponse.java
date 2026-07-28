package com.ramentaku.backend.dto;

import com.ramentaku.backend.domain.*;

/**
 * 6축 값을 enum 이름 문자열 그대로 내려보낸다.
 * 프런트 theme.ts 의 markerColors['SHIO_PAITAN'] 같은 키와 직접 대응하므로
 * @JsonValue 로 한글 라벨을 붙이면 안 된다. 한글 라벨은 Phase 2에서 별도 필드로.
 *
 * soupBase / clarity / style 은 null 이 정상값이다.
 *   마제소바·아부라소바 -> 국물이 없으므로 soupBase, clarity 가 null
 *   대부분의 라멘       -> 특정 계보에 속하지 않으므로 style 이 null
 * 임의로 'ETC' 를 채우지 말 것. 프런트가 clarity ?? 'SEITAN' 으로 폴백한다.
 */
public record RamenResponse(
        Long id,
        String name,
        SoupBase soupBase,
        Clarity clarity,
        Temperature temperature,
        Tare tare,
        Form form,
        Style style,
        String description,
        long shopCount     // 이 라멘을 파는 가게 수
) {
    public static RamenResponse from(Ramen ramen, long shopCount) {
        return new RamenResponse(
                ramen.getId(),
                ramen.getName(),
                ramen.getSoupBase(),
                ramen.getClarity(),
                ramen.getTemperature(),
                ramen.getTare(),
                ramen.getForm(),
                ramen.getStyle(),
                ramen.getDescription(),
                shopCount
        );
    }
}