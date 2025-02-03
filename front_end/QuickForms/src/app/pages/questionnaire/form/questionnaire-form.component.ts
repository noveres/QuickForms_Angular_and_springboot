import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { TemplateService, Template } from '../../../shared/@services/template.service';
import { CdkDragDrop, moveItemInArray, CdkDragHandle, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PreviewDialogComponent } from './preview-dialog/preview-dialog.component';
import { QuestionnaireService } from '../services/questionnaire.service';

@Component({
  selector: 'app-questionnaire-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSelectModule,
    MatSliderModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    MatSnackBarModule,
    CdkDragHandle,
    CdkDrag,
    CdkDropList
  ],
  templateUrl: './questionnaire-form.component.html',
  styleUrl: './questionnaire-form.component.scss'
})
export class QuestionnaireFormComponent implements OnInit {
  questionnaireForm: FormGroup;
  template?: Template;
  questionnaireId: string | null = null;
  isEditMode = false;
  isSaving = false;
  isPublishing = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private questionnaireService: QuestionnaireService
  ) {
    this.questionnaireForm = this.fb.group({
      title: ['', Validators.required],
      sections: this.fb.array([])
    });
  }

  ngOnInit() {
    // 檢查是否為編輯模式
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.questionnaireId = params['id'];
        this.isEditMode = true;
        this.loadQuestionnaire();
      }
    });

    // 從 URL 參數中獲取 templateId
    this.route.queryParams.subscribe(params => {
      const templateId = params['templateId'];
      if (templateId) {
        this.loadTemplate(templateId);
      }
    });
  }

  private loadTemplate(templateId: string) {
    this.templateService.getTemplateById(templateId).subscribe(template => {
      if (template) {
        this.template = template;
        this.initializeFormWithTemplate(template);
      }
    });
  }

  private initializeFormWithTemplate(template: Template) {
    // 設置問卷標題
    this.questionnaireForm.patchValue({
      title: template.title
    });

    // 獲取 sections FormArray
    const sectionsArray = this.questionnaireForm.get('sections') as FormArray;

    // 清空現有的 sections
    while (sectionsArray.length) {
      sectionsArray.removeAt(0);
    }

    // 添加模板中的每個部分
    template.sections.forEach(section => {
      const sectionGroup = this.fb.group({
        title: [section.title, Validators.required],
        type: [section.type],
        questions: this.fb.array([])
      });

      const questionsArray = sectionGroup.get('questions') as FormArray;

      section.questions.forEach(question => {
        const questionGroup = this.fb.group({
          label: [question.label, Validators.required],
          type: [question.type],
          required: [question.required],
          options: [question.options || {}],
          value: ['']
        });

        // 根據問題類型添加驗證器
        if (question.required) {
          questionGroup.get('value')?.setValidators([Validators.required]);
        }

        questionsArray.push(questionGroup);
      });

      sectionsArray.push(sectionGroup);
    });
  }

  // 載入問卷數據
  private loadQuestionnaire() {
    if (!this.questionnaireId) return;

    this.questionnaireService.getQuestionnaire(this.questionnaireId)
      .subscribe({
        next: (questionnaire) => {
          if (questionnaire) {
            this.questionnaireForm.patchValue({
              title: questionnaire.title,
              sections: questionnaire.sections
            });
          }
        },
        error: (error) => {
          this.snackBar.open('載入問卷失敗', '關閉', { duration: 3000 });
          console.error('Error loading questionnaire:', error);
        }
      });
  }

  get sections() {
    return this.questionnaireForm.get('sections') as FormArray;
  }

  getQuestions(sectionIndex: number) {
    return (this.sections.at(sectionIndex).get('questions') as FormArray).controls;
  }

  addSection() {
    const section = this.fb.group({
      title: ['新區塊', Validators.required],
      type: ['default'],
      questions: this.fb.array([])
    });
    this.sections.push(section);
  }

  removeSection(index: number) {
    this.sections.removeAt(index);
  }

  addQuestion(sectionIndex: number) {
    const questionsArray = this.sections.at(sectionIndex).get('questions') as FormArray;
    const question = this.fb.group({
      label: ['新問題', Validators.required],
      type: ['short-text'],
      required: [false],
      options: [{}],
      value: ['']
    });
    questionsArray.push(question);
  }

  removeQuestion(sectionIndex: number, questionIndex: number) {
    const questionsArray = this.sections.at(sectionIndex).get('questions') as FormArray;
    questionsArray.removeAt(questionIndex);
  }

  updateQuestionType(sectionIndex: number, questionIndex: number, type: string) {
    const question = (this.sections.at(sectionIndex).get('questions') as FormArray).at(questionIndex);
    question.patchValue({ type });
    
    // 根據類型設置默認選項
    let options = {};
    switch (type) {
      case 'rating':
        options = { max: 5 };
        break;
      case 'radio':
      case 'checkbox':
      case 'select':
        options = { 
          choices: ['選項1', '選項2', '選項3'],
          allowOther: false // 是否允許其他選項
        };
        break;
      default:
        options = {};
    }
    
    // 重置值
    if (type === 'checkbox') {
      question.patchValue({ value: [], options });
    } else {
      question.patchValue({ value: '', options });
    }
  }

  isOptionSelected(question: AbstractControl, choice: string): boolean {
    const values = question.get('value')?.value || [];
    return Array.isArray(values) && values.includes(choice);
  }

  toggleOption(question: AbstractControl, choice: string, checked: boolean) {
    const values = [...(question.get('value')?.value || [])];
    if (checked && !values.includes(choice)) {
      values.push(choice);
    } else if (!checked) {
      const index = values.indexOf(choice);
      if (index > -1) {
        values.splice(index, 1);
      }
    }
    question.patchValue({ value: values });
  }

  isOtherOptionSelected(question: AbstractControl): boolean {
    return question.get('otherValue')?.value !== '';
  }

  toggleOtherOption(question: AbstractControl, checked: boolean) {
    if (!checked) {
      question.patchValue({ otherValue: '' });
    }
  }

  addOption(question: AbstractControl) {
    const options = question.get('options')?.value || {};
    const choices = [...(options.choices || [])];
    const newOption = `選項${choices.length + 1}`;
    choices.push(newOption);
    question.patchValue({ options: { ...options, choices } });
  }

  removeOption(question: AbstractControl, optionIndex: number) {
    const options = question.get('options')?.value || {};
    const choices = [...(options.choices || [])];
    choices.splice(optionIndex, 1);
    question.patchValue({ options: { ...options, choices } });
  }

  updateOption(question: AbstractControl, optionIndex: number, newValue: string) {
    const options = question.get('options')?.value || {};
    const choices = [...(options.choices || [])];
    choices[optionIndex] = newValue;
    question.patchValue({ options: { ...options, choices } });
  }

  handleOptionInput(question: AbstractControl, optionIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.updateOption(question, optionIndex, input.value);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  dropQuestion(sectionIndex: number, event: CdkDragDrop<any[]>) {
    const questionsArray = this.sections.at(sectionIndex).get('questions') as FormArray;
    moveItemInArray(questionsArray.controls, event.previousIndex, event.currentIndex);
  }

  dropOption(question: AbstractControl, event: CdkDragDrop<string[]>) {
    const options = question.get('options')?.value || {};
    const choices = [...(options.choices || [])];
    moveItemInArray(choices, event.previousIndex, event.currentIndex);
    question.patchValue({ options: { ...options, choices } });
  }

  setRating(question: AbstractControl, rating: number) {
    question.patchValue({ value: rating });
  }

  previewQuestionnaire() {
    const formValue = this.questionnaireForm.value;
    this.dialog.open(PreviewDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: formValue,
      autoFocus: false
    });
  }

  // 保存為草稿
  saveDraft() {
    if (this.questionnaireForm.invalid) {
      this.snackBar.open('請填寫必要欄位', '關閉', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    const questionnaireData = this.questionnaireForm.value;

    const saveOperation = this.isEditMode && this.questionnaireId
      ? this.questionnaireService.updateDraft(this.questionnaireId, questionnaireData)
      : this.questionnaireService.saveDraft(questionnaireData);

    saveOperation.subscribe({
      next: (response) => {
        this.isSaving = false;
        if (!this.questionnaireId) {
          this.questionnaireId = response.id;
          this.isEditMode = true;
          // 更新 URL
          this.router.navigate(['../', response.id], { relativeTo: this.route });
        }
        this.snackBar.open('保存成功', '關閉', { duration: 3000 });
      },
      error: (error) => {
        this.isSaving = false;
        this.snackBar.open('保存失敗', '關閉', { duration: 3000 });
        console.error('Error saving questionnaire:', error);
      }
    });
  }

  // 發布問卷
  publish() {
    if (!this.questionnaireId) {
      this.snackBar.open('請先保存問卷', '關閉', { duration: 3000 });
      return;
    }

    this.isPublishing = true;
    this.questionnaireService.publish(this.questionnaireId)
      .subscribe({
        next: () => {
          this.isPublishing = false;
          this.snackBar.open('發布成功', '關閉', { duration: 3000 });
          // 導航到問卷列表
          this.router.navigate(['/questionnaires']);
        },
        error: (error) => {
          this.isPublishing = false;
          this.snackBar.open('發布失敗', '關閉', { duration: 3000 });
          console.error('Error publishing questionnaire:', error);
        }
      });
  }

  // 分享問卷
  share() {
    if (!this.questionnaireId) {
      this.snackBar.open('請先保存問卷', '關閉', { duration: 3000 });
      return;
    }

    const shareLink = this.questionnaireService.getShareLink(this.questionnaireId);
    navigator.clipboard.writeText(shareLink).then(() => {
      this.snackBar.open('分享連結已複製到剪貼簿', '關閉', { duration: 3000 });
    });
  }

  onSubmit() {
    if (this.questionnaireForm.valid) {
      console.log(this.questionnaireForm.value);
      // TODO: 保存問卷
      this.router.navigate(['/questionnaires/list']);
    }
  }

  cancel() {
    this.router.navigate(['/questionnaires/list']);
  }
}