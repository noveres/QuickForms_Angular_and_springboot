import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';
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
import { QuestionnaireService } from '../../../shared/@services/questionnaire.service';
import { 
  Questionnaire, 
  QuestionnaireContent, 
  Section,
  Question,
  QuestionnaireSettings,
} from '../../../shared/@interface/question.models';

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
    CdkDrag,
    CdkDropList,
    RouterLink
  ],
  templateUrl: './questionnaire-form.component.html',
  styleUrl: './questionnaire-form.component.scss'
})
export class QuestionnaireFormComponent implements OnInit, OnDestroy {
  questionnaireForm: FormGroup;
  template?: Template;
  questionnaireId: number | null = null;
  isEditMode = false;
  isSaving = false;
  isPublishing = false;
  private autoSaveInterval: any;
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30秒

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
      description: [''],
      sections: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // 監聽路由參數變化
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      if (params['id']) {
        console.log('Found questionnaire ID in params:', params['id']);
        this.questionnaireId = parseInt(params['id'], 10);
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

    // 設置自動保存
    this.setupAutoSave();
  }

  ngOnDestroy() {
    // 清除自動保存定時器
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  private loadTemplate(templateId: string) {
    const numericId = parseInt(templateId, 10);
    this.templateService.getTemplateById(numericId).subscribe(template => {
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
        // 根據問題類型設置默認值
        let defaultValue: any = '';
        switch (question.type) {
          case 'rating':
            defaultValue = 0;
            break;
          case 'checkbox':
            defaultValue = [];
            break;
          case 'radio':
          case 'select':
            defaultValue = null;
            break;
          default:
            defaultValue = '';
        }

        const questionGroup = this.fb.group({
          label: [question.label, Validators.required],
          type: [question.type, Validators.required],
          required: [question.required],
          options: this.fb.group({
            max: [question.options?.max || 5],
            choices: [question.options?.choices || {}],
            placeholder: [question.options?.placeholder || ''],
            allowOther: [question.options?.allowOther || false],
            multiple: [question.options?.multiple || false]
          }),
          value: [defaultValue]
        });

        questionsArray.push(questionGroup);
      });

      sectionsArray.push(sectionGroup);
    });
  }

  // 載入問卷數據
  private loadQuestionnaire() {
    if (!this.questionnaireId) {
      console.error('No questionnaire ID provided');
      this.snackBar.open('無法載入問卷：未提供問卷ID', '關閉', { duration: 3000 });
      return;
    }

    console.log('Loading questionnaire with ID:', this.questionnaireId);
    this.questionnaireService.getQuestionnaire(this.questionnaireId).subscribe({
      next: (questionnaire: Questionnaire | null) => {
        console.log('Received questionnaire:', questionnaire);
        
        if (!questionnaire) {
          console.error('Questionnaire not found');
          this.snackBar.open('找不到問卷', '關閉', { duration: 3000 });
          this.router.navigate(['/questionnaires/list']);
          return;
        }

        try {
          // 設置問卷標題
          this.questionnaireForm.patchValue({
            title: questionnaire.title,
            description: questionnaire.description || ''
          });

          // 獲取 sections FormArray
          const sectionsArray = this.questionnaireForm.get('sections') as FormArray;
          console.log('Current sections array:', sectionsArray.value);

          // 清空現有的 sections
          while (sectionsArray.length) {
            sectionsArray.removeAt(0);
          }

          // 解析問卷內容
          let sections: Section[] = [];
          let settings = {};

          if (typeof questionnaire.content === 'string') {
            try {
              const content = JSON.parse(questionnaire.content);
              sections = content.sections || [];
              settings = content.settings || {};
              console.log('Parsed content:', { sections, settings });
            } catch (error) {
              console.error('Error parsing questionnaire content:', error);
              sections = questionnaire.sections || [];
              settings = questionnaire.settings || {};
            }
          } else {
            sections = questionnaire.sections || [];
            settings = questionnaire.settings || {};
          }

          console.log('Processing sections:', sections);

          // 添加每個部分
          sections.forEach((section: Section, index: number) => {
            console.log(`Processing section ${index}:`, section);
            const sectionGroup = this.fb.group({
              title: [section.title, Validators.required],
              type: [section.type],
              questions: this.fb.array([])
            });

            const questionsArray = sectionGroup.get('questions') as FormArray;

            section.questions.forEach((question: Question, qIndex: number) => {
              console.log(`Processing question ${qIndex} in section ${index}:`, question);
              
              // 根據問題類型設置默認值
              let defaultValue: any = '';
              switch (question.type) {
                case 'rating':
                  defaultValue = question.value || 0;
                  break;
              case 'checkbox':
                  defaultValue = question.value || [];
                  break;
                case 'radio':
                case 'select':
                  defaultValue = question.value || null;
                  break;
                default:
                  defaultValue = question.value || '';
              }

              const questionGroup = this.fb.group({
                label: [question.label, Validators.required],
                type: [question.type, Validators.required],
                required: [question.required],
                options: this.fb.group({
                  max: [question.options?.max || 5],
                  choices: [question.options?.choices || {}],
                  placeholder: [question.options?.placeholder || ''],
                  allowOther: [question.options?.allowOther || false],
                  multiple: [question.options?.multiple || false]
                }),
                value: [defaultValue]
              });

              questionsArray.push(questionGroup);
            });

            sectionsArray.push(sectionGroup);
          });

          console.log('Final form value:', this.questionnaireForm.value);

          // 設置自動保存
          this.setupAutoSave();
        } catch (error) {
          console.error('Error initializing form:', error);
          this.snackBar.open('初始化問卷時發生錯誤', '關閉', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Error loading questionnaire:', error);
        this.snackBar.open('載入問卷失敗', '關閉', { duration: 3000 });
      }
    });
  }

  get sections() {
    return this.questionnaireForm.get('sections') as FormArray;
  }

  getControl(control: AbstractControl, path: string): FormControl {
    const foundControl = control.get(path);
    if (!foundControl) {
      throw new Error(`Control ${path} not found`);
    }
    return foundControl as FormControl;
  }

  getNestedControl(control: AbstractControl, path: string): AbstractControl {
    const foundControl = control.get(path);
    if (!foundControl) {
      throw new Error(`Control ${path} not found`);
    }
    return foundControl;
  }

  getQuestions(sectionIndex: number): AbstractControl[] {
    const section = this.sections.at(sectionIndex);
    if (!section) {
      return [];
    }
    const questionsArray = section.get('questions') as FormArray;
    return questionsArray.controls;
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
      label: ['', Validators.required],
      type: ['short-text'],
      required: [false],
      options: this.fb.group({
        max: [5],
        choices: [{}]
      }),
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
          choices: {},
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
    const value = question.get('value')?.value;
    const type = question.get('type')?.value;
    
    if (type === 'checkbox') {
      return Array.isArray(value) && value.includes(choice);
    } else {
      return value === choice;
    }
  }

  toggleOption(question: AbstractControl, choice: string, checked: boolean): void {
    const valueControl = question.get('value');
    if (!valueControl) return;

    const type = question.get('type')?.value;
    if (type === 'checkbox') {
      let values = (valueControl.value || []) as string[];
      if (checked) {
        values = [...values, choice];
      } else {
        values = values.filter(v => v !== choice);
      }
      valueControl.setValue(values);
    } else if (type === 'radio' || type === 'select') {
      valueControl.setValue(checked ? choice : null);
    }

    valueControl.markAsDirty();
    valueControl.updateValueAndValidity();
  }

  isOtherOptionSelected(question: AbstractControl): boolean {
    return question.get('otherValue')?.value !== '';
  }

  toggleOtherOption(question: AbstractControl, checked: boolean) {
    if (!checked) {
      question.patchValue({ otherValue: '' });
    }
  }

  addOption(question: AbstractControl): void {
    const choices: Record<string, string> = this.getNestedControl(question, 'options.choices').value || {};
    const newKey = Object.keys(choices).length.toString();
    const newChoices = {
      ...choices,
      [newKey]: `選項${Object.keys(choices).length + 1}`
    };
    this.getNestedControl(question, 'options.choices').setValue(newChoices);
  }

  removeOption(question: AbstractControl, index: number): void {
    const choices: Record<string, string> = { ...this.getNestedControl(question, 'options.choices').value };
    delete choices[index.toString()];
    // Reindex the remaining choices
    const newChoices: Record<string, string> = {};
    Object.values(choices).forEach((value, i) => {
      newChoices[i.toString()] = value;
    });
    this.getNestedControl(question, 'options.choices').setValue(newChoices);
  }

  handleOptionInput(question: AbstractControl, index: number, event: any): void {
    const choices: Record<string, string> = { ...this.getNestedControl(question, 'options.choices').value };
    choices[index.toString()] = event.target.value;
    this.getNestedControl(question, 'options.choices').setValue(choices);
  }

  dropOption(question: AbstractControl, event: CdkDragDrop<string[]>): void {
    const choices: Record<string, string> = { ...this.getNestedControl(question, 'options.choices').value };
    const choicesArray = Object.entries(choices);
    moveItemInArray(choicesArray, event.previousIndex, event.currentIndex);
    const newChoices: Record<string, string> = {};
    choicesArray.forEach(([_, value], index) => {
      newChoices[index.toString()] = value;
    });
    this.getNestedControl(question, 'options.choices').setValue(newChoices);
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

  setRating(question: AbstractControl, rating: number): void {
    const valueControl = question.get('value');
    if (valueControl) {
      valueControl.setValue(rating);
      valueControl.markAsDirty();
      valueControl.updateValueAndValidity();
    }
  }

  previewQuestionnaire() {
    const formValue = this.questionnaireForm.value;
    const previewData = {
      title: formValue.title,
      description: formValue.description || '',
      sections: formValue.sections.map((section: any) => ({
        title: section.title,
        type: section.type || 'text',
        questions: section.questions.map((q: any) => ({
          label: q.label,
          type: q.type,
          required: q.required,
          options: q.options ? {
            max: q.options.max,
            choices: q.options.choices,
            placeholder: q.options.placeholder,
            allowOther: q.options.allowOther,
            multiple: q.options.multiple
          } : undefined
        }))
      }))
    };

    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '80%',
      maxWidth: '800px',
      data: previewData
    });
  }

  // 設置自動保存
  private setupAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      this.autoSave();
    }, this.AUTO_SAVE_INTERVAL);

    // 監聽表單變化
    this.questionnaireForm.valueChanges.subscribe(() => {
      if (this.questionnaireForm.dirty) {
        this.autoSave();
      }
    });
  }

  // 自動保存
  private autoSave(): void {
    if (this.questionnaireForm.valid && this.questionnaireForm.dirty) {
      const formData = this.questionnaireForm.value;

      // 保存到服務器
      if (this.questionnaireId) {
        this.questionnaireService.autoSaveDraft(this.questionnaireId, formData)
          .subscribe({
            next: () => {
              console.log('自動保存成功');
              this.questionnaireForm.markAsPristine();
            },
            error: (error: Error) => {
              console.error('自動保存失敗:', error);
            }
          });
      }
    }
  }

  // 過濾不需要的字段
  private filterQuestionnaireData(data: any): any {
    const filtered = { ...data };
    
    if (filtered.sections) {
      filtered.sections = filtered.sections.map((section: any) => {
        const filteredSection = { ...section };
        if (filteredSection.questions) {
          filteredSection.questions = filteredSection.questions.map((question: any) => {
            const filteredQuestion = { ...question };
            if (filteredQuestion.options) {
              // 移除 allowOther 字段
              const { allowOther, ...filteredOptions } = filteredQuestion.options;
              filteredQuestion.options = filteredOptions;
            }
            return filteredQuestion;
          });
        }
        return filteredSection;
      });
    }
    
    return filtered;
  }

  // 保存草稿
  saveDraft(): void {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    const formValue = this.questionnaireForm.value;
    console.log('Form value:', formValue);

    // 準備問卷數據，確保每個問題的選項格式正確
    const sections = formValue.sections.map((section: any) => ({
      title: section.title,
      type: section.type || 'default',
      questions: section.questions.map((q: any) => {
        const question: any = {
          label: q.label,
          type: q.type,
          required: q.required,
          value: ''  // 添加空的 value 字段
        };

        // 根據問題類型處理選項
        if (q.type === 'rating') {
          question.options = {
            choices: {
              '1': '非常不滿意',
              '2': '不滿意',
              '3': '一般',
              '4': '滿意',
              '5': '非常滿意'
            }
          };
        } else if (q.type === 'radio' || q.type === 'checkbox' || q.type === 'select') {
          // 確保選項格式正確
          question.options = {
            choices: q.options?.choices || {}
          };
        } else if (q.type === 'text' || q.type === 'short-text' || q.type === 'long-text' || q.type === 'email' || q.type === 'phone') {
          question.options = {
            placeholder: q.options?.placeholder || ''
          };
        }

        return question;
      })
    }));

    const questionnaireData: Partial<Questionnaire> = {
      title: formValue.title,
      description: formValue.description || '',
      status: 'DRAFT',
      sections: sections,
      settings: {
        allowAnonymous: true,
        requireLogin: false
      }
    };

    if (this.questionnaireId) {
      questionnaireData.id = this.questionnaireId;
    }

    console.log('Final questionnaire data:', JSON.stringify(questionnaireData, null, 2));
    
    const saveOperation = this.isEditMode && this.questionnaireId
      ? this.questionnaireService.updateQuestionnaire(this.questionnaireId, questionnaireData)
      : this.questionnaireService.createQuestionnaire(questionnaireData);

    saveOperation.subscribe({
      next: (response: Questionnaire) => {
        this.isSaving = false;
        if (!this.questionnaireId && response.id) {
          this.questionnaireId = response.id;
          this.isEditMode = true;
          this.router.navigate(['/questionnaires/edit', response.id], { replaceUrl: true });
        }
        this.snackBar.open('草稿已保存', '關閉', { duration: 3000 });
        this.questionnaireForm.markAsPristine();
      },
      error: (error) => {
        this.isSaving = false;
        console.error('保存草稿失敗:', error);
        this.snackBar.open('保存草稿失敗', '關閉', { duration: 3000 });
      }
    });
  }

  // 檢查表單是否有效
  isFormValid(): boolean {
    // 檢查標題
    if (!this.questionnaireForm.get('title')?.value?.trim()) {
      return false;
    }

    // 檢查每個區塊
    const sections = this.questionnaireForm.get('sections') as FormArray;
    if (!sections || sections.length === 0) {
      return true; // 允許沒有區塊
    }

    for (let i = 0; i < sections.length; i++) {
      const section = sections.at(i);
      const questions = section.get('questions') as FormArray;

      // 檢查區塊標題
      if (!section.get('title')?.value?.trim()) {
        return false;
      }

      // 檢查問題
      for (let j = 0; j < questions.length; j++) {
        const question = questions.at(j);
        if (!question.get('label')?.value?.trim()) {
          return false;
        }
      }
    }

    return true;
  }

  // 獲取表單錯誤信息
  getFormErrors(): string[] {
    const errors: string[] = [];

    // 檢查標題
    if (!this.questionnaireForm.get('title')?.value?.trim()) {
      errors.push('請填寫問卷標題');
    }

    // 檢查每個區塊
    const sections = this.questionnaireForm.get('sections') as FormArray;
    if (sections) {
      sections.controls.forEach((section, sectionIndex) => {
        if (!section.get('title')?.value?.trim()) {
          errors.push(`請填寫第 ${sectionIndex + 1} 個區塊的標題`);
        }

        const questions = section.get('questions') as FormArray;
        questions.controls.forEach((question, questionIndex) => {
          if (!question.get('label')?.value?.trim()) {
            errors.push(`請填寫第 ${sectionIndex + 1} 個區塊中第 ${questionIndex + 1} 個問題的標題`);
          }
        });
      });
    }

    return errors;
  }

  // 提交問卷
  onSubmit(): void {
    if (this.questionnaireForm.valid) {
      const formValue = this.questionnaireForm.value;
      
      if (this.isEditMode && this.questionnaireId) {
        // 更新現有問卷
        this.questionnaireService.updateQuestionnaire(this.questionnaireId, formValue)
          .subscribe({
            next: (response) => {
              this.snackBar.open('問卷已更新', '關閉', { duration: 3000 });
              this.router.navigate(['/questionnaires']);
            },
            error: (error) => {
              console.error('更新問卷失敗:', error);
              this.snackBar.open('更新問卷失敗', '關閉', { duration: 3000 });
            }
          });
      } else {
        // 創建新問卷
        this.questionnaireService.createQuestionnaire(formValue)
          .subscribe({
            next: (response) => {
              this.snackBar.open('問卷已創建', '關閉', { duration: 3000 });
              this.router.navigate(['/questionnaires']);
            },
            error: (error) => {
              console.error('創建問卷失敗:', error);
              this.snackBar.open('創建問卷失敗', '關閉', { duration: 3000 });
            }
          });
      }
    } else {
      this.snackBar.open('請填寫所有必填欄位', '關閉', { duration: 3000 });
    }
  }

  async share() {
    try {
      // 優先使用路由參數中的ID
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) {
        this.snackBar.open('無法獲取問卷ID', '關閉', { duration: 2000 });
        return;
      }

      const url = `${window.location.origin}/questionnaires/answer/${id}`;
      await navigator.clipboard.writeText(url);
      this.snackBar.open('已複製問卷連結！', '關閉', { duration: 2000 });

    } catch (error) {
      this.snackBar.open('複製失敗，請重試', '關閉', { duration: 2000 });
    }
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
        },
        error: (error) => {
          this.isPublishing = false;
          this.snackBar.open('發布失敗', '關閉', { duration: 3000 });
          console.error('發布問卷失敗:', error);
        }
      });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}