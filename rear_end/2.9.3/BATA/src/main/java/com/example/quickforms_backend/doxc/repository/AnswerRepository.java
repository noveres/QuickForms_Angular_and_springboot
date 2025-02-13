package com.example.quickforms_backend.doxc.repository;

import com.example.quickforms_backend.doxc.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionnaireId(Long questionnaireId);
    
    long countByQuestionnaireIdAndCompleted(Long questionnaireId, boolean completed);
}
