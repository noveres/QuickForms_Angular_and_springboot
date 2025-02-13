import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StatisticsPageData, StatisticsResponse } from '../@interface/StatisticsPageData';
import { QuestionStatistics } from '../@interface/statistics.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {
    private apiUrl = `${environment.apiUrl}/statistics`;

    constructor(private http: HttpClient) {}

    async getQuestionnaireStatistics(id: number): Promise<StatisticsPageData> {
        try {
            const response = await firstValueFrom(
                this.http.get<StatisticsResponse>(`${this.apiUrl}/questionnaires/${id}`)
            );
            
            if (!response.success) {
                throw new Error(response.error || '獲取問卷統計數據失敗');
            }
            
            return response.data;
        } catch (error) {
            console.error('獲取問卷統計數據時出錯:', error);
            throw error;
        }
    }

    async getQuestionStatistics(id: number): Promise<QuestionStatistics> {
        try {
            const response = await firstValueFrom(
                this.http.get<QuestionStatistics>(`${this.apiUrl}/questions/${id}`)
            );
            return response;
        } catch (error) {
            console.error('獲取問題統計數據時出錯:', error);
            throw error;
        }
    }

    async exportToExcel(questionnaireId: number): Promise<Blob> {
        try {
            const response = await firstValueFrom(
                this.http.get(`${this.apiUrl}/questionnaires/${questionnaireId}/export`, {
                    responseType: 'blob'
                })
            );
            return response;
        } catch (error) {
            console.error('導出Excel時出錯:', error);
            throw error;
        }
    }

    // 獲取問卷回答列表
    async getQuestionnaireResponses(questionnaireId: number, page: number = 1, pageSize: number = 10) {
        try {
            const response = await firstValueFrom(
                this.http.get(`${this.apiUrl}/questionnaires/${questionnaireId}/responses`, {
                    params: {
                        page: page.toString(),
                        pageSize: pageSize.toString()
                    }
                })
            );
            return response;
        } catch (error) {
            console.error('獲取問卷回答列表時出錯:', error);
            throw error;
        }
    }

    // 獲取問卷完成率趨勢數據
    async getCompletionRateTrend(questionnaireId: number, startDate?: string, endDate?: string) {
        try {
            const params: any = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await firstValueFrom(
                this.http.get(`${this.apiUrl}/questionnaires/${questionnaireId}/completion-trend`, {
                    params
                })
            );
            return response;
        } catch (error) {
            console.error('獲取完成率趨勢數據時出錯:', error);
            throw error;
        }
    }

    // 獲取回答時間分布數據
    async getResponseTimesDistribution(questionnaireId: number) {
        try {
            const response = await firstValueFrom(
                this.http.get(`${this.apiUrl}/questionnaires/${questionnaireId}/response-times`)
            );
            return response;
        } catch (error) {
            console.error('獲取回答時間分布數據時出錯:', error);
            throw error;
        }
    }

    // 獲取問題關聯性分析
    async getQuestionCorrelations(questionnaireId: number, questionId: number) {
        try {
            const response = await firstValueFrom(
                this.http.get(`${this.apiUrl}/questionnaires/${questionnaireId}/questions/${questionId}/correlations`)
            );
            return response;
        } catch (error) {
            console.error('獲取問題關聯性分析時出錯:', error);
            throw error;
        }
    }
}
