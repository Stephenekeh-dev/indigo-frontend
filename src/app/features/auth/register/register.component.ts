import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">

        <div class="auth-brand">
          <span class="brand-icon">◆</span>
          <span class="brand-name">Indigo</span>
        </div>

        <h1>Create your account</h1>
        <p class="auth-sub">Start building with Rust today — free forever</p>

        <div class="error-box" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="submit()" #f="ngForm">
          <div class="field">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              [(ngModel)]="fullName"
              placeholder="Steven Johnson"
              required
            />
          </div>

          <div class="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              placeholder="you@example.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              [(ngModel)]="password"
              placeholder="Min. 8 characters"
              required
              minlength="8"
              autocomplete="new-password"
            />
          </div>

          <ul class="perks">
            <li>✅ Free course access</li>
            <li>✅ Community membership</li>
            <li>✅ AI Rust assistant</li>
          </ul>

          <button
            type="submit"
            class="btn-submit"
            [disabled]="loading"
          >
            {{ loading ? 'Creating account...' : 'Create free account' }}
          </button>
        </form>

        <p class="auth-footer">
          Already have an account?
          <a routerLink="/auth/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 24px;
    }
    .auth-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .auth-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 28px;
    }
    .brand-icon { color: #4f46e5; font-size: 20px; }
    .brand-name { font-size: 20px; font-weight: 800; color: #0f172a; }
    h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
    .auth-sub { color: #64748b; font-size: 15px; margin: 0 0 28px; }
    .error-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 18px;
    }
    label { font-size: 14px; font-weight: 600; color: #374151; }
    input {
      padding: 11px 14px;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 15px;
      color: #0f172a;
      background: #fff;
      transition: border-color 0.2s;
      outline: none;
    }
    input:focus { border-color: #4f46e5; }
    input::placeholder { color: #94a3b8; }
    .perks {
      list-style: none;
      padding: 0;
      margin: 0 0 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .perks li { font-size: 13px; color: #64748b; }
    .btn-submit {
      width: 100%;
      padding: 13px;
      background: #4f46e5;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) { background: #4338ca; }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #64748b;
    }
    .auth-footer a {
      color: #4f46e5;
      font-weight: 600;
      text-decoration: none;
    }
    .auth-footer a:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {
  fullName = '';
  email    = '';
  password = '';
  loading  = false;
  error    = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (!this.fullName || !this.email || !this.password) return;
    this.loading = true;
    this.error   = '';

    this.authService.register({
      full_name: this.fullName,
      email:     this.email,
      password:  this.password
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error   = err?.error?.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}