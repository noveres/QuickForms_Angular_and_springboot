package com.example.quickforms_backend.controller;

import com.example.quickforms_backend.DTO.QuestionnaireStatisticsDTO;
import com.example.quickforms_backend.DTO.StatisticsResponseDTO;
import com.example.quickforms_backend.service.QuestionnaireStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:8585"})
public class QuestionnaireStatisticsController {

    @Autowired
    private QuestionnaireStatisticsService statisticsService;

    @GetMapping("/questionnaires/{questionnaireId}")
    public ResponseEntity<StatisticsResponseDTO> getQuestionnaireStatistics(
            @PathVariable Long questionnaireId) {
        try {
            QuestionnaireStatisticsDTO statistics = statisticsService.getQuestionnaireStatistics(questionnaireId);
            
            StatisticsResponseDTO response = new StatisticsResponseDTO();
            response.setSuccess(true);
            response.setData(statistics);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            StatisticsResponseDTO response = new StatisticsResponseDTO();
            response.setSuccess(false);
            response.setError(e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
