package com.quickforms.service;

import com.quickforms.entity.Questionnaire;
import com.quickforms.repository.QuestionnaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionnaireService {
    
    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireRepository.findAll();
    }

    public Optional<Questionnaire> getQuestionnaireById(Long id) {
        return questionnaireRepository.findById(id);
    }

    public Questionnaire createQuestionnaire(Questionnaire questionnaire) {
        return questionnaireRepository.save(questionnaire);
    }

    public Questionnaire updateQuestionnaire(Long id, Questionnaire questionnaire) {
        if (questionnaireRepository.existsById(id)) {
            questionnaire.setId(id);
            return questionnaireRepository.save(questionnaire);
        }
        return null;
    }

    public void deleteQuestionnaire(Long id) {
        questionnaireRepository.deleteById(id);
    }
}
