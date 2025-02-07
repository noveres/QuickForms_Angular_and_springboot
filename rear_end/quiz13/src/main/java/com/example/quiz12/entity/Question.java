package com.example.quiz12.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "questions")
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String label;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;
    
    @Column(nullable = false)
    private Boolean required = false;
    
    @Column(nullable = false)
    private Integer orderIndex;
    
    @ElementCollection
    @CollectionTable(name = "question_options", 
        joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    private List<String> options = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private Section section;
    
    // 配置相關
    @Column(columnDefinition = "json")
    private String configuration;  // 存儲為JSON格式的其他配置選項
}
