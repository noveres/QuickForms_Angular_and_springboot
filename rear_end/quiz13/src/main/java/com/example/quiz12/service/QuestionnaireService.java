package com.example.quiz12.service;

import com.example.quiz12.dto.QuestionnaireDTO;
import com.example.quiz12.entity.Question;
import com.example.quiz12.entity.Questionnaire;
import com.example.quiz12.repository.QuestionnaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionnaireMapper questionnaireMapper;

    @Transactional(readOnly = true)
    public Page<QuestionnaireDTO> getAllQuestionnaires(Pageable pageable) {
        return questionnaireRepository.findAll(pageable).map(questionnaireMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public QuestionnaireDTO getQuestionnaireById(Long id) {
        return questionnaireRepository.findById(id)
                .map(questionnaireMapper::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在: " + id));
    }

    @Transactional
    public QuestionnaireDTO createQuestionnaire(QuestionnaireDTO questionnaireDTO) {
        Questionnaire questionnaire = questionnaireMapper.toEntity(questionnaireDTO);
        questionnaire = questionnaireRepository.save(questionnaire);
        return questionnaireMapper.toDTO(questionnaire);
    }

    @Transactional
    public QuestionnaireDTO updateQuestionnaire(Long id, QuestionnaireDTO questionnaireDTO) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在: " + id));
        
        questionnaireMapper.updateEntityFromDTO(questionnaireDTO, questionnaire);
        questionnaire = questionnaireRepository.save(questionnaire);
        return questionnaireMapper.toDTO(questionnaire);
    }

    @Transactional
    public void deleteQuestionnaire(Long id) {
        if (!questionnaireRepository.existsById(id)) {
            throw new EntityNotFoundException("問卷不存在: " + id);
        }
        questionnaireRepository.deleteById(id);
    }

    @Transactional
    public QuestionnaireDTO publishQuestionnaire(Long id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在: " + id));
        questionnaire.setPublished(true);
        questionnaire = questionnaireRepository.save(questionnaire);
        return questionnaireMapper.toDTO(questionnaire);
    }

    @Transactional
    public QuestionnaireDTO unpublishQuestionnaire(Long id) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("問卷不存在: " + id));
        questionnaire.setPublished(false);
        questionnaire = questionnaireRepository.save(questionnaire);
        return questionnaireMapper.toDTO(questionnaire);
    }
}
