package com.ramented.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RamenShop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 가게 이름

    private Double latitude;
    private Double longitude;
    private String address;
    private String region; 
    private String businessHours;
    private String description;

    public RamenShop(String name, Double latitude, Double longitude, String address, String region, String businessHours, String description) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.region = region;
        this.businessHours = businessHours;
        this.description = description;
    }
}
