import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <mat-toolbar class="nav-bar">
      <!-- Logo 區域 -->
      <div class="logo-container" routerLink="/home">
        <img src="https://raw.githubusercontent.com/angular/angular/main/aio/src/assets/images/logos/angular/angular.png" 
             alt="QuickForms Logo" class="logo-img">
        <span class="logo-text">QuickForms</span>
      </div>

      <span class="spacer"></span>

      <!-- 導航鏈接 -->
      <nav class="nav-links">
        <button mat-button routerLink="/home" 
                routerLinkActive="active-link">
          <mat-icon>home</mat-icon>
          <span>首頁</span>
        </button>

        <button mat-button routerLink="/support" 
                routerLinkActive="active-link">
          <mat-icon>support_agent</mat-icon>
          <span>客服中心</span>
        </button>
      </nav>

      <!-- 用戶菜單 -->
      <button mat-button [matMenuTriggerFor]="userMenu" 
              class="user-menu-button">
        <div class="user-avatar">
          <img [src]="userAvatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'" 
               alt="用戶頭像"
               class="avatar-img">
        </div>
        <span class="username">{{ username }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu" class="user-menu">
        <div class="menu-header">
          <img [src]="userAvatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'" 
               alt="用戶頭像"
               class="menu-avatar">
          <div class="user-info">
            <span class="display-name">{{ username }}</span>
            <span class="role">{{ isAdmin ? '管理者' : '一般用戶' }}</span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <button mat-menu-item routerLink="/profile">
          <mat-icon>person</mat-icon>
          <span>個人資料</span>
        </button>

        <button mat-menu-item (click)="toggleRole()">
          <mat-icon>swap_horiz</mat-icon>
          <span>切換身份</span>
        </button>

        <mat-divider></mat-divider>

        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          <span>登出</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      box-shadow: 0 2px 6px rgba(0,0,0,.1);
      z-index: 1000;
      padding: 0 24px;
      display: flex;
      align-items: center;
    }

    .logo-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
      min-width: 180px;
      margin-right: auto;

      &:hover {
        background-color: rgba(255,255,255,.1);
      }

      .logo-img {
        height: 32px;
        width: 32px;
        margin-right: 12px;
        filter: brightness(0) invert(1);
      }

      .logo-text {
        font-size: 20px;
        font-weight: 500;
        color: white;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
    }

    .nav-links {
      display: flex;
      gap: 16px;
      margin-right: 32px;

      button {
        border-radius: 8px;
        padding: 0 20px;
        height: 40px;
        color: white;
        opacity: 0.9;
        transition: all 0.3s ease;
        min-width: 100px;

        &:hover {
          background-color: rgba(255,255,255,.1);
          opacity: 1;
        }

        mat-icon {
          margin-right: 8px;
        }

        span {
          font-weight: 400;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }
      }

      .active-link {
        background-color: rgba(255,255,255,.15);
        opacity: 1;
      }
    }

    .user-menu-button {
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,.2);
      background-color: rgba(255,255,255,.1);
      transition: all 0.3s ease;
      height: 40px;
      min-width: 200px;

      &:hover {
        background-color: rgba(255,255,255,.2);
        border-color: rgba(255,255,255,.3);
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 12px;
        border: 2px solid rgba(255,255,255,.3);
        flex-shrink: 0;

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      ::ng-deep {
        .mdc-button__label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1;
          margin-right: 4px;
        }
      }

      .username {
        font-weight: 400;
        color: white;
        letter-spacing: 0.3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      mat-icon {
        color: white;
        opacity: 0.9;
        flex-shrink: 0;
      }
    }

    ::ng-deep {
      .user-menu {
        margin-top: 12px;
        border-radius: 8px;
        overflow: hidden;
        min-width: 240px;

        .menu-header {
          padding: 16px;
          background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
          color: white;
          display: flex;
          align-items: center;

          .menu-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin-right: 16px;
            border: 2px solid rgba(255,255,255,.3);
            flex-shrink: 0;
          }

          .user-info {
            flex: 1;
            min-width: 0;

            .display-name {
              color: white;
              font-weight: 500;
              font-size: 16px;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .role {
              color: rgba(255,255,255,.7);
              font-size: 14px;
            }
          }
        }

        .mat-mdc-menu-item {
          height: 48px;
          padding: 0 16px;
          
          mat-icon {
            margin-right: 16px;
            color: #666;
          }

          &:hover {
            background-color: rgba(25,118,210,.05);
            
            mat-icon {
              color: #1976d2;
            }
          }
        }
      }
    }

    @media (max-width: 600px) {
      .nav-bar {
        padding: 0 12px;
        height: 56px;
        gap: 16px;
      }

      .logo-container {
        padding: 4px;
        min-width: auto;

        .logo-text {
          display: none;
        }

        .logo-img {
          margin-right: 0;
        }
      }

      .nav-links {
        gap: 8px;

        button {
          padding: 0 12px;
          min-width: auto;

          span {
            display: none;
          }

          mat-icon {
            margin-right: 0;
          }
        }
      }

      .user-menu-button {
        padding: 4px;
        min-width: auto;
        width: 40px;

        .username, mat-icon {
          display: none;
        }

        .user-avatar {
          margin-right: 0;
        }
      }
    }
  `]
})
export class NavBarComponent {
  username = 'John Doe';
  userAvatar: string | null = null;
  isAdmin = false;

  toggleRole() {
    this.isAdmin = !this.isAdmin;
  }

  logout() {
    // 實現登出邏輯
    console.log('登出');
  }
}
