package com.example.quickforms_backend.doxc.dto.statistics;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class QuestionStatistics {
    private Long id;
    private String label;
    private String type;
    private int totalResponses;
    private Map<String, Integer> choices;
    private Map<String, Integer> ratings;
    private Double averageRating;
    private List<CommonPhrase> commonPhrases;
    private List<WordCloudItem> wordCloud;

    @Data
    public static class CommonPhrase {
        private String text;
        private int count;
    }

    @Data
    public static class WordCloudItem {
        private String text;
        private int weight;
    }
}
