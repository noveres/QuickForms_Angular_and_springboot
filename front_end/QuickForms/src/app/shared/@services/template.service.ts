import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface QuestionTemplate {
  label: string;
  type: 'short-text' | 'long-text' | 'email' | 'phone' | 'rating';
  required: boolean;
  options?: {
    max?: number;
    placeholder?: string;
  };
}

export interface SectionTemplate {
  title: string;
  type: string;
  questions: QuestionTemplate[];
}

export interface Template {
  id: number;
  title: string;
  description: string;
  sections: SectionTemplate[];
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templates: Template[] = [
    {
      id: 1,
      title: '客戶滿意度調查',
      description: '收集客戶反饋和建議',
      sections: [
        {
          title: '基本信息',
          type: 'text',
          questions: [
            { label: '姓名', type: 'short-text', required: true },
            { label: '電子郵件', type: 'email', required: true },
            { label: '聯繫電話', type: 'phone', required: false }
          ]
        },
        {
          title: '評分項目',
          type: 'rating',
          questions: [
            { 
              label: '產品質量滿意度', 
              type: 'rating', 
              required: true,
              options: { max: 5 }
            },
            { 
              label: '服務態度滿意度', 
              type: 'rating', 
              required: true,
              options: { max: 5 }
            }
          ]
        },
        {
          title: '詳細反饋',
          type: 'text',
          questions: [
            { 
              label: '您對我們的產品或服務有什麼建議？', 
              type: 'long-text', 
              required: false,
              options: { placeholder: '請輸入您的建議...' }
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: '活動報名表',
      description: '活動和會議報名',
      sections: [
        {
          title: '參與者信息',
          type: 'text',
          questions: [
            { label: '姓名', type: 'short-text', required: true },
            { label: '電子郵件', type: 'email', required: true },
            { label: '聯繫電話', type: 'phone', required: true }
          ]
        }
      ]
    },
    {
      id: 3,
      title: '員工考核表',
      description: '定期績效評估',
      sections: [
        {
          title: '基本評分',
          type: 'rating',
          questions: [
            { 
              label: '工作質量', 
              type: 'rating', 
              required: true,
              options: { max: 5 }
            },
            { 
              label: '團隊合作', 
              type: 'rating', 
              required: true,
              options: { max: 5 }
            }
          ]
        },
        {
          title: '詳細評價',
          type: 'text',
          questions: [
            { 
              label: '主要成就', 
              type: 'long-text', 
              required: true,
              options: { placeholder: '請描述本期主要工作成就...' }
            },
            { 
              label: '改進建議', 
              type: 'long-text', 
              required: false,
              options: { placeholder: '請提出改進建議...' }
            }
          ]
        }
      ]
    }
  ];

  getTemplates(): Observable<Template[]> {
    return of(this.templates);
  }

  getTemplateById(id: number): Observable<Template | undefined> {
    return of(this.templates.find(t => t.id === id));
  }
}
