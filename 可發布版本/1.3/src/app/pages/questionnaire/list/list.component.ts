import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/@components/confirm-dialog/confirm-dialog.component';
import { QuestionnaireService } from '../../../shared/@services/questionnaire.service';
import { Questionnaire } from '../../../shared/@interface/question.models';

@Component({
  selector: 'app-questionnaire-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class QuestionnaireListComponent implements OnInit {
  questionnaires: Questionnaire[] = [];
  displayedColumns: string[] = ['index', 'title', 'status', 'responseCount', 'createdAt', 'actions'];
  isLoading = false;

  constructor(
    private questionnaireService: QuestionnaireService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadQuestionnaires();
  }

  loadQuestionnaires() {
    this.isLoading = true;
    this.questionnaireService.getQuestionnaires().subscribe({
      next: (data) => {
        this.questionnaires = data;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error loading questionnaires:', error);
        this.snackBar.open('載入問卷失敗', '關閉', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'accent';
      case 'PUBLISHED':
        return 'primary';
      default:
        return 'default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'DRAFT':
        return '草稿';
      case 'PUBLISHED':
        return '已發布';
        case 'CLOSED':
          return '已結束';
      default:
        return status;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  deleteQuestionnaire(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '確認刪除',
        message: '確定要刪除這份問卷嗎？此操作不可恢復。'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.questionnaireService.delete(id).subscribe({
          next: () => {
            this.loadQuestionnaires();
            this.snackBar.open('問卷已刪除', '關閉', { duration: 3000 });
          },
          error: (error) => {
            console.error('刪除問卷失敗:', error);
            this.snackBar.open('刪除問卷失敗', '關閉', { duration: 3000 });
          }
        });
      }
    });
  }

  publishQuestionnaire(id: number): void {
    // 先獲取問卷內容進行驗證
    this.questionnaireService.getQuestionnaire(id).subscribe({
      next: (questionnaire) => {
        // 驗證問卷內容
        const validationResult = this.validateQuestionnaire(questionnaire);
        if (!validationResult.isValid) {
          this.snackBar.open(`問卷驗證失敗: ${validationResult.message}`, '關閉', { duration: 3000 });
          return;
        }

        // 顯示確認對話框
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: '確認發布',
            message: '發布後的問卷將可以被填寫。確定要發布這份問卷嗎？',
            confirmText: '發布',
            cancelText: '取消'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.isLoading = true;
            this.questionnaireService.publish(id).subscribe({
              next: () => {
                this.loadQuestionnaires();
                this.snackBar.open('問卷已發布', '關閉', { duration: 3000 });
              },
              error: (error) => {
                console.error('發布問卷失敗:', error);
                this.snackBar.open('發布問卷失敗', '關閉', { duration: 3000 });
              },
              complete: () => {
                this.isLoading = false;
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('載入問卷失敗:', error);
        this.snackBar.open('載入問卷失敗', '關閉', { duration: 3000 });
      }
    });
  }

  unpublishQuestionnaire(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '確認取消發布',
        message: '取消發布後，問卷將無法被填寫。確定要取消發布嗎？',
        confirmText: '確定',
        cancelText: '取消'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.questionnaireService.unpublish(id).subscribe({
          next: () => {
            this.loadQuestionnaires();
            this.snackBar.open('問卷已取消發布', '關閉', { duration: 3000 });
          },
          error: (error) => {
            console.error('取消發布問卷失敗:', error);
            this.snackBar.open('取消發布問卷失敗', '關閉', { duration: 3000 });
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    });
  }

  copyQuestionnaire(id: number): void {
    this.isLoading = true;
    this.questionnaireService.copy(id).subscribe({
      next: (copiedQuestionnaire) => {
        this.loadQuestionnaires();
        this.snackBar.open('問卷已複製', '關閉', { duration: 3000 });
        // 導航到編輯新複製的問卷
        this.router.navigate(['/questionnaires/edit', copiedQuestionnaire.id]);
      },
      error: (error) => {
        console.error('複製問卷失敗:', error);
        let errorMessage = '複製問卷失敗';
        if (error.error?.message) {
          errorMessage += `: ${error.error.message}`;
        }
        this.snackBar.open(errorMessage, '關閉', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validateQuestionnaire(questionnaire: Questionnaire): { isValid: boolean; message: string } {
    // 檢查問卷標題
    if (!questionnaire.title?.trim()) {
      return { isValid: false, message: '問卷標題不能為空' };
    }

    // 檢查是否有區段
    if (!questionnaire.sections || questionnaire.sections.length === 0) {
      return { isValid: false, message: '問卷必須至少包含一個區段' };
    }

    // 檢查每個區段
    for (let i = 0; i < questionnaire.sections.length; i++) {
      const section = questionnaire.sections[i];
      
      // 檢查區段標題
      if (!section.title?.trim()) {
        return { isValid: false, message: `第 ${i + 1} 個區段的標題不能為空` };
      }

      // 檢查是否有問題
      if (!section.questions || section.questions.length === 0) {
        return { isValid: false, message: `第 ${i + 1} 個區段必須至少包含一個問題` };
      }

      // 檢查每個問題
      for (let j = 0; j < section.questions.length; j++) {
        const question = section.questions[j];

        // 檢查問題標題
        if (!question.label?.trim()) {
          return { isValid: false, message: `第 ${i + 1} 個區段的第 ${j + 1} 個問題的標題不能為空` };
        }

        // 檢查選擇題的選項
        if ((question.type === 'radio' || question.type === 'checkbox') && 
            (!question.options?.choices || Object.keys(question.options.choices).length === 0)) {
          return { isValid: false, message: `第 ${i + 1} 個區段的第 ${j + 1} 個問題必須包含至少一個選項` };
        }
      }
    }

    return { isValid: true, message: '' };
  }

  onRowClick(questionnaire: Questionnaire, event: Event) {
    // 如果點擊的是操作按鈕，不進行導航
    if (event?.target instanceof HTMLButtonElement || 
        event?.target instanceof HTMLAnchorElement ||
        (event?.target as HTMLElement)?.closest('button') ||
        (event?.target as HTMLElement)?.closest('a')) {
      return;
    }
    this.router.navigate(['/questionnaires/edit', questionnaire.id]);
  }
}