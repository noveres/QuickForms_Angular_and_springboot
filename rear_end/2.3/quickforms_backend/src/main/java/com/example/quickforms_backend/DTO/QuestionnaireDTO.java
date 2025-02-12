package com.example.quickforms_backend.DTO;

import com.example.quickforms_backend.DAO.Questionnaire;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.*;
import java.util.stream.Collectors;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // 確保 null 不影響 JSON 輸出
public class QuestionnaireDTO {
    private Long id;
    private String title;
    private String description;
    private String status;
    private List<QuestionnaireSectionDTO> sections;

    public QuestionnaireDTO() {}

    public QuestionnaireDTO(Questionnaire questionnaire) {
        this.id = questionnaire.getId();
        this.title = questionnaire.getTitle() != null ? questionnaire.getTitle() : "未提供標題";
        this.description = questionnaire.getDescription() != null ? questionnaire.getDescription() : "未提供描述";
        this.status = questionnaire.getStatus();
        this.sections = Optional.ofNullable(questionnaire.getSections())
                .orElse(Collections.emptyList()) // 確保 sections 不是 null
                .stream()
                .filter(Objects::nonNull) // 過濾 null 值
                .map(QuestionnaireSectionDTO::new)
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

    public List<QuestionnaireSectionDTO> getSections() {
        return sections;
    }

    public void setSections(List<QuestionnaireSectionDTO> sections) {
        this.sections = sections;
    }
}