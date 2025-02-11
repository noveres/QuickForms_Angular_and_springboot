package com.example.quickforms_backend.service;

import com.example.quickforms_backend.DTO.QuestionnaireRepository;
import com.example.quickforms_backend.DAO.Questionnaire;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class QuestionnaireService {

    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireRepository.findAll();
    }

    public Questionnaire getQuestionnaireById(Long id) {
        return questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在"));
    }
//
//    public Questionnaire createQuestionnaire(Map<String, Object> data) {
//        Questionnaire questionnaire = new Questionnaire();
//        questionnaire.setTitle((String) data.get("title"));
//        questionnaire.setDescription((String) data.get("description"));
//        return questionnaireRepository.save(questionnaire);
//    }
}
