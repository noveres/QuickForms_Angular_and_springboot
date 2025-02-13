import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface QuestionTemplate {
  label: string;
  type: 'short-text' | 'long-text' | 'email' | 'phone' | 'rating' | 'radio' | 'checkbox' | 'select';
  required: boolean;
  options?: {
    max?: number;
    choices?: Record<string, string>;
    placeholder?: string;
    allowOther?: boolean;
    multiple?: boolean;
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

export interface QuestionnaireStatistics {
  questionnaireId: number;
  totalResponses: number;
  questionStatistics: {
    questionId: number;
    questionText: string;
    questionType: string;
    optionDistribution: { [key: string]: number };
    totalAnswers: number;
  }[];
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
              options: {
                max: 5,
                choices: {
                  '0': 'Very Satisfied',
                  '1': 'Satisfied',
                  '2': '0000',
                  '3': 'Dissatisfied',
                  '4': 'Very Dissatisfied'
                }
              }
            },
            { 
              label: '服務態度滿意度', 
              type: 'rating', 
              required: true,
              options: {
                max: 5,
                choices: {
                  '0': 'Very Satisfied',
                  '1': 'Satisfied',
                  '2': '0000',
                  '3': 'Dissatisfied',
                  '4': 'Very Dissatisfied'
                }
              }
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
              options: {
                placeholder: '請輸入您的建議...'
              }
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
            { label: '聯繫電話', type: 'phone', required: true },
            {
              label: '參加場次',
              type: 'radio',
              required: true,
              options: {
                choices: {
                  '1': '上午場 (9:00-12:00)',
                  '2': '下午場 (14:00-17:00)'
                }
              }
            },
            {
              label: '飲食偏好',
              type: 'checkbox',
              required: false,
              options: {
                choices: {
                  '1': '素食',
                  '2': '不含海鮮',
                  '3': '不含花生'
                },
                allowOther: true
              }
            }
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

  // 修改 apiUrl 為正確的後端地址
  private apiUrl = 'http://localhost:8585/api';

  constructor(private http: HttpClient) { }

  getTemplates(): Observable<Template[]> {
    return of(this.templates);
  }

  getTemplateById(id: number): Observable<Template | undefined> {
    return of(this.templates.find(template => template.id === id));
  }

  getQuestionnaireStatistics(id: number): Observable<QuestionnaireStatistics> {
    return this.http.get<QuestionnaireStatistics>(`${this.apiUrl}/statistics/questionnaire/${id}`);
  }
}
