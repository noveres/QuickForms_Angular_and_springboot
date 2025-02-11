// shared/models/questionnaire.model.ts
export interface QuestionOption {
  max?: number;
  choices?: string[];
  placeholder?: string;
  allowOther?: boolean;
  multiple?: boolean;
}

export interface Question {
  id?: string;
  label: string;
  type: string;
  required: boolean;
  options?: QuestionOption;
  value?: any;
}

export interface Section {
  id?: string;
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

export interface Questionnaire {
  id?: string;
  title: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED'| 'CLOSED';
  sections: Section[];
  settings?: QuestionnaireSettings;
  content?: string; // JSON 字符串，包含 sections 和 settings
  responseCount?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}