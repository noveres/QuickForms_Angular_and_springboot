package com.example.quickforms_backend.doxc.service;

import com.example.quickforms_backend.doxc.dto.statistics.QuestionStatistics;
import com.example.quickforms_backend.doxc.dto.statistics.StatisticsPageDTO;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExcelExportService {
    private final StatisticsService statisticsService;

    public byte[] exportStatistics(Long questionnaireId) {
        StatisticsPageDTO statistics = statisticsService.getQuestionnaireStatistics(questionnaireId);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            // 創建概覽表
            createOverviewSheet(workbook, statistics);
            
            // 創建問題統計表
            createQuestionsSheet(workbook, statistics.getQuestions());
            
            // 導出為字節數組
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
            
        } catch (IOException e) {
            throw new RuntimeException("導出Excel失敗", e);
        }
    }

    private void createOverviewSheet(Workbook workbook, StatisticsPageDTO statistics) {
        Sheet sheet = workbook.createSheet("問卷概覽");
        
        // 創建標題樣式
        CellStyle headerStyle = createHeaderStyle(workbook);
        
        // 添加問卷信息
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("問卷標題");
        titleCell.setCellStyle(headerStyle);
        titleRow.createCell(1).setCellValue(statistics.getQuestionnaire().getTitle());
        
        Row descRow = sheet.createRow(1);
        Cell descCell = descRow.createCell(0);
        descCell.setCellValue("問卷描述");
        descCell.setCellStyle(headerStyle);
        descRow.createCell(1).setCellValue(statistics.getQuestionnaire().getDescription());
        
        // 添加統計概覽
        Row statsRow = sheet.createRow(3);
        Cell statsCell = statsRow.createCell(0);
        statsCell.setCellValue("統計概覽");
        statsCell.setCellStyle(headerStyle);
        
        Row totalRow = sheet.createRow(4);
        totalRow.createCell(0).setCellValue("總回答數");
        totalRow.createCell(1).setCellValue(statistics.getOverview().getTotalResponses());
        
        Row completedRow = sheet.createRow(5);
        completedRow.createCell(0).setCellValue("完成率");
        double completionRate = (double) statistics.getOverview().getCompletedResponses() 
                / statistics.getOverview().getTotalResponses() * 100;
        completedRow.createCell(1).setCellValue(String.format("%.2f%%", completionRate));
        
        Row timeRow = sheet.createRow(6);
        timeRow.createCell(0).setCellValue("平均完成時間");
        timeRow.createCell(1).setCellValue(
                String.format("%.2f分鐘", statistics.getOverview().getAverageCompletionTime() / 60));
        
        // 自動調整列寬
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private void createQuestionsSheet(Workbook workbook, List<QuestionStatistics> questions) {
        Sheet sheet = workbook.createSheet("問題統計");
        CellStyle headerStyle = createHeaderStyle(workbook);
        
        int rowNum = 0;
        for (QuestionStatistics question : questions) {
            // 問題標題
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(question.getLabel());
            titleCell.setCellStyle(headerStyle);
            
            // 問題類型和回答數
            Row infoRow = sheet.createRow(rowNum++);
            infoRow.createCell(0).setCellValue("類型");
            infoRow.createCell(1).setCellValue(getQuestionTypeText(question.getType()));
            infoRow.createCell(2).setCellValue("回答數");
            infoRow.createCell(3).setCellValue(question.getTotalResponses());
            
            // 根據問題類型添加具體統計
            switch (question.getType()) {
                case "choice":
                    rowNum = addChoiceStatistics(sheet, rowNum, question.getChoices());
                    break;
                case "rating":
                    rowNum = addRatingStatistics(sheet, rowNum, question.getRatings(), 
                            question.getAverageRating());
                    break;
                case "text":
                    rowNum = addTextStatistics(sheet, rowNum, question.getCommonPhrases());
                    break;
            }
            
            // 添加空行
            rowNum++;
        }
        
        // 自動調整列寬
        for (int i = 0; i < 4; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private int addChoiceStatistics(Sheet sheet, int rowNum, Map<String, Integer> choices) {
        Row headerRow = sheet.createRow(rowNum++);
        headerRow.createCell(0).setCellValue("選項");
        headerRow.createCell(1).setCellValue("次數");
        headerRow.createCell(2).setCellValue("百分比");
        
        int total = choices.values().stream().mapToInt(Integer::intValue).sum();
        
        for (Map.Entry<String, Integer> entry : choices.entrySet()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(entry.getKey());
            row.createCell(1).setCellValue(entry.getValue());
            row.createCell(2).setCellValue(
                    String.format("%.2f%%", (double) entry.getValue() / total * 100));
        }
        
        return rowNum;
    }

    private int addRatingStatistics(Sheet sheet, int rowNum, Map<String, Integer> ratings, 
            Double averageRating) {
        Row avgRow = sheet.createRow(rowNum++);
        avgRow.createCell(0).setCellValue("平均評分");
        avgRow.createCell(1).setCellValue(String.format("%.2f", averageRating));
        
        Row headerRow = sheet.createRow(rowNum++);
        headerRow.createCell(0).setCellValue("評分");
        headerRow.createCell(1).setCellValue("次數");
        
        for (Map.Entry<String, Integer> entry : ratings.entrySet()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(entry.getKey());
            row.createCell(1).setCellValue(entry.getValue());
        }
        
        return rowNum;
    }

    private int addTextStatistics(Sheet sheet, int rowNum, List<QuestionStatistics.CommonPhrase> phrases) {
        Row headerRow = sheet.createRow(rowNum++);
        headerRow.createCell(0).setCellValue("常見回答");
        headerRow.createCell(1).setCellValue("出現次數");
        
        for (QuestionStatistics.CommonPhrase phrase : phrases) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(phrase.getText());
            row.createCell(1).setCellValue(phrase.getCount());
        }
        
        return rowNum;
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private String getQuestionTypeText(String type) {
        switch (type) {
            case "choice": return "選擇題";
            case "rating": return "評分題";
            case "text": return "文字題";
            default: return type;
        }
    }
}
