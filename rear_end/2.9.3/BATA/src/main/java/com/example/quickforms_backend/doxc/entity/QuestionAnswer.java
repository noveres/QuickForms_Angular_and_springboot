package com.example.quickforms_backend.doxc.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "question_answers")
public class QuestionAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "response_id")
    private Long responseId;

    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "answer_value")
    private String answerValue;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
