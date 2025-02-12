package com.example.quickforms_backend.DTO;

import com.example.quickforms_backend.DAO.QuestionnaireQuestion;

import java.util.Map;

public class QuestionnaireQuestionDTO {
    private String label;
    private String type;
    private boolean required;
    private Map<String, Object> options;

    public QuestionnaireQuestionDTO() {}
    public QuestionnaireQuestionDTO(QuestionnaireQuestion question) {
        this.label = question.getLabel();
        this.type = question.getType();
        this.required = question.isRequired();
        this.options = question.getOptions();
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public Map<String, Object> getOptions() {
        return options;
    }

    public void setOptions(Map<String, Object> options) {
        this.options = options;
    }
}
