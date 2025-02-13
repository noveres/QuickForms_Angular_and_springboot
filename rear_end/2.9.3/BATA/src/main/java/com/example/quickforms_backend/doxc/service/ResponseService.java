package com.example.quickforms_backend.doxc.service;

import com.example.quickforms_backend.doxc.dto.QuestionnaireResponseDTO;
import com.example.quickforms_backend.doxc.entity.QuestionnaireResponse;
import com.example.quickforms_backend.doxc.entity.QuestionAnswer;
import com.example.quickforms_backend.doxc.repository.QuestionnaireResponseRepository;
import com.example.quickforms_backend.doxc.repository.QuestionAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResponseService {
    private final QuestionnaireResponseRepository responseRepository;
    private final QuestionAnswerRepository answerRepository;

    @Transactional
    public void saveResponse(Long questionnaireId, QuestionnaireResponseDTO dto) {
        // 創建問卷回應記錄
        QuestionnaireResponse response = new QuestionnaireResponse();
        response.setQuestionnaireId(questionnaireId);
        response.setRespondentId(dto.getRespondentId() != null ? 
            dto.getRespondentId() : UUID.randomUUID().toString());
        response.setStartedAt(LocalDateTime.now());
        response.setCompletedAt(LocalDateTime.now());
        response.setIpAddress(dto.getIpAddress());
        response.setUserAgent(dto.getUserAgent());
        
        QuestionnaireResponse savedResponse = responseRepository.save(response);

        // 保存每個問題的答案
        dto.getAnswers().forEach(answerDto -> {
            QuestionAnswer answer = new QuestionAnswer();
            answer.setResponseId(savedResponse.getId());
            answer.setQuestionId(answerDto.getQuestionId());
            answer.setAnswerValue(answerDto.getAnswerValue());
            answer.setCreatedAt(LocalDateTime.now());
            answerRepository.save(answer);
        });
    }
}
