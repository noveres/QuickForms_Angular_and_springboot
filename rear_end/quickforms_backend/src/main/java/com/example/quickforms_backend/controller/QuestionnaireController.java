package com.example.quickforms_backend.controller;


import com.example.quickforms_backend.DAO.Questionnaire;
import com.example.quickforms_backend.service.QuestionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
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

//    @PostMapping
//    public Questionnaire createQuestionnaire(@RequestBody Map<String, Object> data) {
//        return questionnaireService.createQuestionnaire(data);
//    }

}
