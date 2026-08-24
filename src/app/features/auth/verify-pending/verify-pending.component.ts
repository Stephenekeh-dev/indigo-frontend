import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-pending',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8fafc;padding:24px">
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:48px 40px;max-width:460px;width:100%;text-align:center">
        <div style="font-size:18px;font-weight:800;color:#4f46e5;margin-bottom:24px">◆ Indigo</div>
        <div style="font-size:52px;margin-bottom:16px">📬</div>
        <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0 0 12px">Check your email</h1>
        <p style="font-size:15px;color:#64748b;line-height:1.7;margin:0 0 24px">
          We sent a verification link to <strong>{{ email }}</strong>.
          Click it to activate your account.
        </p>
        <div style="background:#f8fafc;border-radius:10px;padding:16px 20px;margin-bottom:24px;text-align:left">
          <div style="display:flex;align-items:center;gap:10px;font-size:14px;color:#475569;margin-bottom:8px">
            <span style="width:24px;height:24px;border-radius:50%;background:#4f46e5;color:#fff;font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center">1</span>
            Open your email inbox
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:14px;color:#475569;margin-bottom:8px">
            <span style="width:24px;height:24px;border-radius:50%;background:#4f46e5;color:#fff;font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center">2</span>
            Find the email from Indigo
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:14px;color:#475569">
            <span style="width:24px;height:24px;border-radius:50%;background:#4f46e5;color:#fff;font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center">3</span>
            Click "Verify Email Address"
          </div>
        </div>
        <a routerLink="/dashboard" style="display:inline-block;padding:12px 24px;background:#f1f5f9;color:#475569;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;margin-bottom:16px">
          Skip — go to dashboard →
        </a>
        <p style="font-size:13px;color:#94a3b8;margin:0">Check your spam folder if you don't see it.</p>
      </div>
    </div>
  `,
})
export class VerifyPendingComponent {
  email = '';
  constructor(private authService: AuthService) {
    this.email = this.authService.currentUser?.email || '';
  }
}