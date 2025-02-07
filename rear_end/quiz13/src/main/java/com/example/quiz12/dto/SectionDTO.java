package com.example.quiz12.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class SectionDTO {
    private Long id;
    private String title;
    private Integer orderIndex;
    private List<QuestionDTO> questions = new ArrayList<>();
}
