package com.example.quiz12.mapper;

import com.example.quiz12.dto.AnswerDTO;
import com.example.quiz12.dto.ResponseDTO;
import com.example.quiz12.entity.Answer;
import com.example.quiz12.entity.Response;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ResponseMapper {

    @Mapping(target = "questionnaireId", source = "questionnaire.id")
    ResponseDTO toDTO(Response response);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "questionnaire", ignore = true)
    @Mapping(target = "submittedAt", ignore = true)
    Response toEntity(ResponseDTO responseDTO);

    @Mapping(target = "questionId", source = "question.id")
    AnswerDTO toDTO(Answer answer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "response", ignore = true)
    Answer toEntity(AnswerDTO answerDTO);
}
