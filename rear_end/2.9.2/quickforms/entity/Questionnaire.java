package com.quickforms.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Entity
@Table(name = "questionnaires")
public class Questionnaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> content;

    @Column(nullable = false)
    private String status = "DRAFT";

    @Column(name = "response_count")
    private Integer responseCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
