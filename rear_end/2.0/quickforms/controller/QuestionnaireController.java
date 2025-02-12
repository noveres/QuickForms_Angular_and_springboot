package com.quickforms.controller;

import com.quickforms.entity.Questionnaire;
import com.quickforms.service.QuestionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questionnaires")
@CrossOrigin(origins = "*")
public class QuestionnaireController {

    @Autowired
    private QuestionnaireService questionnaireService;

    @GetMapping
    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireService.getAllQuestionnaires();
    }

    @GetMapping("/{id}")
    public Questionnaire getQuestionnaireById(@PathVariable Long id) {
        return questionnaireService.getQuestionnaireById(id);
    }

    @PostMapping
    public Questionnaire createQuestionnaire(@RequestBody Map<String, Object> data) {
        return questionnaireService.createQuestionnaire(data);
    }

    @PutMapping("/{id}")
    public Questionnaire updateQuestionnaire(
            @PathVariable Long id,
            @RequestBody Map<String, Object> data) {
        return questionnaireService.updateQuestionnaire(id, data);
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteQuestionnaire(@PathVariable Long id) {
//        questionnaireService.deleteQuestionnaire(id);
//        return ResponseEntity.ok().build();
//    }

    @PostMapping("/{id}/publish")
    public Questionnaire publishQuestionnaire(@PathVariable Long id) {
        return questionnaireService.publishQuestionnaire(id);
    }

    @PostMapping("/{id}/close")
    public Questionnaire closeQuestionnaire(@PathVariable Long id) {
        return questionnaireService.closeQuestionnaire(id);
    }

//    @PostMapping("/{id}/copy")
//    public Questionnaire copyQuestionnaire(@PathVariable Long id) {
//        return questionnaireService.copyQuestionnaire(id);
//    }

    @PostMapping("/draft")
    public Questionnaire saveDraft(@RequestBody Map<String, Object> data) {
        return questionnaireService.saveDraft(data);
    }
}
