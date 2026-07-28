package com.ramentaku.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RamenShop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 가게 이름

    @Column(unique = true)
    private String kakaoPlaceId; // 카카오맵 장소 ID (nullable)

    @Enumerated(EnumType.STRING) 
    @Column(nullable = false)
    @ColumnDefault("'USER'")
    private DataSource dataSource = DataSource.USER; // SEED / PUBLIC_DATA / USER
    
    @Column(nullable = false)
    @ColumnDefault("false")
    private boolean verified = false;

    private LocalDateTime closedAt; // null = 영업중
    
    private Double latitude;
    private Double longitude;
    private String address;
    private String region; 
    private String description;
    private String businessHoursRaw;
    private String instagramHandle;

    public RamenShop(String name, Double latitude, Double longitude, String address, String region, String businessHoursRaw, String description) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.region = region;
        this.businessHoursRaw = businessHoursRaw;
        this.description = description;
    }
}
