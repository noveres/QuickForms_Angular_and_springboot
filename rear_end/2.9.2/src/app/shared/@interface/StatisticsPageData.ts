import { HttpClient } from "@angular/common/http";
import { Questionnaire } from "./question.models";
import { QuestionStatistics } from './statistics.models';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface StatisticsPageData {
    questionnaire: Questionnaire;
    overview: {
        totalResponses: number;
        completionRate: number;
        averageTimeSpent: number;
    };
    questionStatistics: QuestionStatistics[];
}

export interface StatisticsResponse {
    success: boolean;
    data: StatisticsPageData;
    error?: string;
}

// 統計服務
@Injectable({
    providedIn: 'root'
})
export class StatisticsService {
    constructor(private http: HttpClient) {}

    getQuestionnaireStatistics(id: number): Observable<StatisticsPageData> {
        return this.http.get<StatisticsPageData>(`/api/questionnaires/${id}/statistics`);
    }

    getQuestionStatistics(id: number): Observable<QuestionStatistics> {
        return this.http.get<QuestionStatistics>(`/api/questions/${id}/statistics`);
    }

    exportToExcel(questionnaireId: number): Observable<Blob> {
        return this.http.get(`/api/questionnaires/${questionnaireId}/export`, {
            responseType: 'blob'
        });
    }
}