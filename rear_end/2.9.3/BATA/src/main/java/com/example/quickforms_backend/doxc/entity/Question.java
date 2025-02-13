package com.example.quickforms_backend.doxc.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "questionnaire_id")
    private Long questionnaireId;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String type;  // choice, rating, text

    private String description;

    private Boolean required;

    @Column(name = "order_index")
    private Integer orderIndex;

    // 選擇題選項
    @ElementCollection
    @CollectionTable(
        name = "question_options",
        joinColumns = @JoinColumn(name = "question_id")
    )
    @Column(name = "option_value")
    private List<String> options;

    // 評分題設置
    @Column(name = "min_rating")
    private Integer minRating;

    @Column(name = "max_rating")
    private Integer maxRating;

    @Column(name = "rating_step")
    private Integer ratingStep;

    // 文字題設置
    @Column(name = "min_length")
    private Integer minLength;

    @Column(name = "max_length")
    private Integer maxLength;

    @Column(name = "placeholder")
    private String placeholder;
}
