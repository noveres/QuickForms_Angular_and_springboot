package com.example.quickforms_backend.doxc.repository;

import com.example.quickforms_backend.doxc.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
    // 基本的 CRUD 操作由 JpaRepository 提供
}
