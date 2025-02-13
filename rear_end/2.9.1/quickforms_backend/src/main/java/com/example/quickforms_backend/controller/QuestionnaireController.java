    package com.example.quickforms_backend.controller;

import com.example.quickforms_backend.DAO.Questionnaire;
import com.example.quickforms_backend.DTO.QuestionnaireDTO;
import com.example.quickforms_backend.service.QuestionnaireService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/questionnaires")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
    RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class QuestionnaireController {

    @Autowired
    private QuestionnaireService questionnaireService;

    @GetMapping
    public List<Questionnaire> getAllQuestionnaires() {
        return questionnaireService.getAllQuestionnaires();
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getQuestionnaireById(@PathVariable Long id) {

        Optional<Questionnaire> questionnaire = Optional.ofNullable(questionnaireService.getQuestionnaireById(id));
        return questionnaire.map(q -> ResponseEntity.ok(new QuestionnaireDTO(q)))
                .orElseGet(() -> ResponseEntity.notFound().build());

//            try {
//                Questionnaire questionnaire = questionnaireService.getQuestionnaireById(id);
//                if (questionnaire == null) {
//                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("問卷 ID " + id + " 不存在");
//                }
//                return ResponseEntity.ok(new QuestionnaireDTO(questionnaire));
//            } catch (Exception e) {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                        .body("發生內部錯誤：" + e.getMessage());
//            }
    }

    @PostMapping
  public Questionnaire createQuestionnaire(@RequestBody QuestionnaireDTO questionnaireDTO) {
      Questionnaire questionnaire = new Questionnaire(questionnaireDTO);
      return questionnaireService.createQuestionnaire(questionnaire);
  }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateQuestionnaire(@PathVariable Long id, @RequestBody QuestionnaireDTO questionnaireDTO) {
        try {
            Questionnaire updatedQuestionnaire = questionnaireService.updateQuestionnaire(id, new Questionnaire(questionnaireDTO));
            return ResponseEntity.ok(new QuestionnaireDTO(updatedQuestionnaire));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> deleteQuestionnaire(@PathVariable Long id) {
        try {
            questionnaireService.deleteQuestionnaire(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

//    @PostMapping
//    public Questionnaire createQuestionnaire(@RequestBody Map<String, Object> data) {
//        return questionnaireService.createQuestionnaire(data);
//    }

    @PostMapping(value = "/{id}/publish")
    public ResponseEntity<?> publishQuestionnaire(@PathVariable Long id) {
        try {
            Questionnaire questionnaire = questionnaireService.getQuestionnaireById(id);
            if (questionnaire == null) {
                return ResponseEntity.notFound().build();
            }
            
            // 只更新狀態，保留其他所有內容
            Questionnaire updatedQuestionnaire = new Questionnaire(questionnaire);
            updatedQuestionnaire.setStatus("PUBLISHED");
            
            // 確保設置正確的關聯關係
            updatedQuestionnaire.getSections().forEach(section -> {
                section.setQuestionnaire(updatedQuestionnaire);
                section.getQuestions().forEach(question -> question.setSection(section));
            });
            
            Questionnaire result = questionnaireService.updateQuestionnaire(id, updatedQuestionnaire);
            return ResponseEntity.ok(new QuestionnaireDTO(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("發布問卷失敗：" + e.getMessage());
        }
    }

    @PostMapping(value = "/{id}/unpublish")
    public ResponseEntity<?> unpublishQuestionnaire(@PathVariable Long id) {
        try {
            Questionnaire questionnaire = questionnaireService.getQuestionnaireById(id);
            if (questionnaire == null) {
                return ResponseEntity.notFound().build();
            }
            
            // 只更新狀態，保留其他所有內容
            Questionnaire updatedQuestionnaire = new Questionnaire(questionnaire);
            updatedQuestionnaire.setStatus("DRAFT");
            
            // 確保設置正確的關聯關係
            updatedQuestionnaire.getSections().forEach(section -> {
                section.setQuestionnaire(updatedQuestionnaire);
                section.getQuestions().forEach(question -> question.setSection(section));
            });
            
            Questionnaire result = questionnaireService.updateQuestionnaire(id, updatedQuestionnaire);
            return ResponseEntity.ok(new QuestionnaireDTO(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("取消發布問卷失敗：" + e.getMessage());
        }
    }
}
