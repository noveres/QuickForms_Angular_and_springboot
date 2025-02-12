import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-container">
      <div mat-dialog-title class="dialog-header">
        <div class="title-section">
          <h2>{{ data.title || '預覽問卷' }}</h2>
        </div>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <mat-dialog-content class="dialog-content">
        <div class="preview-container">
          @for (section of data.sections; track $index) {
            <div class="question-section">
              <h3>{{ section.title }}</h3>
              
              @for (question of section.questions; track $index) {
                <div class="question-item">
                  <div class="question-header">
                    <span class="question-label">{{ question.label }}</span>
                    @if (question.required) {
                      <span class="required-mark">*</span>
                    }
                  </div>

                  @switch (question.type) {
                    @case ('short-text') {
                      <input type="text" class="preview-input" disabled placeholder="短文本回答">
                    }
                    @case ('long-text') {
                      <textarea class="preview-input" disabled placeholder="長文本回答"></textarea>
                    }
                    @case ('email') {
                      <input type="email" class="preview-input" disabled placeholder="example@email.com">
                    }
                    @case ('phone') {
                      <input type="tel" class="preview-input" disabled placeholder="請輸入電話號碼">
                    }
                    @case ('rating') {
                      <div class="rating-preview">
                        @for (star of [1,2,3,4,5]; track star) {
                          <mat-icon class="star-icon">star_border</mat-icon>
                        }
                      </div>
                    }
                    @case ('radio') {
                      <div class="answer-frame" [class.required]="question.required">
                        <div class="radio-display">
                          @for (choice of question.options?.choices | keyvalue; track choice.key) {
                            <div class="option-display">
                              <div class="radio-circle"></div>
                              <span>{{ choice.value }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    }
                    @case ('checkbox') {
                      <div class="answer-frame" [class.required]="question.required">
                        <div class="checkbox-display">
                          @for (choice of question.options?.choices | keyvalue; track choice.key) {
                            <div class="option-display">
                              <div class="checkbox-square"></div>
                              <span>{{ choice.value }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  }
                </div>
              }
            </div>

            @if (!$last) {
              <mat-divider class="section-divider"></mat-divider>
            }
          }
        </div>
      </mat-dialog-content>

      <mat-divider></mat-divider>

      <mat-dialog-actions align="end">
        <button mat-button (click)="close()">關閉</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .dialog-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 24px;
      margin: 0;
      flex: 0 0 auto;

      .title-section {
        h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.87);
        }
      }
    }

    mat-dialog-content.dialog-content {
      margin: 0;
      padding: 24px;
      overflow-y: auto;
      flex: 1 1 auto;
      max-height: unset;
    }

    .preview-container {
      .question-section {
        margin-bottom: 32px;

        h3 {
          margin: 0 0 16px;
          font-size: 18px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.87);
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .question-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .question-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .question-label {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.87);
        }

        .required-mark {
          color: #f44336;
          margin-left: 4px;
        }
      }
    }

    .preview-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      background-color: #f5f5f5;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      cursor: not-allowed;
      box-sizing: border-box;

      &:disabled {
        opacity: 0.7;
      }
    }

    textarea.preview-input {
      min-height: 100px;
      resize: vertical;
    }

    .rating-preview {
      display: flex;
      gap: 8px;

      .star-icon {
        color: #5c6bc0;
        opacity: 0.7;
        cursor: not-allowed;
        font-size: 24px;
      }
    }

    .answer-frame {
      padding: 16px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      background-color: #f5f5f5;
    }

    .answer-frame.required {
      border-color: #f44336;
    }

    .radio-display, .checkbox-display {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .option-display {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .radio-circle, .checkbox-square {
      width: 20px;
      height: 20px;
      border: 1px solid rgba(0, 0, 0, 0.38);
      border-radius: 50%;
      background-color: #f5f5f5;
    }

    .radio-circle {
      border-radius: 50%;
    }

    .checkbox-square {
      border-radius: 4px;
    }

    .section-divider {
      margin: 32px 0;

      &:last-child {
        display: none;
      }
    }

    mat-dialog-actions {
      flex: 0 0 auto;
      margin: 0;
      padding: 12px 24px;
      min-height: unset;
    }
  `]
})
export class PreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // 設置對話框的大小
    dialogRef.updateSize('80vw', '90vh');
  }

  close() {
    this.dialogRef.close();
  }
}
