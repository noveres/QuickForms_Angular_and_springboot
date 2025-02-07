package com.example.quiz12.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class QuestionnaireStatsDTO {
    private Long questionnaireId;
    private String title;
    private int totalResponses;
    private List<QuestionStatsDTO> questionStats = new ArrayList<>();
}
