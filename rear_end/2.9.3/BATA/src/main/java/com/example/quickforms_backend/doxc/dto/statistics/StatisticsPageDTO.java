package com.example.quickforms_backend.doxc.dto.statistics;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class StatisticsPageDTO {
    private QuestionnaireInfo questionnaire;
    private StatisticsOverview overview;
    private List<QuestionStatistics> questions;
    private Map<String, Integer> responseDistribution;

    @Data
    public static class QuestionnaireInfo {
        private Long id;
        private String title;
        private String description;
    }

    @Data
    public static class StatisticsOverview {
        private int totalResponses;
        private int completedResponses;
        private double averageCompletionTime;
        private String startDate;
        private String endDate;
    }
}
