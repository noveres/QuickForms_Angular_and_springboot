package com.example.quickforms_backend.DAO;

import com.example.quickforms_backend.DTO.QuestionnaireDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "questionnaires")
public class Questionnaire {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "status", insertable = false)
    private String status;

    @Column(name = "description")
    private String description;

    @Column(name = "response_count")
    private Long responseCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @JsonIgnore
    @OneToMany(mappedBy = "questionnaire", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuestionnaireSection> sections;

    public Questionnaire() {}

    public Questionnaire(QuestionnaireDTO dto) {
        this.title = dto.getTitle();
        this.description = dto.getDescription();
        this.sections = dto.getSections().stream()
                .map(QuestionnaireSection::new)
                .collect(Collectors.toList());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getResponseCount() {
        return responseCount;
    }

    public void setResponseCount(Long responseCount) {
        this.responseCount = responseCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<QuestionnaireSection> getSections() {
        return sections;
    }

    public void setSections(List<QuestionnaireSection> sections) {
        this.sections = sections;
    }
}

// Below is the code of /src/main/java/com/example/quickforms_backend/DAO/Questionnaire.java
//    public void setDescription(String description) {
//    }
