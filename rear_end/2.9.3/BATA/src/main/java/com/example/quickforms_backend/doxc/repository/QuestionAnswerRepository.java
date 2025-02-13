package com.example.quickforms_backend.doxc.repository;

import com.example.quickforms_backend.doxc.entity.QuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Long> {
    List<QuestionAnswer> findByResponseId(Long responseId);
    List<QuestionAnswer> findByQuestionId(Long questionId);
}
