import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlockchainApiService, BlockchainService, InquiryDto } from '../../../services/blockchain.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-blockchain-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="loading" *ngIf="loading">Loading...</div>

      <ng-container *ngIf="!loading && service">
        <div class="service-header">
          <div class="header-container">
            <a routerLink="/blockchain" class="back-link">← Back to Blockchain Services</a>
            <div class="header-badges">
              <span class="network-badge" [class]="service.network">
                {{ getNetworkIcon(service.network) }} {{ service.network }}
              </span>
              <span class="type-badge">
                {{ service.project_type.replace('_',' ') }}
              </span>
            </div>
            <h1>{{ service.title }}</h1>
            <p>{{ service.description }}</p>
            <div class="header-meta" *ngIf="service.price_from_usd">
              💰 from {{ formatPrice(service.price_from_usd) }}/hr
            </div>
          </div>
        </div>

        <div class="service-body">
          <div class="service-main">
            <h2>What we deliver</h2>
            <div class="deliverables">
              <div class="deliverable" *ngFor="let d of deliverables">
                <span class="d-check">✓</span>
                <div>
                  <strong>{{ d.title }}</strong>
                  <p>{{ d.desc }}</p>
                </div>
              </div>
            </div>

            <!-- Inquiry form -->
            <div class="inquiry-form" id="inquiry">
              <h2>Start a Project</h2>
              <p>Tell us about your blockchain project and we will respond within 24 hours.</p>

              <div class="success-box" *ngIf="submitted">
                ✅ Inquiry submitted! We will be in touch within 24 hours.
              </div>

              <form *ngIf="!submitted" (ngSubmit)="submitInquiry()">
                <div class="form-row">
                  <div class="field">
                    <label>Your Name *</label>
                    <input type="text" [(ngModel)]="form.name" name="name" required placeholder="Steven Johnson" />
                  </div>
                  <div class="field">
                    <label>Email *</label>
                    <input type="email" [(ngModel)]="form.email" name="email" required placeholder="you@company.com" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="field">
                    <label>Company</label>
                    <input type="text" [(ngModel)]="form.company" name="company" placeholder="Your company name" />
                  </div>
                  <div class="field">
                    <label>Budget Range</label>
                    <select [(ngModel)]="form.budget_range" name="budget_range">
                      <option value="">Select budget</option>
                      <option value="under_10k">Under $10,000</option>
                      <option value="10k_50k">$10,000 – $50,000</option>
                      <option value="50k_plus">$50,000+</option>
                      <option value="ongoing">Ongoing retainer</option>
                    </select>
                  </div>
                </div>
                <div class="field">
                  <label>Project Description *</label>
                  <textarea
                    [(ngModel)]="form.description"
                    name="description"
                    rows="5"
                    required
                    placeholder="Describe your project — what you're building, timeline, and what kind of help you need..."
                  ></textarea>
                </div>
                <div class="error-box" *ngIf="error">{{ error }}</div>
                <button type="submit" class="btn btn-primary" [disabled]="submitting">
                  {{ submitting ? 'Sending...' : 'Submit Inquiry →' }}
                </button>
              </form>
            </div>
          </div>

          <div class="service-sidebar">
            <div class="cta-card">
              <h3>Ready to start?</h3>
              <div class="cta-price" *ngIf="service.price_from_usd">
                from {{ formatPrice(service.price_from_usd) }}<span>/hr</span>
              </div>
              <ul class="cta-features">
                <li>✓ Expert Rust blockchain developer</li>
                <li>✓ NDA available on request</li>
                <li>✓ Weekly progress updates</li>
                <li>✓ Full IP ownership to you</li>
                <li>✓ Post-launch support included</li>
              </ul>
              <a href="#inquiry" class="btn btn-primary btn-full">
                Start a project →
              </a>
            </div>

            <div class="network-card">
              <h3>Network</h3>
              <div class="network-info">
                <span class="network-badge big" [class]="service.network">
                  {{ getNetworkIcon(service.network) }} {{ service.network }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .page { background: #f8fafc; min-height: 100vh; }
    .loading { text-align: center; padding: 80px; color: #64748b; }

    .service-header {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      padding: 56px 24px; color: #fff;
    }
    .header-container { max-width: 1000px; margin: 0 auto; }
    .back-link {
      color: rgba(255,255,255,0.75); text-decoration: none;
      font-size: 14px; display: inline-block; margin-bottom: 20px;
    }
    .back-link:hover { color: #fff; }
    .header-badges { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .network-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 5px 14px; border-radius: 20px; font-size: 12px;
      font-weight: 700; text-transform: capitalize; background: rgba(255,255,255,0.2);
      color: #fff;
    }
    .network-badge.big { font-size: 14px; padding: 8px 16px; }
    .network-badge.solana   { background: #f0fdf4; color: #15803d; }
    .network-badge.polkadot { background: #fdf2f8; color: #be185d; }
    .network-badge.near     { background: #eff6ff; color: #1d4ed8; }
    .network-badge.ethereum { background: #f5f3ff; color: #6d28d9; }
    .type-badge {
      padding: 5px 14px; border-radius: 20px; font-size: 12px;
      font-weight: 700; background: rgba(255,255,255,0.15); color: #fff;
      text-transform: capitalize;
    }
    h1 { font-size: 36px; font-weight: 800; margin: 0 0 14px; }
    .service-header p { font-size: 17px; opacity: 0.85; margin: 0 0 16px; max-width: 640px; }
    .header-meta { font-size: 16px; opacity: 0.9; font-weight: 600; }

    .service-body {
      max-width: 1000px; margin: 0 auto; padding: 48px 24px;
      display: grid; grid-template-columns: 1fr 280px; gap: 40px; align-items: start;
    }

    .service-main h2 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 20px; }

    .deliverables { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }
    .deliverable { display: flex; gap: 14px; }
    .d-check {
      width: 28px; height: 28px; border-radius: 50%; background: #7c3aed;
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; flex-shrink: 0;
    }
    .deliverable strong { font-size: 15px; font-weight: 700; color: #0f172a; display: block; margin-bottom: 3px; }
    .deliverable p { font-size: 14px; color: #64748b; margin: 0; }

    /* Inquiry form */
    .inquiry-form {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px;
    }
    .inquiry-form h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
    .inquiry-form > p { color: #64748b; font-size: 14px; margin: 0 0 24px; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    label { font-size: 13px; font-weight: 600; color: #374151; }
    input, textarea, select {
      padding: 11px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 14px; color: #0f172a; background: #fff; outline: none;
      transition: border-color 0.2s; font-family: inherit;
    }
    input:focus, textarea:focus, select:focus { border-color: #7c3aed; }
    textarea { resize: vertical; }

    .success-box {
      background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;
      padding: 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px;
    }
    .error-box {
      background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c;
      padding: 12px 16px; border-radius: 8px; font-size: 14px; margin-bottom: 16px;
    }

    /* Sidebar */
    .cta-card, .network-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      padding: 24px; margin-bottom: 16px;
    }
    .cta-card h3, .network-card h3 {
      font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 14px;
    }
    .cta-price { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 16px; }
    .cta-price span { font-size: 15px; color: #64748b; font-weight: 400; }
    .cta-features { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-direction: column; gap: 8px; }
    .cta-features li { font-size: 13px; color: #475569; }

    .btn {
      padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 700;
      text-decoration: none; border: none; cursor: pointer; transition: all 0.2s;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .btn-full { width: 100%; }
    .btn-primary { background: #7c3aed; color: #fff; }
    .btn-primary:hover:not(:disabled) { background: #6d28d9; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 768px) {
      .service-body { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class BlockchainDetailComponent implements OnInit {
  service:    BlockchainService | null = null;
  loading     = true;
  submitted   = false;
  submitting  = false;
  error       = '';

  form: InquiryDto = {
    name: '', email: '', company: '',
    description: '', budget_range: ''
  };

  deliverables = [
    { title: 'Architecture design',      desc: 'Full system design and technical specification before any code is written.' },
    { title: 'Development & testing',    desc: 'Test-driven development with comprehensive unit and integration tests.' },
    { title: 'Security review',          desc: 'Internal security audit before deployment to mainnet or production.' },
    { title: 'Deployment & handover',    desc: 'Deployment support and full documentation handover to your team.' },
  ];

  constructor(
    private route:            ActivatedRoute,
    private blockchainService: BlockchainApiService,
    private authService:       AuthService,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.blockchainService.getService(slug).subscribe({
      next: data => { this.service = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });

    // Pre-fill form if logged in
    const user = this.authService.currentUser;
    if (user) {
      this.form.name  = user.full_name;
      this.form.email = user.email;
    }
  }

  submitInquiry(): void {
    if (!this.form.name || !this.form.email || !this.form.description) return;
    this.submitting = true;
    this.error      = '';

    this.blockchainService.submitInquiry({
      ...this.form,
      network:      this.service?.network,
      project_type: this.service?.project_type,
    }).subscribe({
      next: ()    => { this.submitted = true;  this.submitting = false; },
      error: (e)  => {
        this.error     = e?.error?.error?.message || 'Failed to submit. Please try again.';
        this.submitting = false;
      }
    });
  }

  getNetworkIcon(network: string): string {
    const map: Record<string, string> = {
      solana: '🟢', polkadot: '🔴', near: '🔵',
      ethereum: '🟣', substrate: '🟠', other: '⚪'
    };
    return map[network] || '⚪';
  }

  formatPrice(price: number): string { return '$' + price; }
}