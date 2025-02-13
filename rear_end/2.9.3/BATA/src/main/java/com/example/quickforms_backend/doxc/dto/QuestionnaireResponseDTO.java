package com.example.quickforms_backend.doxc.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionnaireResponseDTO {
    private List<QuestionAnswerDTO> answers;
    private String respondentId;
    private String ipAddress;
    private String userAgent;
}
