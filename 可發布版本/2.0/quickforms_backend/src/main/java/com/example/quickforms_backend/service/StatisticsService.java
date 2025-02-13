package com.example.quickforms_backend.service;

import com.example.quickforms_backend.DTO.QuestionnaireStatisticsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticsService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuestionnaireStatisticsDTO getQuestionnaireStatistics(Long questionnaireId) {
        logger.info("開始獲取問卷統計資料，問卷ID: {}", questionnaireId);
        
        QuestionnaireStatisticsDTO statistics = new QuestionnaireStatisticsDTO();
        Map<Long, QuestionnaireStatisticsDTO.QuestionStatistics> questionStatsMap = new HashMap<>();
        List<QuestionnaireStatisticsDTO.QuestionStatistics> questionStatsList = new ArrayList<>();

        // 獲取問卷的所有問題
        String questionSql = 
            "SELECT q.id, q.label as question_text " +
            "FROM questionnaire_questions q " +
            "JOIN questionnaire_sections s ON q.section_id = s.id " +
            "WHERE s.questionnaire_id = ?";

        jdbcTemplate.query(questionSql, 
            new Object[]{questionnaireId},
            (questionRs, questionRowNum) -> {
                Long questionId = questionRs.getLong("id");
                QuestionnaireStatisticsDTO.QuestionStatistics questionStats = new QuestionnaireStatisticsDTO.QuestionStatistics();
                questionStats.setQuestionId(questionId);
                questionStats.setQuestionText(questionRs.getString("question_text"));
                questionStats.setOptionDistribution(new HashMap<>());
                questionStatsMap.put(questionId, questionStats);
                logger.info("找到問題: ID={}, 文本={}", questionId, questionStats.getQuestionText());
                return null;
            }
        );

        // 從 questionnaire_responses 獲取回應
        String answersSql = 
            "SELECT answers " +
            "FROM questionnaire_responses " +
            "WHERE questionnaire_id = ?";

        // 用於計算總回答數
        AtomicInteger totalResponses = new AtomicInteger(0);

        jdbcTemplate.query(answersSql, 
            new Object[]{questionnaireId},
            (answerRs, answerRowNum) -> {
                String content = answerRs.getString("answers");
                logger.info("處理回應內容: {}", content);
                // 解析 JSON 格式的 answers
                List<String> parsedAnswers = parseAnswers(content);
                if (parsedAnswers != null && !parsedAnswers.isEmpty()) {
                    totalResponses.addAndGet(parsedAnswers.size()); // 累加實際回答數
                }
                return null;
            }
        );

        // 設置總回應數
        statistics.setTotalResponses(totalResponses.get());
        logger.info("問卷總回應數: {}", totalResponses.get());

        // 處理每個問題的統計資料
        for (Map.Entry<Long, QuestionnaireStatisticsDTO.QuestionStatistics> entry : questionStatsMap.entrySet()) {
            Long questionId = entry.getKey();
            QuestionnaireStatisticsDTO.QuestionStatistics questionStats = entry.getValue();
            Map<String, Integer> distribution = new HashMap<>();

            // 從 questionnaire_responses 獲取回應
            jdbcTemplate.query(answersSql, 
                new Object[]{questionnaireId},
                (answerRs, answerRowNum) -> {
                    String content = answerRs.getString("answers");
                    // 解析 JSON 格式的 answers
                    List<String> parsedAnswers = parseAnswers(content);
                    if (parsedAnswers != null && !parsedAnswers.isEmpty()) {
                        int index = questionStatsMap.keySet().stream()
                            .sorted()
                            .collect(Collectors.toList())
                            .indexOf(questionId);
                        if (index >= 0 && index < parsedAnswers.size()) {
                            String answer = parsedAnswers.get(index);
                            if (answer != null) {
                                distribution.merge(answer, 1, Integer::sum);
                            }
                        }
                    }
                    return null;
                }
            );

            questionStats.setOptionDistribution(distribution);
            questionStats.setTotalAnswers(distribution.values().stream().mapToInt(Integer::intValue).sum());
            questionStatsList.add(questionStats);
            logger.info("已處理問題統計，問題ID: {}, 總答案數: {}", questionId, questionStats.getTotalAnswers());
        }

        statistics.setQuestionStatistics(questionStatsList);
        logger.info("問卷統計資料獲取完成，共處理 {} 個問題", questionStatsList.size());
        
        return statistics;
    }

    private List<String> parseAnswers(String content) {
        try {
            JsonNode answersArray = objectMapper.readTree(content);
            List<String> answers = new ArrayList<>();
            for (JsonNode answer : answersArray) {
                answers.add(answer.get("answerValue").asText());
            }
            return answers;
        } catch (Exception e) {
            logger.error("解析答案時發生錯誤: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
