package com.example.quickforms_backend.DTO;

import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
public class QuestionnaireStatisticsDTO {
    private Long questionnaireId;
    private int totalResponses;
    private List<QuestionStatistics> questionStatistics;

    @Data
    public static class QuestionStatistics {
        private Long questionId;
        private String questionText;
        private String questionType;
        private Map<String, Integer> optionDistribution; // 選項及其選擇次數
        private int totalAnswers;
    }
}
