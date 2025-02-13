package com.example.quickforms_backend.controller;

import com.example.quickforms_backend.DAO.QuestionnaireResponse;
import com.example.quickforms_backend.DTO.QuestionnaireResponseDTO;
import com.example.quickforms_backend.service.QuestionnaireResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/responses")
@CrossOrigin(origins = "http://localhost:4200")
public class QuestionnaireResponseController {
    
    @Autowired
    private QuestionnaireResponseService responseService;

    @PostMapping("/questionnaires/{questionnaireId}")
    public ResponseEntity<QuestionnaireResponse> submitResponse(
            @PathVariable Long questionnaireId,
            @RequestBody QuestionnaireResponseDTO responseDTO) {
        QuestionnaireResponse response = responseService.submitResponse(questionnaireId, responseDTO);
        return ResponseEntity.ok(response);
    }
}
