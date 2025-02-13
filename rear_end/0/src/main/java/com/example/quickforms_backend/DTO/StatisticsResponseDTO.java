package com.example.quickforms_backend.DTO;

import lombok.Data;

@Data
public class StatisticsResponseDTO {
    private boolean success;
    private String error;
    private QuestionnaireStatisticsDTO data;
}
