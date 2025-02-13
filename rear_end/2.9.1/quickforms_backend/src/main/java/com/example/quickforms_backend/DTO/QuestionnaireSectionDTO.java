package com.example.quickforms_backend.DTO;

import com.example.quickforms_backend.DAO.QuestionnaireSection;

import java.util.List;
import java.util.stream.Collectors;

public class QuestionnaireSectionDTO {
    private String title;
    private String type;
    private List<QuestionnaireQuestionDTO> questions;

    public QuestionnaireSectionDTO() {}

    public QuestionnaireSectionDTO(QuestionnaireSection section) {
        this.title = section.getTitle();
        this.type = section.getType();
        this.questions = section.getQuestions().stream()
                .map(QuestionnaireQuestionDTO::new)
                .collect(Collectors.toList());
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

    public List<QuestionnaireQuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionnaireQuestionDTO> questions) {
        this.questions = questions;
    }
}