package com.quickforms.service;

import com.quickforms.model.Questionnaire;
import com.quickforms.repository.QuestionnaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class QuestionnaireService {

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireRepository.findAll();
    }

    public Questionnaire getQuestionnaire(String id) {
        return questionnaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Questionnaire not found"));
    }

    @Transactional
    public Questionnaire createQuestionnaire(Questionnaire questionnaire) {
        questionnaire.setId(UUID.randomUUID().toString());
        return questionnaireRepository.save(questionnaire);
    }

    @Transactional
    public Questionnaire updateQuestionnaire(String id, Questionnaire questionnaire) {
        if (!questionnaireRepository.existsById(id)) {
            throw new RuntimeException("Questionnaire not found");
        }
        questionnaire.setId(id);
        return questionnaireRepository.save(questionnaire);
    }

    @Transactional
    public void deleteQuestionnaire(String id) {
        questionnaireRepository.deleteById(id);
    }

    @Transactional
    public Questionnaire publishQuestionnaire(String id) {
        Questionnaire questionnaire = getQuestionnaire(id);
        questionnaire.setStatus("published");
        questionnaire.setPublishedAt(java.time.LocalDateTime.now());
        return questionnaireRepository.save(questionnaire);
    }

    @Transactional
    public Questionnaire unpublishQuestionnaire(String id) {
        Questionnaire questionnaire = getQuestionnaire(id);
        questionnaire.setStatus("draft");
        questionnaire.setPublishedAt(null);
        return questionnaireRepository.save(questionnaire);
    }

    @Transactional
    public String copyQuestionnaire(String id) {
        Questionnaire original = getQuestionnaire(id);
        Questionnaire copy = new Questionnaire();
        // 複製所有相關字段，但重置狀態相關的字段
        copy.setTitle(original.getTitle() + " (複製)");
        copy.setSections(original.getSections());
        copy.setStatus("draft");
        copy.setCreatedAt(java.time.LocalDateTime.now());
        copy.setUpdatedAt(java.time.LocalDateTime.now());
        
        Questionnaire saved = createQuestionnaire(copy);
        return saved.getId();
    }

    public String generateShareLink(String id) {
        // 生成分享連結的邏輯
        return "https://your-domain.com/questionnaires/share/" + id;
    }

    public Map<String, Object> getQuestionnaireStats(String id) {
        // 實現獲取問卷統計數據的邏輯
        return Map.of(
            "labels", List.of("Question 1", "Question 2"),
            "values", List.of(10, 20)
        );
    }

    @Transactional
    public void autoSaveDraft(String id, Questionnaire draft) {
        draft.setId(id);
        draft.setStatus("draft");
        draft.setUpdatedAt(java.time.LocalDateTime.now());
        questionnaireRepository.save(draft);
    }
}
