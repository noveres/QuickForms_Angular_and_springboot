package com.example.quickforms_backend.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionnaireResponseRepository extends JpaRepository<QuestionnaireResponse, Long> {
    List<QuestionnaireResponse> findByQuestionnaireId(Long questionnaireId);
}
