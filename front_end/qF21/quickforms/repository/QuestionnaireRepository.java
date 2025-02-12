package com.quickforms.repository;

import com.quickforms.entity.Questionnaire;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
    Page<Questionnaire> findByStatus(String status, Pageable pageable);
    List<Questionnaire> findByStatus(String status);
    List<Questionnaire> findByTitleContaining(String title);
    List<Questionnaire> findByTitleContainingAndStatus(String title, String status);
}
