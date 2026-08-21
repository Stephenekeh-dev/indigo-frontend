import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="verify-page">
      <div class="verify-card">
        <div class="brand">
          <span class="brand-icon">◆</span>
          <span class="brand-name">Indigo</span>
        </div>

        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Verifying your email...</p>
        </div>

        <div *ngIf="!loading && success">
          <div class="icon">✅</div>
          <h1>Email Verified!</h1>
          <p>
            Your email has been verified successfully.
            You now have full access to all Indigo features.
          </p>
          <a routerLink="/dashboard" class="btn btn-primary">
            Go to Dashboard →
          </a>
        </div>

        <div *ngIf="!loading && !success">
          <div class="icon">❌</div>
          <h1>Verification Failed</h1>
          <p>{{ errorMessage }}</p>
          <a routerLink="/auth/login" class="btn btn-primary">
            Back to Login →
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 24px;
    }
    .verify-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 48px 40px;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .brand {
      display: flex; align-items: center; justify-content: center;
      gap: 8px; margin-bottom: 32px;
    }
    .brand-icon { color: #4f46e5; font-size: 20px; }
    .brand-name { font-size: 20px; font-weight: 800; color: #0f172a; }
    .loading { display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #4f46e5;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading p { color: #64748b; font-size: 15px; }
    .icon { font-size: 56px; margin-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 12px; }
    p  { font-size: 15px; color: #64748b; line-height: 1.7; margin: 0 0 28px; }
    .btn {
      display: inline-flex; align-items: center; padding: 13px 28px;
      border-radius: 8px; font-size: 15px; font-weight: 700;
      text-decoration: none; transition: all 0.2s;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
  `]
})
export class VerifyEmailComponent implements OnInit {
  loading      = true;
  success      = false;
  errorMessage = 'This verification link is invalid or has already been used.';

  constructor(
    private route: ActivatedRoute,
    private http:  HttpClient,
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') || '';
    this.http.get(`${environment.apiUrl}/auth/verify-email/${token}`)
      .subscribe({
        next: () => { this.success = true;  this.loading = false; },
        error: (err) => {
          this.errorMessage = err?.error?.error?.message ||
            'This verification link is invalid or has expired.';
          this.success = false;
          this.loading = false;
        },
      });
  }
}