package com.example.quiz12.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class AnswerDTO {
    private Long questionId;
    private String textValue;
    private List<String> selectedOptions = new ArrayList<>();
    private Integer numberValue;
}
