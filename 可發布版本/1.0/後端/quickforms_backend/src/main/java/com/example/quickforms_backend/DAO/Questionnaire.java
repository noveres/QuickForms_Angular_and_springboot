package com.example.quickforms_backend.DAO;

import com.example.quickforms_backend.DTO.QuestionnaireDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Column(name = "status", nullable = false)
    private String status = "DRAFT";  // 設置默認值

    @Column(name = "description")
    private String description;

    @Column(name = "response_count")
    private Long responseCount = 0L;  // 設置默認值

    @Column(name = "published")
    private Boolean published = false;  // 設置默認值為 false

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "DRAFT";
        }
        if (responseCount == null) {
            responseCount = 0L;
        }
        if (published == null) {
            published = false;
        }
    }

    @JsonIgnore
    @OneToMany(mappedBy = "questionnaire", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<QuestionnaireSection> sections;

    public Questionnaire() {
        this.sections = new ArrayList<>();
    }

    public Questionnaire(QuestionnaireDTO dto) {
        this.title = dto.getTitle();
        this.description = dto.getDescription();
        this.sections = dto.getSections().stream()
                .map(sectionDTO -> {
                    QuestionnaireSection section = new QuestionnaireSection(sectionDTO);
                    section.setQuestionnaire(this);
                    return section;
                })
                .collect(Collectors.toList());
    }

    public Questionnaire(Questionnaire other) {
        this.id = other.getId();
        this.title = other.getTitle();
        this.description = other.getDescription();
        this.status = other.getStatus();
        this.responseCount = other.getResponseCount();
        this.published = other.getPublished();
        this.createdAt = other.getCreatedAt();
        
        // 深度複製 sections
        if (other.getSections() != null) {
            this.sections = other.getSections().stream()
                    .map(section -> {
                        QuestionnaireSection newSection = new QuestionnaireSection();
                        newSection.setTitle(section.getTitle());
                        newSection.setType(section.getType());
                        newSection.setQuestionnaire(this);
                        
                        // 複製問題
                        if (section.getQuestions() != null) {
                            List<QuestionnaireQuestion> newQuestions = section.getQuestions().stream()
                                    .map(q -> {
                                        QuestionnaireQuestion newQuestion = new QuestionnaireQuestion();
                                        newQuestion.setLabel(q.getLabel());
                                        newQuestion.setType(q.getType());
                                        newQuestion.setRequired(q.isRequired());
                                        newQuestion.setOptions(q.getOptions());
                                        newQuestion.setSection(newSection);
                                        return newQuestion;
                                    })
                                    .collect(Collectors.toList());
                            newSection.setQuestions(newQuestions);
                        }
                        
                        return newSection;
                    })
                    .collect(Collectors.toList());
        } else {
            this.sections = new ArrayList<>();
        }
    }

    // Getters and setters
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getResponseCount() {
        return responseCount;
    }

    public void setResponseCount(Long responseCount) {
        this.responseCount = responseCount;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
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
