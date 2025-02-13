package com.example.quickforms_backend.DTO;

import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
public class QuestionnaireResponseDTO {
    private List<Map<String, Object>> answers;
    private String userAgent;
}
