// shared/models/questionnaire.model.ts
export interface QuestionOption {
  min?: number;
  max?: number;
  choices?: Record<string, string>;
  placeholder?: string;
  allowOther?: boolean;
  multiple?: boolean;
}

export interface Question {
  id: number;
  label: string;
  type: string;
  required: boolean;
  options?: QuestionOption;
  value?: any;
}

export interface Section {
  id: number;
  title: string;
  type?: string;
  questions: Question[];
}

export interface QuestionnaireSettings {
  allowAnonymous?: boolean;
  requireLogin?: boolean;
  startDate?: string;
  endDate?: string;
  responseLimit?: number;
}

export interface QuestionnaireContent {
  sections: Section[];
  settings?: QuestionnaireSettings;
}

export interface Questionnaire {
  id: number;
  title: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED'| 'CLOSED';
  sections: Section[];
  settings?: QuestionnaireSettings;
  content?: string | QuestionnaireContent; // 可以是 JSON 字符串或解析後的對象
  responseCount?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}