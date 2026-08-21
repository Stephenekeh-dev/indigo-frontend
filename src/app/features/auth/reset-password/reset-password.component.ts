import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <span class="brand-icon">◆</span>
          <span class="brand-name">Indigo</span>
        </div>

        <h1>Set new password</h1>
        <p class="auth-sub">Enter your new password below.</p>

        <div class="success-box" *ngIf="success">
          ✅ Password reset successfully.
          <a routerLink="/auth/login">Sign in</a> with your new password.
        </div>

        <form *ngIf="!success" (ngSubmit)="submit()">
          <div class="field">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              [(ngModel)]="password"
              placeholder="Min. 8 characters"
              required
              minlength="8"
            />
          </div>
          <div class="field">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              [(ngModel)]="confirm"
              placeholder="Repeat your password"
              required
            />
          </div>
          <div class="error-box" *ngIf="error">{{ error }}</div>
          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh; display: flex; align-items: center;
      justify-content: center; background: #f8fafc; padding: 24px;
    }
    .auth-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
      padding: 40px; width: 100%; max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .auth-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 28px; }
    .brand-icon { color: #4f46e5; font-size: 20px; }
    .brand-name { font-size: 20px; font-weight: 800; color: #0f172a; }
    h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
    .auth-sub { color: #64748b; font-size: 15px; margin: 0 0 28px; }
    .success-box {
      background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;
      padding: 16px; border-radius: 8px; font-size: 14px; font-weight: 500;
    }
    .success-box a { color: #4f46e5; font-weight: 700; }
    .error-box {
      background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c;
      padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px;
    }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
    label { font-size: 14px; font-weight: 600; color: #374151; }
    input {
      padding: 11px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 15px; color: #0f172a; outline: none; transition: border-color 0.2s;
    }
    input:focus { border-color: #4f46e5; }
    .btn-submit {
      width: 100%; padding: 13px; background: #4f46e5; color: #fff;
      border: none; border-radius: 8px; font-size: 15px; font-weight: 700;
      cursor: pointer; transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: #4338ca; }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  confirm  = '';
  token    = '';
  loading  = false;
  success  = false;
  error    = '';

  constructor(
    private route:  ActivatedRoute,
    private router: Router,
    private http:   HttpClient,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  submit(): void {
    if (!this.password || !this.confirm) return;
    if (this.password !== this.confirm) {
      this.error = 'Passwords do not match';
      return;
    }
    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters';
      return;
    }
    this.loading = true;
    this.error   = '';

    this.http.post(`${environment.apiUrl}/auth/reset-password`, {
      token:    this.token,
      password: this.password,
    }).subscribe({
      next: () => { this.success = true; this.loading = false; },
      error: (err) => {
        this.error   = err?.error?.error?.message || 'Reset failed. Link may have expired.';
        this.loading = false;
      }
    });
  }
}