import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TemplatePreviewDialogComponent } from '../../../shared/components/template-preview-dialog/template-preview-dialog.component';
import { QuestionnaireListComponent } from '../list/list.component';

interface Template {
  id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    QuestionnaireListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  templates: Template[] = [
    {
      id: '1',
      title: '客戶滿意度調查',
      description: '收集客戶反饋和建議'
    },
    {
      id: '2',
      title: '活動報名表',
      description: '活動和會議報名'
    },
    {
      id: '3',
      title: '員工考核表',
      description: '定期績效評估'
    }
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // 可以從服務加載模板數據
  }

  createBlank() {
    this.router.navigate(['/questionnaires/new']);
  }

  previewTemplate(template: Template) {
    const dialogRef = this.dialog.open(TemplatePreviewDialogComponent, {
      data: { template },
      maxWidth: '90vw',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.copyTemplate(result);
      }
    });
  }

  copyTemplate(template: Template) {
    this.router.navigate(['/questionnaires/new'], { 
      queryParams: { templateId: template.id }
    });
  }
}