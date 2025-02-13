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

export interface CommonPhrase {
    text: string;
    count: number;
}

export interface WordCloudItem {
    text: string;
    weight: number;
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
    id: number;
    label: string;
    type: 'choice' | 'rating' | 'text';
    totalResponses: number;
    choices?: { [key: string]: number }; 
    ratings?: { [key: string]: number }; 
    commonPhrases?: CommonPhrase[];
    wordCloud?: WordCloudItem[];
    averageRating?: number;
}
