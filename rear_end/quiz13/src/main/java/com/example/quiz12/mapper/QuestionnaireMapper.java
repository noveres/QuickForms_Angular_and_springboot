package com.example.quiz12.mapper;

import com.example.quiz12.dto.QuestionDTO;
import com.example.quiz12.dto.QuestionnaireDTO;
import com.example.quiz12.dto.SectionDTO;
import com.example.quiz12.entity.Question;
import com.example.quiz12.entity.Questionnaire;
import com.example.quiz12.entity.Section;
import org.springframework.web.bind.annotation.Mapping;


@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface QuestionnaireMapper {

    // Questionnaire mappings
    QuestionnaireDTO toDTO(Questionnaire questionnaire);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    Questionnaire toEntity(QuestionnaireDTO questionnaireDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "publishedAt", ignore = true)
    void updateEntityFromDTO(QuestionnaireDTO dto, @MappingTarget Questionnaire entity);

    // Section mappings
    SectionDTO toDTO(Section section);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "questionnaire", ignore = true)
    Section toEntity(SectionDTO sectionDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "questionnaire", ignore = true)
    void updateEntityFromDTO(SectionDTO dto, @MappingTarget Section entity);

    // Question mappings
    QuestionDTO toDTO(Question question);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "section", ignore = true)
    Question toEntity(QuestionDTO questionDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "section", ignore = true)
    void updateEntityFromDTO(QuestionDTO dto, @MappingTarget Question entity);

    // After mapping methods
    @AfterMapping
    default void linkSections(@MappingTarget Questionnaire questionnaire) {
        if (questionnaire.getSections() != null) {
            questionnaire.getSections().forEach(section -> section.setQuestionnaire(questionnaire));
        }
    }

    @AfterMapping
    default void linkQuestions(@MappingTarget Section section) {
        if (section.getQuestions() != null) {
            section.getQuestions().forEach(question -> question.setSection(section));
        }
    }
}
