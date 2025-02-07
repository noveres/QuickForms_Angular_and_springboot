package com.example.quiz12.controller;

import com.example.quiz12.dto.QuestionnaireDTO;
import com.example.quiz12.service.QuestionnaireService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/questionnaires")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;

    @GetMapping
    public ResponseEntity<Page<QuestionnaireDTO>> getAllQuestionnaires(Pageable pageable) {
        return ResponseEntity.ok(questionnaireService.getAllQuestionnaires(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionnaireDTO> getQuestionnaireById(@PathVariable Long id) {
        return ResponseEntity.ok(questionnaireService.getQuestionnaireById(id));
    }

    @PostMapping
    public ResponseEntity<QuestionnaireDTO> createQuestionnaire(
            @Valid @RequestBody QuestionnaireDTO questionnaireDTO) {
        return ResponseEntity.ok(questionnaireService.createQuestionnaire(questionnaireDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionnaireDTO> updateQuestionnaire(
            @PathVariable Long id,
            @Valid @RequestBody QuestionnaireDTO questionnaireDTO) {
        return ResponseEntity.ok(questionnaireService.updateQuestionnaire(id, questionnaireDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestionnaire(@PathVariable Long id) {
        questionnaireService.deleteQuestionnaire(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/publish")
    public ResponseEntity<QuestionnaireDTO> publishQuestionnaire(@PathVariable Long id) {
        return ResponseEntity.ok(questionnaireService.publishQuestionnaire(id));
    }

    @PutMapping("/{id}/unpublish")
    public ResponseEntity<QuestionnaireDTO> unpublishQuestionnaire(@PathVariable Long id) {
        return ResponseEntity.ok(questionnaireService.unpublishQuestionnaire(id));
    }
}
