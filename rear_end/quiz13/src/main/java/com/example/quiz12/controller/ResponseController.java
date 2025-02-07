package com.example.quiz12.controller;

import com.example.quiz12.dto.ResponseDTO;
import com.example.quiz12.dto.QuestionnaireStatsDTO;
import com.example.quiz12.service.ResponseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/responses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResponseController {

    private final ResponseService responseService;

    @PostMapping
    public ResponseEntity<ResponseDTO> submitResponse(@Valid @RequestBody ResponseDTO responseDTO) {
        return ResponseEntity.ok(responseService.submitResponse(responseDTO));
    }

    @GetMapping("/questionnaire/{questionnaireId}")
    public ResponseEntity<Page<ResponseDTO>> getResponsesByQuestionnaire(
            @PathVariable Long questionnaireId,
            Pageable pageable) {
        return ResponseEntity.ok(responseService.getResponsesByQuestionnaireId(questionnaireId, pageable));
    }

    @GetMapping("/questionnaire/{questionnaireId}/stats")
    public ResponseEntity<QuestionnaireStatsDTO> getQuestionnaireStats(
            @PathVariable Long questionnaireId) {
        return ResponseEntity.ok(responseService.getQuestionnaireStats(questionnaireId));
    }

    @GetMapping("/{responseId}")
    public ResponseEntity<ResponseDTO> getResponseById(@PathVariable Long responseId) {
        return ResponseEntity.ok(responseService.getResponseById(responseId));
    }

    @DeleteMapping("/{responseId}")
    public ResponseEntity<Void> deleteResponse(@PathVariable Long responseId) {
        responseService.deleteResponse(responseId);
        return ResponseEntity.ok().build();
    }
}
