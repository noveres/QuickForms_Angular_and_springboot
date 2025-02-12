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
    questionnaire.getSections().forEach(section -> {
        section.setQuestionnaire(questionnaire);
        section.getQuestions().forEach(question -> question.setSection(section));
    });
    return questionnaireRepository.save(questionnaire);
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
                questionnaire.setTitle(newQuestionnaire.getTitle());
                questionnaire.setDescription(newQuestionnaire.getDescription());
                questionnaire.setSections(newQuestionnaire.getSections());
                questionnaire.getSections().forEach(section -> {
                    section.setQuestionnaire(questionnaire);
                    section.getQuestions().forEach(question -> question.setSection(section));
                });
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
