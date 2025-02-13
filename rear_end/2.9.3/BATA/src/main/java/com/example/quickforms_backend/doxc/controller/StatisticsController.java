package com.example.quickforms_backend.doxc.controller;

import com.example.quickforms_backend.doxc.dto.statistics.StatisticsPageDTO;
import com.example.quickforms_backend.doxc.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping("/questionnaires/{questionnaireId}")
    public ResponseEntity<StatisticsPageDTO> getQuestionnaireStatistics(@PathVariable Long questionnaireId) {
        try {
            StatisticsPageDTO statistics = statisticsService.getQuestionnaireStatistics(questionnaireId);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/questionnaires/{questionnaireId}/export")
    public ResponseEntity<ByteArrayResource> exportStatistics(@PathVariable Long questionnaireId) {
        byte[] excelBytes = statisticsService.exportToExcel(questionnaireId);
        
        ByteArrayResource resource = new ByteArrayResource(excelBytes);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=statistics.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .contentLength(excelBytes.length)
                .body(resource);
    }
}
