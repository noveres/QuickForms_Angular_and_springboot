package com.example.quickforms_backend.DAO;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "questionnaire_responses")
public class QuestionnaireResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id", nullable = false)
    private Questionnaire questionnaire;

    @Column(name = "answers", columnDefinition = "TEXT")
    private String answers;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
