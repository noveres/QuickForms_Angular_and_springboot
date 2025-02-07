package com.example.quiz12.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class ResponseDTO {
    private Long id;
    private Long questionnaireId;
    private String respondentId;
    private List<AnswerDTO> answers = new ArrayList<>();
    private LocalDateTime submittedAt;
}
