// shared/models/template.model.ts
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