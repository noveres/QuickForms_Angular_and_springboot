import { HttpClient } from "@angular/common/http";
import { Questionnaire } from "./question.models";
import { QuestionStatistics } from './statistics.models';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface StatisticsOverview {
  totalResponses: number;
  completedResponses: number;
  averageCompletionTime: number; // 以秒為單位
  startDate?: string;
  endDate?: string;
}

export interface StatisticsPageData {
  questionnaire?: {
    id: number;
    title: string;
    description?: string;
  };
  overview: StatisticsOverview;
  questions: QuestionStatistics[];
  responseDistribution?: {
    [key: string]: number; // 時間段: 回答數量
  };
}

export interface StatisticsResponse {
  success: boolean;
  error?: string;
  data: StatisticsPageData;
}

// 統計服務
@Injectable({
    providedIn: 'root'
})
export class StatisticsService {
    constructor(private http: HttpClient) {}

    getQuestionnaireStatistics(id: number): Observable<StatisticsPageData> {
        return this.http.get<StatisticsPageData>(`/api/statistics/questionnaires/${id}`);
    }

    getQuestionStatistics(id: number): Observable<QuestionStatistics> {
        return this.http.get<QuestionStatistics>(`/api/statistics/questions/${id}`);
    }

    exportToExcel(questionnaireId: number): Observable<Blob> {
        return this.http.get(`/api/statistics/questionnaires/${questionnaireId}/export`, {
            responseType: 'blob'
        });
    }
}