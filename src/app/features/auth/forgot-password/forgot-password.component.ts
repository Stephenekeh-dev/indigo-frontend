import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <span class="brand-icon">◆</span>
          <span class="brand-name">Indigo</span>
        </div>

        <h1>Forgot password?</h1>
        <p class="auth-sub">
          Enter your email and we will send you a reset link.
        </p>

        <div class="success-box" *ngIf="sent">
          ✅ If that email exists, a reset link has been sent.
          Check your inbox.
        </div>

        <form *ngIf="!sent" (ngSubmit)="submit()">
          <div class="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div class="error-box" *ngIf="error">{{ error }}</div>
          <button type="submit" class="btn-submit" [disabled]="loading">
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <p class="auth-footer">
          Remember your password?
          <a routerLink="/auth/login">Sign in</a>
        </p>
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
      margin-bottom: 16px;
    }
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
    .auth-footer { text-align: center; margin-top: 24px; font-size: 14px; color: #64748b; }
    .auth-footer a { color: #4f46e5; font-weight: 600; text-decoration: none; }
  `]
})
export class ForgotPasswordComponent {
  email   = '';
  loading = false;
  sent    = false;
  error   = '';

  constructor(private http: HttpClient) {}

  submit(): void {
    if (!this.email) return;
    this.loading = true;
    this.error   = '';
    this.http.post(`${environment.apiUrl}/auth/forgot-password`, { email: this.email })
      .subscribe({
        next: () => { this.sent = true; this.loading = false; },
        error: ()  => { this.sent = true; this.loading = false; } // Always show success for security
      });
  }
}