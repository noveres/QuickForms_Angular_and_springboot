import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Questionnaire } from '../@interface/question.models';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private readonly API_URL = 'http://localhost:8585/api';

  constructor(private http: HttpClient) {}

  getQuestionnaires(): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(`${this.API_URL}/questionnaires`);
  }

  getQuestionnaire(id: string): Observable<Questionnaire> {
    return this.http.get<Questionnaire>(`${this.API_URL}/questionnaires/${id}`);
  }

  createQuestionnaire(questionnaire: Partial<Questionnaire>): Observable<Questionnaire> {
    // 將整個問卷數據轉換為 JSON 字符串
    const questionnaireJson = {
      ...questionnaire,
      content: JSON.stringify({
        sections: questionnaire.sections,
        settings: questionnaire.settings
      })
    };

    return this.http.post<Questionnaire>(`${this.API_URL}/questionnaires`, questionnaireJson);
  }

  updateQuestionnaire(id: string, questionnaire: Partial<Questionnaire>): Observable<Questionnaire> {
    // 將整個問卷數據轉換為 JSON 字符串
    const questionnaireJson = {
      ...questionnaire,
      content: JSON.stringify({
        sections: questionnaire.sections,
        settings: questionnaire.settings
      })
    };

    return this.http.put<Questionnaire>(`${this.API_URL}/questionnaires/${id}`, questionnaireJson);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/questionnaires/${id}`);
  }

  publish(id: string): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(`${this.API_URL}/questionnaires/${id}/publish`, {});
  }

  unpublish(id: string): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(`${this.API_URL}/questionnaires/${id}/unpublish`, {});
  }

  copy(id: string): Observable<string> {
    return this.http.post<{id: string}>(`${this.API_URL}/questionnaires/${id}/copy`, {})
      .pipe(map(res => res.id));
  }

  getStats(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/questionnaires/${id}/stats`);
  }

  // 自動保存草稿
  autoSaveDraft(id: string, data: Partial<Questionnaire>): Observable<Questionnaire> {
    const draftJson = {
      ...data,
      content: JSON.stringify({
        sections: data.sections,
        settings: data.settings
      }),
      status: 'DRAFT' as const
    };

    return this.http.post<Questionnaire>(`${this.API_URL}/questionnaires/${id}/auto-save`, draftJson);
  }

  // 保存草稿
  saveDraft(data: Partial<Questionnaire>): Observable<Questionnaire> {
    const draftJson = {
      ...data,
      content: JSON.stringify({
        sections: data.sections,
        settings: data.settings
      }),
      status: 'DRAFT' as const
    };

    return this.http.post<Questionnaire>(`${this.API_URL}/questionnaires/drafts`, draftJson);
  }

  // 更新草稿
  updateDraft(id: string, data: Partial<Questionnaire>): Observable<Questionnaire> {
    const draftJson = {
      ...data,
      content: JSON.stringify({
        sections: data.sections,
        settings: data.settings
      }),
      status: 'DRAFT' as const
    };

    return this.http.put<Questionnaire>(`${this.API_URL}/questionnaires/drafts/${id}`, draftJson);
  }

  // 刪除草稿
  deleteDraft(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/questionnaires/drafts/${id}`);
  }
}
