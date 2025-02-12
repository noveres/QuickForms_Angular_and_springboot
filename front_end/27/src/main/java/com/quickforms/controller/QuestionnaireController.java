package com.quickforms.controller;

import com.quickforms.model.Questionnaire;
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

    // 獲取所有問卷
    @GetMapping
    public ResponseEntity<List<Questionnaire>> getAllQuestionnaires() {
        return ResponseEntity.ok(questionnaireService.getAllQuestionnaires());
    }

    // 根據ID獲取問卷
    @GetMapping("/{id}")
    public ResponseEntity<Questionnaire> getQuestionnaire(@PathVariable String id) {
        return ResponseEntity.ok(questionnaireService.getQuestionnaire(id));
    }

    // 創建新問卷
    @PostMapping
    public ResponseEntity<Questionnaire> createQuestionnaire(@RequestBody Questionnaire questionnaire) {
        return ResponseEntity.ok(questionnaireService.createQuestionnaire(questionnaire));
    }

    // 更新問卷
    @PutMapping("/{id}")
    public ResponseEntity<Questionnaire> updateQuestionnaire(
            @PathVariable String id,
            @RequestBody Questionnaire questionnaire) {
        return ResponseEntity.ok(questionnaireService.updateQuestionnaire(id, questionnaire));
    }

    // 刪除問卷
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestionnaire(@PathVariable String id) {
        questionnaireService.deleteQuestionnaire(id);
        return ResponseEntity.ok().build();
    }

    // 發布問卷
    @PostMapping("/{id}/publish")
    public ResponseEntity<Questionnaire> publishQuestionnaire(@PathVariable String id) {
        return ResponseEntity.ok(questionnaireService.publishQuestionnaire(id));
    }

    // 取消發布問卷
    @PostMapping("/{id}/unpublish")
    public ResponseEntity<Questionnaire> unpublishQuestionnaire(@PathVariable String id) {
        return ResponseEntity.ok(questionnaireService.unpublishQuestionnaire(id));
    }

    // 複製問卷
    @PostMapping("/{id}/copy")
    public ResponseEntity<Map<String, String>> copyQuestionnaire(@PathVariable String id) {
        String newId = questionnaireService.copyQuestionnaire(id);
        return ResponseEntity.ok(Map.of("id", newId));
    }

    // 獲取分享連結
    @PostMapping("/{id}/share")
    public ResponseEntity<Map<String, String>> getShareLink(@PathVariable String id) {
        String link = questionnaireService.generateShareLink(id);
        return ResponseEntity.ok(Map.of("link", link));
    }

    // 獲取統計數據
    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getStats(@PathVariable String id) {
        return ResponseEntity.ok(questionnaireService.getQuestionnaireStats(id));
    }

    // 自動保存草稿
    @PostMapping("/{id}/auto-save")
    public ResponseEntity<Void> autoSaveDraft(
            @PathVariable String id,
            @RequestBody Questionnaire draft) {
        questionnaireService.autoSaveDraft(id, draft);
        return ResponseEntity.ok().build();
    }
}
