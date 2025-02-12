package com.quickforms.repository;

import com.quickforms.model.Questionnaire;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionnaireRepository extends MongoRepository<Questionnaire, String> {
    // 可以添加自定義查詢方法
}
