package com.example.quickforms_backend.service;

import com.example.quickforms_backend.DAO.Questionnaire;
import com.example.quickforms_backend.DAO.QuestionnaireResponse;
import com.example.quickforms_backend.DAO.QuestionnaireResponseRepository;
import com.example.quickforms_backend.DTO.QuestionnaireStatisticsDTO;
import com.example.quickforms_backend.DTO.QuestionnaireStatisticsDTO.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestionnaireStatisticsService {

    @Autowired
    private QuestionnaireService questionnaireService;

    @Autowired
    private QuestionnaireResponseRepository responseRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public QuestionnaireStatisticsDTO getQuestionnaireStatistics(Long questionnaireId) {
        // 獲取問卷
        Questionnaire questionnaire = questionnaireService.getQuestionnaireById(questionnaireId);
        
        // 獲取所有回答
        List<QuestionnaireResponse> responses = responseRepository.findByQuestionnaireId(questionnaireId);

        QuestionnaireStatisticsDTO statistics = new QuestionnaireStatisticsDTO();
        
        // 設置問卷信息
        QuestionnaireInfo questionnaireInfo = new QuestionnaireInfo();
        questionnaireInfo.setId(questionnaireId);
        questionnaireInfo.setTitle(questionnaire.getTitle());
        questionnaireInfo.setDescription(questionnaire.getDescription());
        statistics.setQuestionnaire(questionnaireInfo);

        // 設置概覽信息
        StatisticsOverview overview = new StatisticsOverview();
        overview.setTotalResponses(responses.size());
        overview.setCompletedResponses(responses.size()); // 暫時假設所有回答都是完整的
        overview.setAverageCompletionTime(0.0); // 暫時設為0
        if (!responses.isEmpty()) {
            LocalDateTime firstResponse = responses.stream()
                .map(QuestionnaireResponse::getCreatedAt)
                .min(LocalDateTime::compareTo)
                .orElse(null);
            LocalDateTime lastResponse = responses.stream()
                .map(QuestionnaireResponse::getCreatedAt)
                .max(LocalDateTime::compareTo)
                .orElse(null);
            
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            if (firstResponse != null) {
                overview.setStartDate(firstResponse.format(formatter));
            }
            if (lastResponse != null) {
                overview.setEndDate(lastResponse.format(formatter));
            }
        }
        statistics.setOverview(overview);

        // 處理問題統計
        List<QuestionStatistics> questionStatsList = new ArrayList<>();
        questionnaire.getSections().forEach(section -> {
            section.getQuestions().forEach(question -> {
                QuestionStatistics questionStat = new QuestionStatistics();
                questionStat.setId(question.getId());
                questionStat.setLabel(question.getLabel());
                questionStat.setType(question.getType());

                // 收集所有回答
                Map<String, Integer> optionCounts = new HashMap<>();
                List<String> textResponses = new ArrayList<>();

                responses.forEach(response -> {
                    try {
                        List<Map<String, Object>> answers = objectMapper.readValue(
                            response.getAnswers(), 
                            new TypeReference<List<Map<String, Object>>>() {}
                        );

                        // 找到當前問題的答案
                        Optional<Map<String, Object>> answerOpt = answers.stream()
                            .filter(answer -> {
                                Object qId = answer.get("questionId");
                                return qId != null && qId.toString().equals(question.getId().toString());
                            })
                            .findFirst();

                        answerOpt.ifPresent(answer -> {
                            Object answerValue = answer.get("answer");
                            if (answerValue != null) {
                                if (question.getType().equals("text") || 
                                    question.getType().equals("textarea")) {
                                    textResponses.add(answerValue.toString());
                                } else if (question.getType().equals("radio")) {
                                    String option = answerValue.toString();
                                    optionCounts.merge(option, 1, Integer::sum);
                                } else if (question.getType().equals("checkbox")) {
                                    if (answerValue instanceof List) {
                                        @SuppressWarnings("unchecked")
                                        List<String> selectedOptions = (List<String>) answerValue;
                                        selectedOptions.forEach(option -> 
                                            optionCounts.merge(option, 1, Integer::sum)
                                        );
                                    }
                                }
                            }
                        });
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });

                questionStat.setOptionCounts(optionCounts);
                questionStat.setTextResponses(textResponses);
                questionStatsList.add(questionStat);
            });
        });
        statistics.setQuestions(questionStatsList);

        // 設置回答分佈（暫時為空）
        statistics.setResponseDistribution(new HashMap<>());

        return statistics;
    }
}
