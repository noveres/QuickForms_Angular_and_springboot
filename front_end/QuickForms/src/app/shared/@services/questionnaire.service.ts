import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Questionnaire } from '../@interface/question.models';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private apiUrl = '/api/questionnaires';
  // mockQuestionnaires: any;
  constructor(private http: HttpClient) {}
  private mockQuestionnaires = [
    { id: 1, title: '問卷 1' },
    { id: 2, title: '問卷 2' },
    { id: 3, title: '問卷 3' },
  ];

  getQuestionnaires(): Observable<any[]> {
    return of(this.mockQuestionnaires);
  }
  getList(): Observable<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(this.apiUrl);
  }
  copy(id: string): Observable<string> {
    return this.http.post<{id: string}>(`${this.apiUrl}/${id}/copy`, {})
      .pipe(map(res => res.id));
  }

  // 生成分享链接
  generateShareLink(id: string): Observable<string> {
    return this.http.post<{link: string}>(`${this.apiUrl}/${id}/share`, {})
      .pipe(map(res => res.link));
  }
  // questionnaire.service.ts
getStats(id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}/stats`);
}

getShareLink(id: string): Observable<string> {
  return this.http.post<string>(`${this.apiUrl}/${id}/share`, {});
}

delete(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

}
