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
    private router: Router
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

  deleteQuestionnaire(id: number) {
    if (confirm('確定要刪除這份問卷嗎？')) {
      this.questionnaireService.delete(id.toString()).subscribe({
        next: () => {
          this.snackBar.open('刪除成功', '關閉', { duration: 3000 });
          this.loadQuestionnaires();
        },
        error: (error: Error) => {
          console.error('Error deleting questionnaire:', error);
          this.snackBar.open('刪除失敗', '關閉', { duration: 3000 });
        }
      });
    }
  }

  copyQuestionnaire(id: number) {
    this.questionnaireService.copy(id.toString()).subscribe({
      next: (newId) => {
        this.snackBar.open('複製成功', '關閉', { duration: 3000 });
        this.loadQuestionnaires();
      },
      error: (error: Error) => {
        console.error('Error copying questionnaire:', error);
        this.snackBar.open('複製失敗', '關閉', { duration: 3000 });
      }
    });
  }

  publishQuestionnaire(id: number) {
    this.questionnaireService.publish(id.toString()).subscribe({
      next: () => {
        this.snackBar.open('發布成功', '關閉', { duration: 3000 });
        this.loadQuestionnaires();
      },
      error: (error: Error) => {
        console.error('Error publishing questionnaire:', error);
        this.snackBar.open('發布失敗', '關閉', { duration: 3000 });
      }
    });
  }

  unpublishQuestionnaire(id: number) {
    this.questionnaireService.unpublish(id.toString()).subscribe({
      next: () => {
        this.snackBar.open('取消發布成功', '關閉', { duration: 3000 });
        this.loadQuestionnaires();
      },
      error: (error: Error) => {
        console.error('Error unpublishing questionnaire:', error);
        this.snackBar.open('取消發布失敗', '關閉', { duration: 3000 });
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