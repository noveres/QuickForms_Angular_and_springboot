import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>個人資料</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group animationDuration="0ms">
            <!-- 基本資料 -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>person</mat-icon>
                基本資料
              </ng-template>

              <div class="tab-content">
                <div class="avatar-section">
                  <div class="avatar-container">
                    <img [src]="avatarUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'" 
                         alt="用戶頭像"
                         class="avatar-img">
                    <button mat-mini-fab 
                            color="primary" 
                            class="change-avatar-button"
                            (click)="triggerFileInput()">
                      <mat-icon>edit</mat-icon>
                    </button>
                  </div>
                  <input type="file" 
                         #fileInput 
                         hidden 
                         accept="image/*"
                         (change)="onFileSelected($event)">
                </div>

                <div class="form-fields">
                  <mat-form-field appearance="outline">
                    <mat-label>顯示名稱</mat-label>
                    <input matInput [(ngModel)]="displayName">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>電子郵件</mat-label>
                    <input matInput [(ngModel)]="email" readonly>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>手機號碼</mat-label>
                    <input matInput [(ngModel)]="phone">
                  </mat-form-field>

                  <button mat-raised-button 
                          color="primary"
                          (click)="saveProfile()">
                    儲存變更
                  </button>
                </div>
              </div>
            </mat-tab>

            <!-- 修改密碼 -->
            <mat-tab>
              <ng-template mat-tab-label>
                <mat-icon>lock</mat-icon>
                修改密碼
              </ng-template>

              <div class="tab-content">
                <div class="form-fields">
                  <mat-form-field appearance="outline">
                    <mat-label>目前密碼</mat-label>
                    <input matInput 
                           type="password" 
                           [(ngModel)]="currentPassword">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>新密碼</mat-label>
                    <input matInput 
                           type="password" 
                           [(ngModel)]="newPassword">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>確認新密碼</mat-label>
                    <input matInput 
                           type="password" 
                           [(ngModel)]="confirmPassword">
                  </mat-form-field>

                  <button mat-raised-button 
                          color="primary"
                          (click)="changePassword()">
                    更新密碼
                  </button>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .profile-card {
      mat-card-header {
        margin-bottom: 24px;
      }
    }

    .tab-content {
      padding: 24px 0;
    }

    .avatar-section {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;

      .avatar-container {
        position: relative;
        width: 120px;
        height: 120px;

        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e0e0e0;
        }

        .change-avatar-button {
          position: absolute;
          bottom: 0;
          right: 0;
          transform: translate(25%, 25%);
        }
      }
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
      margin: 0 auto;

      mat-form-field {
        width: 100%;
      }

      button {
        align-self: flex-end;
      }
    }

    ::ng-deep {
      .mat-tab-label {
        min-width: 120px !important;
        padding: 0 24px !important;

        mat-icon {
          margin-right: 8px;
        }
      }
    }

    @media (max-width: 600px) {
      .profile-container {
        margin: 16px auto;
      }

      .avatar-section {
        .avatar-container {
          width: 100px;
          height: 100px;
        }
      }
    }
  `]
})
export class ProfileComponent {
  avatarUrl: string | null = null;
  displayName = '';
  email = 'user@example.com';
  phone = '';
  
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private snackBar: MatSnackBar) {}

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    // 實現儲存個人資料的邏輯
    this.snackBar.open('個人資料已更新', '關閉', { duration: 3000 });
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('新密碼與確認密碼不符', '關閉', { duration: 3000 });
      return;
    }

    // 實現更改密碼的邏輯
    this.snackBar.open('密碼已更新', '關閉', { duration: 3000 });
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
