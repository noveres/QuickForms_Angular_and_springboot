package com.example.quickforms_backend.controller;

import com.example.quickforms_backend.DTO.QuestionnaireStatisticsDTO;
import com.example.quickforms_backend.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:4200")
public class StatisticsController {

    private static final Logger logger = LoggerFactory.getLogger(StatisticsController.class);

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/questionnaire/{id}")
    public ResponseEntity<?> getQuestionnaireStatistics(@PathVariable("id") Long questionnaireId) {
        try {
            logger.info("接收到統計請求，問卷ID: {}", questionnaireId);
            QuestionnaireStatisticsDTO statistics = statisticsService.getQuestionnaireStatistics(questionnaireId);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            logger.error("處理統計請求時發生錯誤，問卷ID: {}", questionnaireId, e);
            return ResponseEntity
                .status(500)
                .body(new ErrorResponse("獲取統計資料失敗: " + e.getMessage()));
        }
    }
}

class ErrorResponse {
    private String message;

    public ErrorResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
