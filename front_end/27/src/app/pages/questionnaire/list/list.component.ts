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
    this.questionnaireService.publish(id).subscribe({
      next: () => {
        this.loadQuestionnaires();
        this.snackBar.open('問卷已發布', '關閉', { duration: 3000 });
      },
      error: (error) => {
        console.error('發布問卷失敗:', error);
        this.snackBar.open('發布問卷失敗', '關閉', { duration: 3000 });
      }
    });
  }

  unpublishQuestionnaire(id: number): void {
    this.questionnaireService.unpublish(id).subscribe({
      next: () => {
        this.loadQuestionnaires();
        this.snackBar.open('問卷已取消發布', '關閉', { duration: 3000 });
      },
      error: (error) => {
        console.error('取消發布問卷失敗:', error);
        this.snackBar.open('取消發布問卷失敗', '關閉', { duration: 3000 });
      }
    });
  }

  copyQuestionnaire(id: number): void {
    this.questionnaireService.copy(id).subscribe({
      next: () => {
        this.loadQuestionnaires();
        this.snackBar.open('問卷已複製', '關閉', { duration: 3000 });
      },
      error: (error) => {
        console.error('複製問卷失敗:', error);
        this.snackBar.open('複製問卷失敗', '關閉', { duration: 3000 });
      }
    });
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