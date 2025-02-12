package com.quickforms.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickforms.entity.Questionnaire;
import com.quickforms.repository.QuestionnaireRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class QuestionnaireService {

    public static final String STATUS_DRAFT = "DRAFT";
    public static final String STATUS_PUBLISHED = "PUBLISHED";
    public static final String STATUS_CLOSED = "CLOSED";


    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireRepository.findAll();
    }

    public Questionnaire getQuestionnaireById(Long id) {
        return questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在"));
    }

    @Transactional
    public Long createQuestionnaire(Questionnaire questionnaire) {
        questionnaire = questionnaireRepository.save(questionnaire);
        return questionnaire.getId();
    }

    @Transactional
    public Questionnaire createQuestionnaire(Map<String, Object> data) {
        try {
            Questionnaire questionnaire = new Questionnaire();
            questionnaire.setTitle((String) data.get("title"));
            questionnaire.setDescription((String) data.get("description"));
            questionnaire.setStatus(QuestionnaireStatus.DRAFT.toString());

            // 將表單內容轉換為 JSON 字符串
            String jsonContent = objectMapper.writeValueAsString(data.get("content"));
            questionnaire.setContent(jsonContent);

            return questionnaireRepository.save(questionnaire);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON處理錯誤", e);
        }
    }

    @Transactional
    public Questionnaire updateQuestionnaire(Long id, Questionnaire questionnaire) {
        if (!questionnaireRepository.existsById(id)) {
            throw new EntityNotFoundException("問卷不存在");
        }
        questionnaire.setId(id);
        return questionnaireRepository.save(questionnaire);
    }

    @Transactional
    public Questionnaire updateQuestionnaire(Long id, Map<String, Object> data) {
        try {
            Questionnaire questionnaire = getQuestionnaireById(id);

            if (data.containsKey("title")) {
                questionnaire.setTitle((String) data.get("title"));
            }

            if (data.containsKey("description")) {
                questionnaire.setDescription((String) data.get("description"));
            }

            if (data.containsKey("content")) {
                String jsonContent = objectMapper.writeValueAsString(data.get("content"));
                questionnaire.setContent(jsonContent);
            }

            return questionnaireRepository.save(questionnaire);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON處理錯誤", e);
        }
    }

    @Transactional
    public void deleteQuestionnaireById(Long id) {
        if (!questionnaireRepository.existsById(id)) {
            throw new EntityNotFoundException("問卷不存在");
        }
        questionnaireRepository.deleteById(id);
    }

    @Transactional
    public Questionnaire publishQuestionnaire(Long id) {
        Questionnaire questionnaire = getQuestionnaireById(id);
        questionnaire.setStatus(QuestionnaireStatus.PUBLISHED);
        return questionnaireRepository.save(questionnaire);
    }

    @Transactional
    public Questionnaire closeQuestionnaire(Long id) {
        Questionnaire questionnaire = getQuestionnaireById(id);
        questionnaire.setStatus(QuestionnaireStatus.CLOSED);
        return questionnaireRepository.save(questionnaire);
    }

    @Transactional
    public Long copyQuestionnaire(Long id) {
        Questionnaire original = getQuestionnaireById(id);
        Questionnaire copy = new Questionnaire();
        copy.setTitle(original.getTitle() + " (複製)");
        copy.setDescription(original.getDescription());
        copy.setStatus(QuestionnaireStatus.DRAFT);
        copy.setResponseCount(0);
        copy = questionnaireRepository.save(copy);
        return copy.getId();
    }

    @Transactional
    public Questionnaire saveDraft(Map<String, Object> data) {
        try {
            Long id = data.containsKey("id") ? ((Number) data.get("id")).longValue() : null;
            Questionnaire questionnaire = id != null ? getQuestionnaireById(id) : new Questionnaire();

            questionnaire.setTitle((String) data.get("title"));
            questionnaire.setDescription((String) data.get("description"));
            questionnaire.setStatus(QuestionnaireStatus.DRAFT.toString());

            String jsonContent = objectMapper.writeValueAsString(data.get("content"));
            questionnaire.setContent(jsonContent);

            return questionnaireRepository.save(questionnaire);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON處理錯誤", e);
        }
    }

    public Map<String, Object> getQuestionnaireStats(Long id) {
        Questionnaire questionnaire = getQuestionnaireById(id);
        return Map.of(
                "totalResponses", questionnaire.getResponseCount(),
                "completionRate", calculateCompletionRate(questionnaire),
                "averageTime", calculateAverageTime(questionnaire)
        );
    }

    private double calculateCompletionRate(Questionnaire questionnaire) {
        // TODO: 實現完成率計算邏輯
        return 0.0;
    }

    private int calculateAverageTime(Questionnaire questionnaire) {
        // TODO: 實現平均完成時間計算邏輯
        return 0;
    }
}
