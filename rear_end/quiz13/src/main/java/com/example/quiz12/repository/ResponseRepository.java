package com.example.quiz12.repository;

import com.example.quiz12.entity.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    Page<Response> findByQuestionnaireId(Long questionnaireId, Pageable pageable);
    List<Response> findByQuestionnaireId(Long questionnaireId);
}
