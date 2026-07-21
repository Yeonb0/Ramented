package com.ramented.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Ramen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 표시용 이름 ex) 돈코츠 라멘, 토리파이탄

    @Enumerated(EnumType.STRING)
    private SoupBase soupBase; // 육수 재료 - 국물 없으면 null

    @Enumerated(EnumType.STRING)
    private Clarity clarity; // 청탕/백탕 - 국물 없으면 null

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Temperature temperature; // HOT/COLD - 항상 존재 (기본 HOT)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tare tare; // 타래 - 항상 존재

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Form form; // 형태 - 항상 존재

    @Enumerated(EnumType.STRING)
    private Style style; // 계보 (지로계/이에케 등) - 대부분 null

    private String description; // 라멘 설명 - null 가능

    public Ramen(String name, SoupBase soupBase, Clarity clarity, Temperature temperature, Tare tare, Form form, Style style, String description) {
        this.name = name;
        this.soupBase = soupBase;
        this.clarity = clarity;
        this.temperature = temperature;
        this.tare = tare;
        this.form = form;
        this.style = style;
        this.description = description;
    }
}