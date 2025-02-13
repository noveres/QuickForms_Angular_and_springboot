import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionnaireService } from '../../../shared/@services/questionnaire.service';
import { Questionnaire, QuestionOption } from '../../../shared/@interface/question.models';

interface QuestionForm {
  label: FormControl<string>;
  type: FormControl<string>;
  required: FormControl<boolean>;
  options: FormControl<QuestionOption | undefined>;
  answer: FormControl<any>;
}

interface SectionForm {
  title: FormControl<string>;
  questions: FormArray<FormGroup<QuestionForm>>;
}

@Component({
  selector: 'app-questionnaire-answer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './questionnaire-answer.component.html',
  styleUrls: ['./questionnaire-answer.component.scss']
})
export class QuestionnaireAnswerComponent implements OnInit {
  questionnaire?: Questionnaire;
  answerForm: FormGroup<{
    sections: FormArray<FormGroup<SectionForm>>;
  }>;
  isSubmitting = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private questionnaireService: QuestionnaireService,
    private snackBar: MatSnackBar
  ) {
    this.answerForm = this.fb.group({
      sections: this.fb.array<FormGroup<SectionForm>>([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadQuestionnaire(id);
    }
  }

  get sections(): FormArray<FormGroup<SectionForm>> {
    return this.answerForm.get('sections') as FormArray<FormGroup<SectionForm>>;
  }

  getSectionControls(): FormGroup<SectionForm>[] {
    return this.sections.controls;
  }

  getQuestionControls(sectionIndex: number): FormGroup<QuestionForm>[] {
    const section = this.sections.at(sectionIndex);
    const questions = section.get('questions') as FormArray<FormGroup<QuestionForm>>;
    return questions.controls;
  }

  loadQuestionnaire(id: number) {
    this.questionnaireService.getQuestionnaire(id).subscribe({
      next: (questionnaire) => {
        this.questionnaire = questionnaire;
        this.initializeForm(questionnaire);
      },
      error: (error) => {
        console.error('加載問卷失敗:', error);
        this.snackBar.open('加載問卷失敗', '關閉', { duration: 3000 });
      }
    });
  }

  initializeForm(questionnaire: Questionnaire) {
    const sectionsArray = this.fb.array<FormGroup<SectionForm>>([]);

    questionnaire.sections?.forEach(section => {
      const questionsArray = this.fb.array<FormGroup<QuestionForm>>([]);

      section.questions?.forEach(question => {
        const validators = this.getValidators(question.type, question.required);
        const questionGroup = this.fb.group<QuestionForm>({
          label: this.fb.control(question.label || ''),
          type: this.fb.control(question.type || 'short-text'),
          required: this.fb.control(question.required || false),
          options: this.fb.control<QuestionOption | undefined>(question.options),
          answer: this.fb.control(this.getDefaultAnswer(question.type), validators)
        });

        questionsArray.push(questionGroup);
      });

      const sectionGroup = this.fb.group<SectionForm>({
        title: this.fb.control(section.title || ''),
        questions: questionsArray
      });

      sectionsArray.push(sectionGroup);
    });

    this.answerForm.setControl('sections', sectionsArray);
  }

  private getValidators(type: string, required: boolean) {
    const validators = [];
    
    if (required) {
      validators.push(Validators.required);
    }

    switch (type) {
      case 'email':
        validators.push(Validators.email);
        break;
      case 'phone':
        validators.push(Validators.pattern('[0-9]*'));
        break;
      case 'checkbox':
        if (required) {
          validators.push(Validators.minLength(1));
        }
        break;
    }

    return validators;
  }

  private getDefaultAnswer(type: string): any {
    switch (type) {
      case 'checkbox':
        return [];
      case 'rating':
      case 'radio':
      case 'select':
        return '';
      default:
        return '';
    }
  }

  isOptionSelected(question: FormGroup<QuestionForm>, optionKey: string): boolean {
    const answer = question.get('answer')?.value;
    return Array.isArray(answer) && answer.includes(optionKey);
  }

  toggleOption(question: FormGroup<QuestionForm>, optionKey: string, checked: boolean) {
    const answerControl = question.get('answer');
    if (!answerControl) return;

    const currentValue = answerControl.value || [];
    const newValue = Array.isArray(currentValue) ? currentValue : [];
    
    if (checked) {
      if (!newValue.includes(optionKey)) {
        answerControl.setValue([...newValue, optionKey]);
      }
    } else {
      answerControl.setValue(newValue.filter((key: string) => key !== optionKey));
    }

    answerControl.markAsTouched();
  }

  onSubmit() {
    if (this.answerForm.invalid) {
      this.markFormGroupTouched(this.answerForm);
      this.snackBar.open('請填寫所有必填項目', '關閉', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.answerForm.value;
    
    // 處理提交邏輯
    console.log('提交答案:', formValue);
    
    // TODO: 實現提交答案的 API 調用
    setTimeout(() => {
      this.isSubmitting = false;
      this.snackBar.open('提交成功', '關閉', { duration: 3000 });
      this.router.navigate(['/questionnaires']);
    }, 1000);
  }

  private markFormGroupTouched(formGroup: AbstractControl) {
    if (formGroup instanceof FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
        this.markFormGroupTouched(control);
      });
    } else if (formGroup instanceof FormArray) {
      formGroup.controls.forEach(control => {
        this.markFormGroupTouched(control);
      });
    } else {
      formGroup.markAsTouched();
    }
  }
}
