package com.example.quickforms_backend.service;

import com.example.quickforms_backend.DAO.Questionnaire;
import com.example.quickforms_backend.DAO.QuestionnaireResponse;
import com.example.quickforms_backend.DAO.QuestionnaireResponseRepository;
import com.example.quickforms_backend.DTO.QuestionnaireResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuestionnaireResponseService {
    
    @Autowired
    private QuestionnaireResponseRepository responseRepository;
    
    @Autowired
    private QuestionnaireService questionnaireService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public QuestionnaireResponse submitResponse(Long questionnaireId, QuestionnaireResponseDTO responseDTO) {
        Questionnaire questionnaire = questionnaireService.getQuestionnaireById(questionnaireId);
        
        QuestionnaireResponse response = new QuestionnaireResponse();
        response.setQuestionnaire(questionnaire);
        response.setUserAgent(responseDTO.getUserAgent());
        
        try {
            String answersJson = objectMapper.writeValueAsString(responseDTO.getAnswers());
            response.setAnswers(answersJson);
        } catch (Exception e) {
            throw new RuntimeException("Error converting answers to JSON", e);
        }
        
        return responseRepository.save(response);
    }
}
