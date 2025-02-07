package com.example.quiz12.service.impl;

import com.example.quiz12.dto.QuestionnaireDTO;
import com.example.quiz12.entity.Questionnaire;
import com.example.quiz12.entity.QuestionnaireStatus;
import com.example.quiz12.mapper.QuestionnaireMapper;
import com.example.quiz12.repository.QuestionnaireRepository;
import com.example.quiz12.repository.SectionRepository;
import com.example.quiz12.service.QuestionnaireService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionnaireServiceImpl implements QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;
    private final SectionRepository sectionRepository;
    private final QuestionnaireMapper questionnaireMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<QuestionnaireDTO> getAllQuestionnaires(Pageable pageable) {
        return questionnaireRepository.findAll(pageable)
                .map(questionnaireMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionnaireDTO getQuestionnaireById(Long id) {
        return questionnaireRepository.findById(id)
                .map(questionnaireMapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在: " + id));
    }

    @Override
    @Transactional
    public QuestionnaireDTO createQuestionnaire(QuestionnaireDTO questionnaireDTO) {
        Questionnaire questionnaire = questionnaireMapper.toEntity(questionnaireDTO);
        questionnaire.setStatus(QuestionnaireStatus.DRAFT);
        questionnaire = questionnaireRepository.save(questionnaire);
        return questionnaireMapper.toDTO(questionnaire);
    }

    @Override
    @Transactional
    public QuestionnaireDTO updateQuestionnaire(Long id, QuestionnaireDTO questionnaireDTO) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在: " + id));
        
        if (questionnaire.getStatus() == QuestionnaireStatus.PUBLISHED) {
            throw new IllegalStateException("已發布的問卷不能修改");
        }
        
        questionnaireMapper.updateEntityFromDTO(questionnaireDTO, questionnaire);
        questionnaire = questionnaireRepository.save(questionnaire);
        return questionnaireMapper.toDTO(questionnaire);
    }

    @Override
    @Transactional
    public void deleteQuestionnaire(Long id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在: " + id));
        
        if (questionnaire.getStatus() == QuestionnaireStatus.PUBLISHED) {
            throw new IllegalStateException("已發布的問卷不能刪除");
        }
        
        questionnaireRepository.delete(questionnaire);
    }

    @Override
    @Transactional
    public QuestionnaireDTO publishQuestionnaire(Long id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在: " + id));
        
        validateQuestionnaireForPublish(questionnaire);
        
        questionnaire.setStatus(QuestionnaireStatus.PUBLISHED);
        questionnaire.setPublishedAt(LocalDateTime.now());
        questionnaire = questionnaireRepository.save(questionnaire);
        
        return questionnaireMapper.toDTO(questionnaire);
    }

    @Override
    @Transactional
    public QuestionnaireDTO unpublishQuestionnaire(Long id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在: " + id));
        
        if (questionnaire.getStatus() != QuestionnaireStatus.PUBLISHED) {
            throw new IllegalStateException("問卷未發布");
        }
        
        questionnaire.setStatus(QuestionnaireStatus.DRAFT);
        questionnaire.setPublishedAt(null);
        questionnaire = questionnaireRepository.save(questionnaire);
        
        return questionnaireMapper.toDTO(questionnaire);
    }

    private void validateQuestionnaireForPublish(Questionnaire questionnaire) {
        if (questionnaire.getStatus() == QuestionnaireStatus.PUBLISHED) {
            throw new IllegalStateException("問卷已發布");
        }
        
        if (questionnaire.getSections().isEmpty()) {
            throw new IllegalStateException("問卷必須包含至少一個區塊");
        }
        
        questionnaire.getSections().forEach(section -> {
            if (section.getQuestions().isEmpty()) {
                throw new IllegalStateException(
                    String.format("區塊 '%s' 必須包含至少一個問題", section.getTitle()));
            }
        });
    }
}
