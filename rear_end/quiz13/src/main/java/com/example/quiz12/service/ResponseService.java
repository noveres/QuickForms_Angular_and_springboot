package com.example.quiz12.service;

import com.example.quiz12.dto.ResponseDTO;
import com.example.quiz12.dto.QuestionnaireStatsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResponseService {
    
    /**
     * 提交問卷答案
     */
    ResponseDTO submitResponse(ResponseDTO responseDTO);
    
    /**
     * 獲取問卷的所有回答（分頁）
     */
    Page<ResponseDTO> getResponsesByQuestionnaireId(Long questionnaireId, Pageable pageable);
    
    /**
     * 獲取問卷統計信息
     */
    QuestionnaireStatsDTO getQuestionnaireStats(Long questionnaireId);
    
    /**
     * 獲取單個回答
     */
    ResponseDTO getResponseById(Long responseId);
    
    /**
     * 刪除回答
     */
    void deleteResponse(Long responseId);
}
