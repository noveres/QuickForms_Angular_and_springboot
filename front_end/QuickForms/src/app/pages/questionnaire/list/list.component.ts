import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from '../../../shared/@services/questionnaire.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [  
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class QuestionnaireListComponent implements OnInit {
  questionnaires: any[] = [];
  displayedColumns: string[] = ['title', 'actions'];

  constructor(
    private questionnaireService: QuestionnaireService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadQuestionnaires();
  }

  loadQuestionnaires() {
    this.questionnaireService.getQuestionnaires().subscribe(
      data => {
        this.questionnaires = data;
        console.log('獲取到的問卷數據:', data);
      },
      error => {
        console.error('加載問卷失敗:', error);
      }
    );
  }

  createNew() {
    this.router.navigate(['/questionnaires/new']);
  }

  edit(id: string) {
    this.router.navigate([`/questionnaires/edit/${id}`]);
  }

  copy(id: string) {
    this.questionnaireService.copy(id).subscribe(newId => {
      this.loadQuestionnaires(); // 重新加載列表
    });
  }

  stats(id: string) {
    this.router.navigate([`/questionnaires/stats/${id}`]);
  }

  share(id: string) {
    // TODO: 實現分享功能
    console.log('分享問卷:', id);
  }

  delete(id: string) {
    if (confirm('確定要刪除這份問卷嗎？')) {
      // TODO: 實現刪除功能
      console.log('刪除問卷:', id);
    }
  }
}