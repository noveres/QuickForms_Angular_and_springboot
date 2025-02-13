export interface QuestionAnswerDTO {
    questionId: number;
    answerValue: string;
}

export interface QuestionnaireResponseDTO {
    answers: QuestionAnswerDTO[];
    respondentId?: string;
    ipAddress?: string;
    userAgent?: string;
}
