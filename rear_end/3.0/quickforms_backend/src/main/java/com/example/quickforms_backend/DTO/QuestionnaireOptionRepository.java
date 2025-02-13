package com.example.quickforms_backend.DTO;


import com.example.quickforms_backend.DAO.QuestionnaireOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionnaireOptionRepository extends JpaRepository<QuestionnaireOption, Long> {
    @Query("SELECT q FROM QuestionnaireOption q WHERE q.question.id = :questionId")
    List<QuestionnaireOption> findByQuestionnaireQuestionId(@Param("questionId") Long questionId);
}
