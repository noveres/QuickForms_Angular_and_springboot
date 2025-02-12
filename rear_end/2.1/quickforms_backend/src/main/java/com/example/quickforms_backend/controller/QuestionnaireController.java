    package com.example.quickforms_backend.controller;


    import com.example.quickforms_backend.DAO.Questionnaire;
    import com.example.quickforms_backend.DTO.QuestionnaireDTO;
    import com.example.quickforms_backend.service.QuestionnaireService;
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
    @CrossOrigin(origins = "*")
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
        public Questionnaire createQuestionnaire(@RequestBody Questionnaire questionnaire) {
            return questionnaireService.createQuestionnaire(questionnaire);
        }

    //    @PostMapping
    //    public Questionnaire createQuestionnaire(@RequestBody Map<String, Object> data) {
    //        return questionnaireService.createQuestionnaire(data);
    //    }

    }
