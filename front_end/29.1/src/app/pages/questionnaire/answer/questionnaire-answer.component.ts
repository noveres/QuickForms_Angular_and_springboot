import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuestionnaireService } from '../../../shared/@services/questionnaire.service';
import { Questionnaire } from '../../../shared/@interface/question.models';

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
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule
  ],
  templateUrl: './questionnaire-answer.component.html',
  styleUrl: './questionnaire-answer.component.scss'
})
export class QuestionnaireAnswerComponent implements OnInit {
  answerForm: FormGroup;
  questionnaire?: Questionnaire;
  questionnaireId: number | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private questionnaireService: QuestionnaireService
  ) {
    this.answerForm = this.fb.group({
      sections: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.questionnaireId = parseInt(params['id'], 10);
        this.loadQuestionnaire();
      }
    });
  }

  private loadQuestionnaire() {
    if (!this.questionnaireId) {
      this.snackBar.open('無法載入問卷：未提供問卷ID', '關閉', { duration: 3000 });
      return;
    }

    this.questionnaireService.getQuestionnaire(this.questionnaireId).subscribe({
      next: (questionnaire) => {
        if (!questionnaire) {
          this.snackBar.open('找不到問卷', '關閉', { duration: 3000 });
          this.router.navigate(['/questionnaires/list']);
          return;
        }

        this.questionnaire = questionnaire;
        this.initializeForm(questionnaire);
      },
      error: (error) => {
        console.error('載入問卷失敗:', error);
        this.snackBar.open('載入問卷失敗', '關閉', { duration: 3000 });
      }
    });
  }

  private initializeForm(questionnaire: Questionnaire) {
    const sectionsArray = this.answerForm.get('sections') as FormArray;
    
    // 清空現有的sections
    while (sectionsArray.length) {
      sectionsArray.removeAt(0);
    }

    // 添加每個部分
    questionnaire.sections.forEach(section => {
      const sectionGroup = this.fb.group({
        title: [section.title],
        questions: this.fb.array([])
      });

      const questionsArray = sectionGroup.get('questions') as FormArray;

      section.questions.forEach(question => {
        // 根據問題類型設置默認值
        let defaultValue: any = '';
        switch (question.type) {
          case 'checkbox':
            defaultValue = [];
            break;
          case 'radio':
            defaultValue = '';
            break;
          case 'rating':
            defaultValue = 0;
            break;
          default:
            defaultValue = '';
        }

        const questionGroup = this.fb.group({
          label: [question.label],
          type: [question.type],
          required: [question.required],
          options: [question.options],
          answer: [defaultValue, question.required ? [Validators.required] : []]
        });

        questionsArray.push(questionGroup);
      });

      sectionsArray.push(sectionGroup);
    });
  }

  get sections() {
    return this.answerForm.get('sections') as FormArray;
  }

  getQuestions(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('questions') as FormArray;
  }

  onSubmit() {
    if (this.isSubmitting) return;

    if (this.answerForm.invalid) {
      this.snackBar.open('請填寫所有必填欄位', '關閉', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const answers = this.prepareAnswers();
    
    // TODO: 實現提交答案的API調用
    console.log('提交的答案:', answers);
    
    this.snackBar.open('問卷提交成功！', '關閉', { duration: 3000 });
    this.router.navigate(['/questionnaires/list']);
  }

  private prepareAnswers() {
    const formValue = this.answerForm.value;
    return {
      questionnaireId: this.questionnaireId,
      sections: formValue.sections.map((section: any) => ({
        title: section.title,
        questions: section.questions.map((q: any) => ({
          label: q.label,
          type: q.type,
          answer: q.answer
        }))
      }))
    };
  }
}
