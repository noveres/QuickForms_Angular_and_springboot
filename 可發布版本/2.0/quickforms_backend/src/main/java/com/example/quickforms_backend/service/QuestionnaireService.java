package com.example.quickforms_backend.service;

import com.example.quickforms_backend.DTO.QuestionnaireRepository;
import com.example.quickforms_backend.DAO.Questionnaire;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class QuestionnaireService {

    @Autowired
    private QuestionnaireRepository questionnaireRepository;


    // 查詢所有問卷
    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireRepository.findAll();
    }

    // 新增問卷
    public Questionnaire createQuestionnaire(Questionnaire questionnaire) {
        try {
            if (questionnaire == null) {
                throw new IllegalArgumentException("問卷不能為空");
            }
            
            // 設置問卷的基本屬性
            if (questionnaire.getStatus() == null) {
                questionnaire.setStatus("DRAFT");
            }
            
            // 設置關聯關係
            if (questionnaire.getSections() != null) {
                questionnaire.getSections().forEach(section -> {
                    if (section != null) {
                        section.setQuestionnaire(questionnaire);
                        if (section.getQuestions() != null) {
                            section.getQuestions().forEach(question -> {
                                if (question != null) {
                                    question.setSection(section);
                                }
                            });
                        }
                    }
                });
            }
            
            return questionnaireRepository.save(questionnaire);
        } catch (Exception e) {
            throw new RuntimeException("創建問卷失敗: " + e.getMessage(), e);
        }
    }

    //
//    public Questionnaire getQuestionnaireById(Long id) {
//        return questionnaireRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("問卷不存在"));
//    }
    public Questionnaire getQuestionnaireById(Long id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id).orElse(null);
        if (questionnaire != null) {
            Hibernate.initialize(questionnaire.getSections()); // 強制載入 sections
        }
        return questionnaire;
    }

    // 更新問卷
    public Questionnaire updateQuestionnaire(Long id, Questionnaire newQuestionnaire) {
        return questionnaireRepository.findById(id)
                .map(questionnaire -> {
                    // 更新基本信息
                    questionnaire.setTitle(newQuestionnaire.getTitle());
                    questionnaire.setDescription(newQuestionnaire.getDescription());
                    questionnaire.setStatus(newQuestionnaire.getStatus());
                    
                    // 清除所有現有的區塊
                    questionnaire.getSections().clear();
                    questionnaireRepository.flush();  // 立即執行刪除操作
                    
                    // 創建新的區塊和問題
                    if (newQuestionnaire.getSections() != null) {
                        newQuestionnaire.getSections().forEach(section -> {
                            section.setQuestionnaire(questionnaire);
                            if (section.getQuestions() != null) {
                                section.getQuestions().forEach(question -> {
                                    question.setSection(section);
                                });
                            }
                        });
                        questionnaire.getSections().addAll(newQuestionnaire.getSections());
                    }
                    
                    return questionnaireRepository.save(questionnaire);
                })
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在"));
    }

    // 刪除問卷
    public void deleteQuestionnaire(Long id) {
        if (!questionnaireRepository.existsById(id)) {
            throw new EntityNotFoundException("問卷不存在");
        }
        questionnaireRepository.deleteById(id);
    }

}
