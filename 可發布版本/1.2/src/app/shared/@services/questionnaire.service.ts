import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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
    // 先獲取原問卷
    return this.getQuestionnaire(id).pipe(
      map(questionnaire => {
        // 準備新問卷的數據，使用正確的類型
        const newQuestionnaire: Partial<Questionnaire> = {
          title: `${questionnaire.title} (複製)`,
          description: questionnaire.description,
          sections: questionnaire.sections,
          settings: questionnaire.settings,
          status: 'DRAFT' as const // 使用 const assertion 確保正確的類型
        };
        return newQuestionnaire;
      }),
      // 創建新問卷
      mergeMap(newQuestionnaire => this.createQuestionnaire(newQuestionnaire))
    );
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
