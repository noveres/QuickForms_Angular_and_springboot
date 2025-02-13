package com.example.quickforms_backend.doxc.controller;

import com.example.quickforms_backend.doxc.dto.QuestionnaireResponseDTO;
import com.example.quickforms_backend.doxc.service.ResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/responses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResponseController {
    private final ResponseService responseService;

    @PostMapping("/questionnaires/{questionnaireId}")
    public ResponseEntity<Void> submitResponse(
            @PathVariable Long questionnaireId,
            @RequestBody QuestionnaireResponseDTO response) {
        responseService.saveResponse(questionnaireId, response);
        return ResponseEntity.ok().build();
    }
}
