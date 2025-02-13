import { QuestionOption } from './question.models';

export interface QuestionAnswer {
    questionId: number;
    answerValue: any;
}

export interface ChoiceStatistics {
    totalResponses: number;
    counts: { [key: string]: number };
    percentages: { [key: string]: number };
}

export interface RatingStatistics {
    totalResponses: number;
    average: number;
    distribution: { [key: string]: number };
}

export interface WordCloudItem {
    word: string;
    count: number;
}

export interface CommonPhrase {
    phrase: string;
    count: number;
}

export interface TextAnalysis {
    wordCloud: WordCloudItem[];
    commonPhrases: CommonPhrase[];
}

export interface TextStatistics {
    totalResponses: number;
    wordCloud: WordCloudItem[];
    commonPhrases: CommonPhrase[];
}

export interface QuestionStatistics {
    questionId: number;
    questionLabel: string;
    questionType: string;
    totalResponses: number;
    statistics: {
        counts?: { [key: string]: number };
        percentages?: { [key: string]: number };
        average?: number;
        distribution?: { [key: string]: number };
        textAnalysis?: TextAnalysis;
    };
}
