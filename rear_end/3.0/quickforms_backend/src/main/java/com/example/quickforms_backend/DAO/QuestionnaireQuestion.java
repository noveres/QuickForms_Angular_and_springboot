package com.example.quickforms_backend.DAO;

import com.example.quickforms_backend.DTO.QuestionnaireQuestionDTO;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "questionnaire_questions")
@Data
public class QuestionnaireQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "label", nullable = false)
    private String label;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "required", nullable = false)
    private boolean required;

    // 此字段将附加配置选项存储为数据库中的 JSON 字符串
    // 使用 MapToJsonStringConverter 将 Map 转换为 JSON 字符串以存储在数据库中
    @Convert(converter = com.example.quickforms_backend.converter.MapToJsonStringConverter.class)
    @Column(name = "options", columnDefinition = "TEXT")
    private Map<String, Object> options;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private QuestionnaireSection section;
//
//    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
//    private List<QuestionnaireOption> questionOptions;

    public QuestionnaireQuestion() {
    }

    public QuestionnaireQuestion(QuestionnaireQuestionDTO dto) {
        this.label = dto.getLabel();
        this.type = dto.getType();
        this.required = dto.isRequired();
        this.options = dto.getOptions();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public QuestionnaireSection getSection() {
        return section;
    }

    public void setSection(QuestionnaireSection section) {
        this.section = section;
    }
}