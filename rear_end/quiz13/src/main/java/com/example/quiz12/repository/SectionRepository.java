package com.example.quiz12.repository;

import com.example.quiz12.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByQuestionnaireIdOrderByOrderIndexAsc(Long questionnaireId);
}
