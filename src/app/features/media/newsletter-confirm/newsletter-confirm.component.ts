import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-newsletter-confirm',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirm-page">
      <div class="confirm-card">
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Confirming your subscription...</p>
        </div>

        <div *ngIf="!loading && success" class="success">
          <div class="icon">✅</div>
          <h1>Subscription Confirmed!</h1>
          <p>
            You are now subscribed to the Indigo newsletter.
            You will receive weekly Rust articles, platform updates,
            and exclusive offers.
          </p>
          <a routerLink="/blog" class="btn btn-primary">Read the Blog →</a>
        </div>

        <div *ngIf="!loading && !success" class="error">
          <div class="icon">❌</div>
          <h1>Confirmation Failed</h1>
          <p>
            This confirmation link is invalid or has already been used.
            Please subscribe again.
          </p>
          <a routerLink="/blog" class="btn btn-primary">Back to Blog →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 24px;
    }
    .confirm-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 48px 40px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
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
    h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 12px; }
    p  { font-size: 15px; color: #64748b; line-height: 1.7; margin: 0 0 28px; }
    .btn {
      display: inline-flex; align-items: center; padding: 13px 28px;
      border-radius: 8px; font-size: 15px; font-weight: 700;
      text-decoration: none; border: none; cursor: pointer; transition: all 0.2s;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
  `]
})
export class NewsletterConfirmComponent implements OnInit {
  loading = true;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private http:  HttpClient,
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token') || '';
    this.http.get(`${environment.apiUrl}/media/newsletter/confirm/${token}`)
      .subscribe({
        next: () => { this.success = true;  this.loading = false; },
        error: () => { this.success = false; this.loading = false; },
      });
  }
}