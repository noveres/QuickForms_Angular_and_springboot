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

  getQuestionnaire(id: number): Observable<Questionnaire> {
    return this.http.get<Questionnaire>(`${this.API_URL}/questionnaires/${id}`);
  }

  createQuestionnaire(questionnaire: Partial<Questionnaire>): Observable<Questionnaire> {
    // 直接發送問卷數據，不需要額外的 content 包裝
    const questionnaireData = {
      title: questionnaire.title,
      description: questionnaire.description,
      status: questionnaire.status || 'DRAFT',
      sections: questionnaire.sections || [],
      settings: questionnaire.settings || {}
    };

    console.log('Creating questionnaire with data:', JSON.stringify(questionnaireData, null, 2));
    return this.http.post<Questionnaire>(`${this.API_URL}/questionnaires`, questionnaireData);
  }

  updateQuestionnaire(id: number, questionnaire: Partial<Questionnaire>): Observable<Questionnaire> {
    // 直接發送問卷數據，不需要額外的 content 包裝
    const questionnaireData = {
      title: questionnaire.title,
      description: questionnaire.description,
      status: questionnaire.status || 'DRAFT',
      sections: questionnaire.sections || [],
      settings: questionnaire.settings || {}
    };

    console.log('Updating questionnaire with data:', JSON.stringify(questionnaireData, null, 2));
    return this.http.put<Questionnaire>(`${this.API_URL}/questionnaires/${id}`, questionnaireData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/questionnaires/${id}`);
  }

  publish(id: number): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(`${this.API_URL}/questionnaires/${id}/publish`, {});
  }

  unpublish(id: number): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(`${this.API_URL}/questionnaires/${id}/unpublish`, {});
  }

  copy(id: number): Observable<Questionnaire> {
    return this.http.post<Questionnaire>(`${this.API_URL}/questionnaires/${id}/copy`, {});
  }

  getStats(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/questionnaires/${id}/stats`);
  }

  // 自動保存草稿
  autoSaveDraft(id: number, data: Partial<Questionnaire>): Observable<Questionnaire> {
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
