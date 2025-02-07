package com.example.quiz12.dto;

import com.example.quiz12.entity.QuestionnaireStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class QuestionnaireDTO {
    private Long id;
    private String title;
    private String description;
    private QuestionnaireStatus status;
    private List<SectionDTO> sections = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}
