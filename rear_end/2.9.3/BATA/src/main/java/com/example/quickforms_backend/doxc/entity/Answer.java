package com.example.quickforms_backend.doxc.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Entity
@Table(name = "answers")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "questionnaire_id")
    private Long questionnaireId;

    @ElementCollection
    @CollectionTable(name = "answer_values", 
            joinColumns = @JoinColumn(name = "answer_id"))
    @MapKeyColumn(name = "question_id")
    @Column(name = "answer_value")
    private Map<Long, String> answers;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "completed")
    private boolean completed;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;
}
