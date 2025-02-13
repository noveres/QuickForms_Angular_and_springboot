package com.example.quickforms_backend.DAO;

import com.example.quickforms_backend.DTO.QuestionnaireSectionDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "questionnaire_sections")
@Data
public class QuestionnaireSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "type")
    private String type;

    @ManyToOne
    @JoinColumn(name = "questionnaire_id", nullable = false)
    @JsonBackReference
    private Questionnaire questionnaire;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<QuestionnaireQuestion> questions;


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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public List<QuestionnaireQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionnaireQuestion> questions) {
        this.questions = questions;
    }

    public QuestionnaireSection() {}

    public QuestionnaireSection(QuestionnaireSectionDTO dto) {
        this.title = dto.getTitle();
        this.type = dto.getType();
        this.questions = dto.getQuestions().stream()
                .map(QuestionnaireQuestion::new)
                .collect(Collectors.toList());
    }
}