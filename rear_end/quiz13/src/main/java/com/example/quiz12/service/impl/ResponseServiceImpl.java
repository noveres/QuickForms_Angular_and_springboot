package com.example.quiz12.service.impl;

import com.example.quiz12.dto.*;
import com.example.quiz12.entity.*;
import com.example.quiz12.mapper.ResponseMapper;
import com.example.quiz12.repository.*;
import com.example.quiz12.service.ResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResponseServiceImpl implements ResponseService {

    private final ResponseRepository responseRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionRepository questionRepository;
    private final ResponseMapper responseMapper;

    @Override
    @Transactional
    public ResponseDTO submitResponse(ResponseDTO responseDTO) {
        // 獲取問卷
        Questionnaire questionnaire = questionnaireRepository.findById(responseDTO.getQuestionnaireId())
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在"));

        // 驗證問卷狀態
        if (questionnaire.getStatus() != QuestionnaireStatus.PUBLISHED) {
            throw new IllegalStateException("問卷未發布，無法提交答案");
        }

        // 創建回答實體
        Response response = new Response();
        response.setQuestionnaire(questionnaire);
        response.setRespondentId(responseDTO.getRespondentId());

        // 處理每個問題的答案
        Map<Long, Question> questionMap = questionnaire.getSections().stream()
                .flatMap(section -> section.getQuestions().stream())
                .collect(Collectors.toMap(Question::getId, q -> q));

        for (AnswerDTO answerDTO : responseDTO.getAnswers()) {
            Question question = questionMap.get(answerDTO.getQuestionId());
            if (question == null) {
                throw new EntityNotFoundException("問題不存在: " + answerDTO.getQuestionId());
            }

            Answer answer = new Answer();
            answer.setQuestion(question);
            
            // 根據問題類型設置答案
            switch (question.getType()) {
                case TEXT:
                case TEXTAREA:
                    answer.setTextValue(answerDTO.getTextValue());
                    break;
                case RADIO:
                case CHECKBOX:
                case SELECT:
                    answer.setSelectedOptions(answerDTO.getSelectedOptions());
                    break;
                case NUMBER:
                case RATING:
                    answer.setNumberValue(answerDTO.getNumberValue());
                    break;
            }

            response.addAnswer(answer);
        }

        response = responseRepository.save(response);
        return responseMapper.toDTO(response);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResponseDTO> getResponsesByQuestionnaireId(Long questionnaireId, Pageable pageable) {
        return responseRepository.findByQuestionnaireId(questionnaireId, pageable)
                .map(responseMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionnaireStatsDTO getQuestionnaireStats(Long questionnaireId) {
        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在"));

        List<Response> responses = responseRepository.findByQuestionnaireId(questionnaireId);

        QuestionnaireStatsDTO stats = new QuestionnaireStatsDTO();
        stats.setQuestionnaireId(questionnaireId);
        stats.setTitle(questionnaire.getTitle());
        stats.setTotalResponses(responses.size());

        // 收集所有問題
        List<Question> questions = questionnaire.getSections().stream()
                .flatMap(section -> section.getQuestions().stream())
                .collect(Collectors.toList());

        // 為每個問題生成統計信息
        for (Question question : questions) {
            QuestionStatsDTO questionStats = new QuestionStatsDTO();
            questionStats.setQuestionId(question.getId());
            questionStats.setLabel(question.getLabel());
            questionStats.setType(question.getType());

            // 收集該問題的所有答案
            List<Answer> answers = responses.stream()
                    .flatMap(response -> response.getAnswers().stream())
                    .filter(answer -> answer.getQuestion().getId().equals(question.getId()))
                    .collect(Collectors.toList());

            questionStats.setTotalAnswers(answers.size());

            // 根據問題類型計算統計信息
            switch (question.getType()) {
                case RADIO:
                case CHECKBOX:
                case SELECT:
                    // 計算選項頻率
                    Map<String, Integer> optionCounts = new HashMap<>();
                    answers.forEach(answer -> 
                        answer.getSelectedOptions().forEach(option -> 
                            optionCounts.merge(option, 1, Integer::sum)
                        )
                    );
                    questionStats.setOptionCounts(optionCounts);
                    break;

                case NUMBER:
                case RATING:
                    // 計算數值統計
                    List<Integer> numbers = answers.stream()
                            .map(Answer::getNumberValue)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());
                    
                    if (!numbers.isEmpty()) {
                        questionStats.setAverage(numbers.stream()
                                .mapToDouble(Integer::doubleValue)
                                .average()
                                .orElse(0.0));
                        questionStats.setMin(Collections.min(numbers));
                        questionStats.setMax(Collections.max(numbers));
                    }
                    break;

                case TEXT:
                case TEXTAREA:
                    // 計算文本答案頻率（可選）
                    Map<String, Integer> textFrequency = new HashMap<>();
                    answers.stream()
                            .map(Answer::getTextValue)
                            .filter(Objects::nonNull)
                            .forEach(text -> textFrequency.merge(text, 1, Integer::sum));
                    questionStats.setTextAnswerFrequency(textFrequency);
                    break;
            }

            stats.getQuestionStats().add(questionStats);
        }

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseDTO getResponseById(Long responseId) {
        return responseRepository.findById(responseId)
                .map(responseMapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("回答不存在"));
    }

    @Override
    @Transactional
    public void deleteResponse(Long responseId) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new EntityNotFoundException("回答不存在"));
        responseRepository.delete(response);
    }
}
