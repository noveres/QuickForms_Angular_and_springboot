package com.example.quickforms_backend.DTO;

import lombok.Data;
import java.util.*;

@Data
public class QuestionnaireStatisticsDTO {
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

    @Data
    public static class QuestionStatistics {
        private Long id;
        private String label;
        private String type;
        private Map<String, Integer> optionCounts;
        private List<String> textResponses;
    }
}
