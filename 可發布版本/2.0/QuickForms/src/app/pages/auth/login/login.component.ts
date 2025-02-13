import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>登入</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>電子郵件</mat-label>
            <input matInput formControlName="email" type="email" required>
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
              請輸入電子郵件
            </mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
              請輸入有效的電子郵件地址
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>密碼</mat-label>
            <input matInput formControlName="password" type="password" required>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              請輸入密碼
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="loginForm.invalid || isLoading">
            <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
            <span *ngIf="!isLoading">登入</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
      padding: 16px;
    }

    .login-card {
      background: white;
      padding: 32px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,.1);
      width: 100%;
      max-width: 400px;

      h2 {
        margin: 0 0 24px;
        text-align: center;
        color: #333;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 16px;

        mat-form-field {
          width: 100%;
        }

        button {
          height: 48px;
          font-size: 16px;
          
          mat-spinner {
            display: inline-block;
            margin-right: 8px;
          }
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error: Error) => {
          this.isLoading = false;
          this.snackBar.open(error.message, '關閉', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}
