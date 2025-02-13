package com.example.quickforms_backend.doxc.service;

import com.example.quickforms_backend.doxc.dto.statistics.StatisticsPageDTO;
import com.example.quickforms_backend.doxc.dto.statistics.QuestionStatistics;
import com.example.quickforms_backend.doxc.entity.QuestionAnswer;
import com.example.quickforms_backend.doxc.entity.Question;
import com.example.quickforms_backend.doxc.entity.Questionnaire;
import com.example.quickforms_backend.doxc.entity.QuestionnaireResponse;
import com.example.quickforms_backend.doxc.repository.QuestionAnswerRepository;
import com.example.quickforms_backend.doxc.repository.QuestionnaireRepository;
import com.example.quickforms_backend.doxc.repository.QuestionnaireResponseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionAnswerRepository questionAnswerRepository;
    private final QuestionnaireResponseRepository responseRepository;
    private final ExcelExportService excelExportService;

    @Transactional(readOnly = true)
    public StatisticsPageDTO getQuestionnaireStatistics(Long questionnaireId) {
        log.info("開始獲取問卷統計數據，問卷ID: {}", questionnaireId);
        
        // 獲取問卷信息
        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId)
                .orElseThrow(() -> new RuntimeException("問卷不存在"));
        log.info("找到問卷: {}", questionnaire.getTitle());

        // 獲取所有回應
        List<QuestionnaireResponse> responses = responseRepository.findByQuestionnaireId(questionnaireId);
        log.info("找到問卷回應數量: {}", responses.size());
        
        // 獲取所有答案
        List<QuestionAnswer> answers = new ArrayList<>();
        for (QuestionnaireResponse response : responses) {
            List<QuestionAnswer> responseAnswers = questionAnswerRepository.findByResponseId(response.getId());
            log.info("回應ID {} 的答案數量: {}", response.getId(), responseAnswers.size());
            answers.addAll(responseAnswers);
        }
        log.info("總答案數量: {}", answers.size());
        
        StatisticsPageDTO statistics = new StatisticsPageDTO();
        
        // 設置問卷信息
        StatisticsPageDTO.QuestionnaireInfo info = new StatisticsPageDTO.QuestionnaireInfo();
        info.setId(questionnaire.getId());
        info.setTitle(questionnaire.getTitle());
        info.setDescription(questionnaire.getDescription());
        statistics.setQuestionnaire(info);
        
        // 設置概覽信息
        StatisticsPageDTO.StatisticsOverview overview = calculateOverview(responses);
        statistics.setOverview(overview);
        log.info("概覽信息: 總回應數 {}, 完成數 {}", overview.getTotalResponses(), overview.getCompletedResponses());
        
        // 設置問題統計
        List<QuestionStatistics> questionStats = calculateQuestionStatistics(questionnaire.getQuestions(), answers);
        statistics.setQuestions(questionStats);
        log.info("問題統計數量: {}", questionStats.size());
        
        // 設置回答時間分布
        Map<String, Integer> timeDistribution = calculateTimeDistribution(responses);
        statistics.setResponseDistribution(timeDistribution);
        log.info("時間分布數據點數量: {}", timeDistribution.size());
        
        return statistics;
    }

    private StatisticsPageDTO.StatisticsOverview calculateOverview(List<QuestionnaireResponse> responses) {
        StatisticsPageDTO.StatisticsOverview overview = new StatisticsPageDTO.StatisticsOverview();
        overview.setTotalResponses(responses.size());
        
        // 計算完成的回應數量（有完成時間的回應）
        long completedCount = responses.stream()
                .filter(r -> r.getCompletedAt() != null)
                .count();
        overview.setCompletedResponses((int) completedCount);
        
        // 計算平均完成時間（秒）
        double avgTime = responses.stream()
                .filter(r -> r.getCompletedAt() != null && r.getStartedAt() != null)
                .mapToDouble(r -> Duration.between(r.getStartedAt(), r.getCompletedAt()).getSeconds())
                .average()
                .orElse(0.0);
        overview.setAverageCompletionTime((int) avgTime);
        
        return overview;
    }

    private List<QuestionStatistics> calculateQuestionStatistics(List<Question> questions, List<QuestionAnswer> answers) {
        return questions.stream().map(question -> {
            QuestionStatistics stats = new QuestionStatistics();
            stats.setId(question.getId());
            stats.setLabel(question.getLabel());
            stats.setType(question.getType());
            
            // 獲取此問題的所有答案
            List<QuestionAnswer> questionAnswers = answers.stream()
                    .filter(a -> a.getQuestionId().equals(question.getId()))
                    .collect(Collectors.toList());
            
            stats.setTotalResponses(questionAnswers.size());
            log.info("問題 {} 的回答數量: {}", question.getLabel(), questionAnswers.size());
            
            // 根據問題類型計算統計信息
            switch (question.getType()) {
                case "radio":
                case "checkbox":
                    Map<String, Integer> choices = new HashMap<>();
                    questionAnswers.forEach(answer -> {
                        String value = answer.getAnswerValue();
                        choices.merge(value, 1, Integer::sum);
                    });
                    stats.setChoices(choices);
                    log.info("選擇題選項分布: {}", choices);
                    break;
                    
                case "rating":
                    Map<String, Integer> ratings = new HashMap<>();
                    questionAnswers.forEach(answer -> {
                        String value = answer.getAnswerValue();
                        ratings.merge(value, 1, Integer::sum);
                    });
                    stats.setRatings(ratings);
                    
                    // 計算平均評分
                    double averageRating = questionAnswers.stream()
                            .mapToInt(a -> Integer.parseInt(a.getAnswerValue()))
                            .average()
                            .orElse(0.0);
                    stats.setAverageRating(averageRating);
                    log.info("評分題平均分: {}", averageRating);
                    break;
                    
                case "text":
                case "long-text":
                    // 文本分析（簡單實現）
                    List<QuestionStatistics.CommonPhrase> phrases = questionAnswers.stream()
                            .map(QuestionAnswer::getAnswerValue)
                            .collect(Collectors.groupingBy(s -> s))
                            .entrySet().stream()
                            .map(e -> {
                                QuestionStatistics.CommonPhrase phrase = new QuestionStatistics.CommonPhrase();
                                phrase.setText(e.getKey());
                                phrase.setCount(e.getValue().size());
                                return phrase;
                            })
                            .collect(Collectors.toList());
                    stats.setCommonPhrases(phrases);
                    log.info("文本題常見短語數量: {}", phrases.size());
                    break;
            }
            
            return stats;
        }).collect(Collectors.toList());
    }

    private Map<String, Integer> calculateTimeDistribution(List<QuestionnaireResponse> responses) {
        return responses.stream()
                .filter(r -> r.getStartedAt() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getStartedAt().toLocalDate().toString(),
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
    }

    @Transactional(readOnly = true)
    public byte[] exportToExcel(Long questionnaireId) {
        return excelExportService.exportStatistics(questionnaireId);
    }
}
