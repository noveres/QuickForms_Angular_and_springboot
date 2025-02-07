package com.example.quiz12.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "answers")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "response_id", nullable = false)
    private Response response;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(columnDefinition = "TEXT")
    private String textValue;  // 用於文本類型的答案

    @ElementCollection
    @CollectionTable(name = "answer_options", 
                    joinColumns = @JoinColumn(name = "answer_id"))
    @Column(name = "option_value")
    private List<String> selectedOptions = new ArrayList<>();  // 用於選擇類型的答案

    @Column
    private Integer numberValue;  // 用於數字類型的答案

    // 根據問題類型返回適當的答案值
    public Object getValue() {
        switch (question.getType()) {
            case TEXT:
            case TEXTAREA:
                return textValue;
            case RADIO:
            case CHECKBOX:
            case SELECT:
                return selectedOptions;
            case NUMBER:
            case RATING:
                return numberValue;
            default:
                return null;
        }
    }
}
