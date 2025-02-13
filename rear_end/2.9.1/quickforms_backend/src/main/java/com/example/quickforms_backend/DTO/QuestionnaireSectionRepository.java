package com.example.quickforms_backend.DTO;


import com.example.quickforms_backend.DAO.QuestionnaireSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionnaireSectionRepository extends JpaRepository<QuestionnaireSection, Long> {
}