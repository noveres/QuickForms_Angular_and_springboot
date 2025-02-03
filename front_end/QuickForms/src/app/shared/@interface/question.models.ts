// shared/models/questionnaire.model.ts
export interface Questionnaire {
    id: string;          // 問卷唯一ID
    title: string;       // 問卷標題
    description?: string;// 問卷描述（可選）
    questions: Question[]; // 問題列表（需定義Question類型）
    isPublished: boolean;  // 是否已發布
    createdAt: Date;       // 創建時間
  }
  
  // 若未定義 Question 類型，需一並定義
  export interface Question {
    id: number;
    type: 'text' | 'radio' | 'checkbox' | 'textarea';
    title: string;
    options?: string[];    // 僅選擇題需要
    required: boolean;
  }