import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface Template {
  id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-template-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './template-preview-dialog.component.html',
  styleUrl: './template-preview-dialog.component.scss'
})
export class TemplatePreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TemplatePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { template: Template }
  ) {}

  // 示例問題列表
  questions = [
    {
      type: 'text',
      title: '基本信息',
      questions: [
        { label: '姓名', type: 'short-text', required: true },
        { label: '電子郵件', type: 'email', required: true },
        { label: '聯繫電話', type: 'phone', required: false }
      ]
    },
    {
      type: 'rating',
      title: '評分項目',
      questions: [
        { label: '產品質量滿意度', type: 'rating', max: 5, required: true },
        { label: '服務態度滿意度', type: 'rating', max: 5, required: true }
      ]
    },
    {
      type: 'text',
      title: '詳細反饋',
      questions: [
        { label: '您對我們的產品或服務有什麼建議？', type: 'long-text', required: false }
      ]
    }
  ];

  close() {
    this.dialogRef.close();
  }

  useTemplate() {
    this.dialogRef.close(this.data.template);
  }
}
