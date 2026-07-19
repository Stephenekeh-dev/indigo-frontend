import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { ServiceListing } from '../../../models/service.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="loading" *ngIf="loading">Loading service...</div>

      <div class="not-found" *ngIf="!loading && !service">
        <h2>Service not found</h2>
        <a routerLink="/services" class="btn btn-primary">Back to Services</a>
      </div>

      <ng-container *ngIf="!loading && service">
        <div class="service-header">
          <div class="header-container">
            <a routerLink="/services" class="back-link">← Back to services</a>
            <div class="service-type-badge">
              {{ service.service_type.replace('_',' ') }}
            </div>
            <h1>{{ service.title }}</h1>
            <p>{{ service.short_desc || service.description.slice(0, 160) }}</p>
            <div class="header-meta">
              <span *ngIf="service.duration_hours">
                ⏱ {{ service.duration_hours }}h session
              </span>
              <span>💰 from {{ formatPrice(service.price_usd) }}/hr</span>
            </div>
          </div>
        </div>

        <div class="service-body">
          <div class="service-main">
            <h2>What's included</h2>
            <p>{{ service.description }}</p>

            <div class="process-steps">
              <h3>How it works</h3>
              <div class="step" *ngFor="let s of steps; let i = index">
                <div class="step-num">{{ i + 1 }}</div>
                <div>
                  <strong>{{ s.title }}</strong>
                  <p>{{ s.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="service-sidebar">
            <div class="cta-card">
              <div class="cta-price">
                from {{ formatPrice(service.price_usd) }}<span>/hr</span>
              </div>
              <ul class="cta-features">
                <li>✓ Expert Rust consultant</li>
                <li>✓ Zoom session included</li>
                <li>✓ Written summary provided</li>
                <li>✓ Follow-up Q&A support</li>
              </ul>
              
             <a [routerLink]="['/services', service.slug, 'book']" class="btn btn-primary btn-full">
  Book this service
</a>
              <p class="cta-note">No payment required to request a booking.</p>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .page { background: #f8fafc; min-height: 100vh; }
    .loading, .not-found { text-align: center; padding: 80px 24px; color: #64748b; }
    .not-found h2 { font-size: 24px; color: #0f172a; margin: 0 0 16px; }

    .service-header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      padding: 56px 24px;
      color: #fff;
    }
    .header-container { max-width: 1000px; margin: 0 auto; }
    .back-link {
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-size: 14px;
      display: inline-block;
      margin-bottom: 20px;
    }
    .back-link:hover { color: #fff; }
    .service-type-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
    }
    h1 { font-size: 36px; font-weight: 800; margin: 0 0 12px; }
    .service-header p { font-size: 17px; opacity: 0.85; margin: 0 0 20px; max-width: 600px; }
    .header-meta { display: flex; gap: 20px; }
    .header-meta span { font-size: 15px; opacity: 0.9; }

    .service-body {
      max-width: 1000px;
      margin: 0 auto;
      padding: 48px 24px;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 40px;
      align-items: start;
    }
    .service-main h2 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 14px; }
    .service-main p  { color: #475569; font-size: 16px; line-height: 1.8; margin: 0 0 32px; }
    .process-steps h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 20px; }
    .step { display: flex; gap: 16px; margin-bottom: 20px; }
    .step-num {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: #4f46e5;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .step strong { font-size: 15px; font-weight: 700; color: #0f172a; display: block; margin-bottom: 4px; }
    .step p { font-size: 14px; color: #64748b; margin: 0; }

    .cta-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: sticky;
      top: 80px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .cta-price { font-size: 30px; font-weight: 800; color: #0f172a; }
    .cta-price span { font-size: 16px; color: #64748b; font-weight: 400; }
    .cta-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .cta-features li { font-size: 14px; color: #475569; }
    .btn {
      padding: 13px 20px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-full { width: 100%; }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .cta-note { font-size: 12px; color: #94a3b8; text-align: center; margin: 0; }

    @media (max-width: 768px) {
      .service-body { grid-template-columns: 1fr; }
    }
  `]
})
export class ServiceDetailComponent implements OnInit {
  service: ServiceListing | null = null;
  loading = true;

  steps = [
    { title: 'Submit your request',  desc: 'Tell us about your project, goals, and timeline.' },
    { title: 'Get matched',          desc: 'We pair you with the right Rust consultant within 24 hours.' },
    { title: 'Zoom session',         desc: 'Join a Zoom call at your chosen time — recorded if you want.' },
    { title: 'Written summary',      desc: 'Receive a written action plan after the session.' },
  ];

  constructor(
    private route:          ActivatedRoute,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.bookingService.getService(slug).subscribe({
      next: data => { this.service = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  formatPrice(price: number): string { return '$' + price; }
}