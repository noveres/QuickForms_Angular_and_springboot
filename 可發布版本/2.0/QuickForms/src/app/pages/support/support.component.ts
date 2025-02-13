import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <div class="support-container">
      <mat-card class="support-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>support_agent</mat-icon>
            客服中心
          </mat-card-title>
          <mat-card-subtitle>
            我們很樂意為您提供協助
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="contact-methods">
            <div class="contact-item">
              <mat-icon>phone</mat-icon>
              <div class="contact-details">
                <h3>電話支援</h3>
                <p>週一至週五 9:00-18:00</p>
                <p class="highlight">0800-123-456</p>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="contact-item">
              <mat-icon>email</mat-icon>
              <div class="contact-details">
                <h3>電子郵件</h3>
                <p>24小時內回覆</p>
                <p class="highlight">support&#64;quickforms.com</p>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="contact-item">
              <mat-icon>chat</mat-icon>
              <div class="contact-details">
                <h3>線上客服</h3>
                <p>即時對話服務</p>
                <button mat-raised-button color="primary">
                  開始對話
                </button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="faq-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>help</mat-icon>
            常見問題
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="faq-item" *ngFor="let faq of faqs">
            <h3>{{ faq.question }}</h3>
            <p>{{ faq.answer }}</p>
            <mat-divider></mat-divider>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .support-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .support-card, .faq-card {
      margin-bottom: 24px;
    }

    mat-card-header {
      margin-bottom: 24px;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 24px;

        mat-icon {
          color: #1976d2;
        }
      }
    }

    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 0;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: #1976d2;
      }

      .contact-details {
        h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }

        p {
          margin: 0 0 4px 0;
          color: rgba(0,0,0,.6);
        }

        .highlight {
          color: #1976d2;
          font-weight: 500;
          font-size: 16px;
        }
      }
    }

    .faq-item {
      padding: 16px 0;

      h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 500;
      }

      p {
        margin: 0 0 16px 0;
        color: rgba(0,0,0,.6);
      }

      &:last-child {
        mat-divider {
          display: none;
        }
      }
    }

    @media (max-width: 600px) {
      .support-container {
        margin: 0 auto;
      }

      .contact-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class SupportComponent {
  faqs = [
    {
      question: '如何創建新的問卷？',
      answer: '點擊首頁的「新增問卷」按鈕，選擇適合的模板或從頭開始創建。'
    },
    {
      question: '如何分享問卷給受訪者？',
      answer: '在問卷編輯頁面點擊「分享」按鈕，系統會自動生成分享連結。'
    },
    {
      question: '如何查看問卷結果？',
      answer: '在問卷列表中點擊對應問卷的「查看結果」按鈕，即可查看詳細的統計數據。'
    },
    {
      question: '忘記密碼怎麼辦？',
      answer: '點擊登入頁面的「忘記密碼」連結，按照指示進行密碼重置。'
    }
  ];
}
