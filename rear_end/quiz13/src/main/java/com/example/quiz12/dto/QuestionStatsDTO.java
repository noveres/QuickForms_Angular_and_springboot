package com.example.quiz12.dto;

import com.example.quiz12.entity.QuestionType;
import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
public class QuestionStatsDTO {
    private Long questionId;
    private String label;
    private QuestionType type;
    private int totalAnswers;
    
    // 用於選擇題的選項統計
    private Map<String, Integer> optionCounts = new HashMap<>();
    
    // 用於數值題的統計
    private Double average;
    private Integer min;
    private Integer max;
    
    // 用於文本題的答案列表（可選）
    private Map<String, Integer> textAnswerFrequency = new HashMap<>();
}
