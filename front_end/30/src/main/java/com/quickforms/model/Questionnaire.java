package com.quickforms.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "questionnaires")
public class Questionnaire {
    @Id
    private String id;
    private String title;
    private List<Section> sections;
    private String status;  // draft, published
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
}

@Data
class Section {
    private String title;
    private List<Question> questions;
}

@Data
class Question {
    private String type;  // text, choice, rating, etc.
    private String title;
    private List<String> options;
    private boolean required;
    private String description;
}
