import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Questionnaire {
  id: string;
  title: string;
  sections: any[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface AutoSaveData {
  id: string;
  data: Partial<Questionnaire>;
  lastAutoSaved: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private readonly STORAGE_KEY = 'questionnaires';
  private readonly AUTO_SAVE_KEY = 'questionnaire_autosave';

  constructor() {
    // 初始化 localStorage
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  // 獲取所有問卷
  getQuestionnaires(): Observable<Questionnaire[]> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    return of(questionnaires);
  }

  // 根據 ID 獲取問卷
  getQuestionnaire(id: string): Observable<Questionnaire | null> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const questionnaire = questionnaires.find((q: Questionnaire) => q.id === id);
    return of(questionnaire || null);
  }

  // 創建新問卷
  createQuestionnaire(data: Partial<Questionnaire>): Observable<Questionnaire> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const now = new Date().toISOString();
    
    const newQuestionnaire: Questionnaire = {
      id: crypto.randomUUID(),
      title: data.title || '',
      sections: data.sections || [],
      status: 'published',
      createdAt: now,
      updatedAt: now
    };

    questionnaires.push(newQuestionnaire);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
    return of(newQuestionnaire);
  }

  // 更新問卷
  updateQuestionnaire(id: string, data: Partial<Questionnaire>): Observable<Questionnaire> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const index = questionnaires.findIndex((q: Questionnaire) => q.id === id);
    
    if (index === -1) {
      throw new Error('Questionnaire not found');
    }

    const updatedQuestionnaire = {
      ...questionnaires[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    questionnaires[index] = updatedQuestionnaire;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
    return of(updatedQuestionnaire);
  }

  // 保存問卷草稿
  saveDraft(data: Partial<Questionnaire>): Observable<Questionnaire> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const now = new Date().toISOString();
    
    const newQuestionnaire: Questionnaire = {
      id: crypto.randomUUID(),
      title: data.title || '',
      sections: data.sections || [],
      status: 'draft',
      createdAt: now,
      updatedAt: now
    };

    questionnaires.push(newQuestionnaire);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
    return of(newQuestionnaire);
  }

  // 更新問卷草稿
  updateDraft(id: string, data: Partial<Questionnaire>): Observable<Questionnaire> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const index = questionnaires.findIndex((q: Questionnaire) => q.id === id);
    
    if (index === -1) {
      throw new Error('Questionnaire not found');
    }

    const updatedQuestionnaire = {
      ...questionnaires[index],
      ...data,
      status: 'draft',
      updatedAt: new Date().toISOString()
    };

    questionnaires[index] = updatedQuestionnaire;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
    return of(updatedQuestionnaire);
  }

  // 自動保存草稿
  autoSaveDraft(id: string, data: Partial<Questionnaire>): Observable<AutoSaveData> {
    const now = new Date().toISOString();
    const autoSaveData: AutoSaveData = {
      id,
      data,
      lastAutoSaved: now
    };
    
    const key = `${this.AUTO_SAVE_KEY}_${id}`;
    localStorage.setItem(key, JSON.stringify(autoSaveData));
    return of(autoSaveData);
  }

  // 獲取自動保存的草稿
  getAutoSavedDraft(id: string): Observable<AutoSaveData | null> {
    const key = `${this.AUTO_SAVE_KEY}_${id}`;
    const data = localStorage.getItem(key);
    return of(data ? JSON.parse(data) : null);
  }

  // 清除自動保存的草稿
  clearAutoSavedDraft(id: string): void {
    const key = `${this.AUTO_SAVE_KEY}_${id}`;
    localStorage.removeItem(key);
  }

  // 發布問卷
  publish(id: string): Observable<Questionnaire> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const index = questionnaires.findIndex((q: Questionnaire) => q.id === id);
    
    if (index === -1) {
      throw new Error('Questionnaire not found');
    }

    const now = new Date().toISOString();
    const publishedQuestionnaire = {
      ...questionnaires[index],
      status: 'published' as const,
      publishedAt: now,
      updatedAt: now
    };

    questionnaires[index] = publishedQuestionnaire;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
    return of(publishedQuestionnaire);
  }

  // 獲取問卷分享連結
  getShareLink(id: string): string {
    return `${window.location.origin}/questionnaires/share/${id}`;
  }
}
