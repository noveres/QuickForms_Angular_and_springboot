import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Questionnaire } from '../../../shared/@interface/question.models';

export interface AutoSaveData {
  id: number;
  data: Partial<Questionnaire>;
  lastAutoSaved: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private readonly STORAGE_KEY = 'questionnaires';
  private readonly AUTO_SAVE_KEY = 'questionnaire_autosave';
  private nextId = 1;

  constructor() {
    // 初始化 localStorage
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    } else {
      // 找出當前最大的 ID
      const questionnaires: Questionnaire[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      if (questionnaires.length > 0) {
        this.nextId = Math.max(...questionnaires.map(q => q.id)) + 1;
      }
    }
  }

  // 獲取所有問卷
  getQuestionnaires(): Observable<Questionnaire[]> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    return of(questionnaires);
  }

  // 根據 ID 獲取問卷
  getQuestionnaire(id: number): Observable<Questionnaire | null> {
    console.log('Getting questionnaire with ID:', id);
    const questionnaires: Questionnaire[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    console.log('All questionnaires:', questionnaires);
    const questionnaire = questionnaires.find((q: Questionnaire) => q.id === id);
    console.log('Found questionnaire:', questionnaire);

    if (questionnaire) {
      try {
        // 如果 content 是字符串，嘗試解析它
        if (typeof questionnaire.content === 'string') {
          const parsedContent = JSON.parse(questionnaire.content);
          questionnaire.sections = parsedContent.sections || [];
          questionnaire.settings = parsedContent.settings;
        }
      } catch (error) {
        console.error('Error parsing questionnaire content:', error);
      }
    }

    return of(questionnaire || null);
  }

  // 創建新問卷
  createQuestionnaire(data: Partial<Questionnaire>): Observable<Questionnaire> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const now = new Date().toISOString();

    const newQuestionnaire: Questionnaire = {
      id: this.nextId++,
      title: data.title || '',
      sections: data.sections || [],
      content: JSON.stringify({
        sections: data.sections || [],
        settings: data.settings || {}
      }),
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now
    };

    questionnaires.push(newQuestionnaire);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
    return of(newQuestionnaire);
  }

  // 更新問卷
  updateQuestionnaire(id: number, data: Partial<Questionnaire>): Observable<Questionnaire> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const index = questionnaires.findIndex((q: Questionnaire) => q.id === id);
    const now = new Date().toISOString();

    if (index === -1) {
      throw new Error('Questionnaire not found');
    }

    const updatedQuestionnaire: Questionnaire = {
      ...questionnaires[index],
      ...data,
      sections: data.sections || questionnaires[index].sections,
      content: JSON.stringify({
        sections: data.sections || questionnaires[index].sections,
        settings: data.settings || questionnaires[index].settings
      }),
      updatedAt: now
    };

    questionnaires[index] = updatedQuestionnaire;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
    return of(updatedQuestionnaire);
  }

  // 刪除問卷
  deleteQuestionnaire(id: number): Observable<void> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const index = questionnaires.findIndex((q: Questionnaire) => q.id === id);
    
    if (index === -1) {
      throw new Error('Questionnaire not found');
    }

    questionnaires.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));

    return of(void 0);
  }

  // 保存草稿
  saveDraft(id: number | null, data: Partial<Questionnaire>): Observable<Questionnaire> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const now = new Date().toISOString();

    if (id !== null) {
      console.log('Updating existing draft with ID:', id);
      const index = questionnaires.findIndex((q: Questionnaire) => q.id === id);
      if (index !== -1) {
        console.log('Found existing questionnaire at index:', index);
        const updatedQuestionnaire: Questionnaire = {
          ...questionnaires[index],
          ...data,
          sections: data.sections || [],
          content: JSON.stringify({
            sections: data.sections || [],
            settings: data.settings || {}
          }),
          status: 'DRAFT',
          updatedAt: now
        };
        questionnaires[index] = updatedQuestionnaire;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
        console.log('Updated questionnaire:', updatedQuestionnaire);
        return of(updatedQuestionnaire);
      }
    }

    // 如果沒有找到問卷或者沒有提供 ID，創建新的草稿
    console.log('Creating new draft');
    const newDraft: Questionnaire = {
      id: this.nextId++,
      title: data.title || '',
      sections: data.sections || [],
      content: JSON.stringify({
        sections: data.sections || [],
        settings: data.settings || {}
      }),
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now
    };

    questionnaires.push(newDraft);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
    console.log('Created new draft:', newDraft);
    return of(newDraft);
  }

  // 自動保存草稿
  autoSaveDraft(id: number, data: Partial<Questionnaire>): Observable<AutoSaveData> {
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
  getAutoSavedDraft(id: number): Observable<AutoSaveData | null> {
    const key = `${this.AUTO_SAVE_KEY}_${id}`;
    const data = localStorage.getItem(key);
    return of(data ? JSON.parse(data) : null);
  }

  // 清除自動保存的草稿
  clearAutoSavedDraft(id: number): void {
    const key = `${this.AUTO_SAVE_KEY}_${id}`;
    localStorage.removeItem(key);
  }

  // 發布問卷
  publish(id: number): Observable<Questionnaire> {
    const questionnaires = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const index = questionnaires.findIndex((q: Questionnaire) => q.id === id);
    
    if (index === -1) {
      throw new Error('Questionnaire not found');
    }

    const now = new Date().toISOString();
    const publishedQuestionnaire: Questionnaire = {
      ...questionnaires[index],
      status: 'PUBLISHED',
      updatedAt: now
    };

    questionnaires[index] = publishedQuestionnaire;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(questionnaires));
    return of(publishedQuestionnaire);
  }

  // 獲取問卷分享連結
  getShareLink(id: number): string {
    return `${window.location.origin}/questionnaires/share/${id}`;
  }
}
