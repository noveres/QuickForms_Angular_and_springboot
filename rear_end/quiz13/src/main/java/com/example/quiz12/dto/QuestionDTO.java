package com.example.quiz12.dto;

import com.example.quiz12.entity.QuestionType;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class QuestionDTO {
    private Long id;
    private String label;
    private String description;
    private QuestionType type;
    private Boolean required;
    private Integer orderIndex;
    private List<String> options = new ArrayList<>();
    private String configuration;  // JSON格式的配置選項
}
