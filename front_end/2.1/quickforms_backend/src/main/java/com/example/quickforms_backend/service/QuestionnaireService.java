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

}
