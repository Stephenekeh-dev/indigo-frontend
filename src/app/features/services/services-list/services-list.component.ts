import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { ServiceListing } from '../../../models/service.model';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Professional Rust Services</h1>
        <p>Expert consulting, custom development, and code review — tailored to your needs.</p>
      </div>

      <div class="container">
        <div class="loading" *ngIf="loading">Loading services...</div>

        <div class="grid" *ngIf="!loading">
          <div class="service-card" *ngFor="let s of services">
            <div class="service-type">{{ s.service_type.replace('_', ' ') }}</div>
            <h2>{{ s.title }}</h2>
            <p>{{ s.description }}</p>
            <div class="service-meta">
              <div class="meta-item" *ngIf="s.duration_hours">
                <span class="meta-label">Duration</span>
                <span class="meta-value">{{ s.duration_hours }}h</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Rate</span>
                <span class="meta-value price">from {{ formatPrice(s.price_usd) }}/hr</span>
              </div>
            </div>
            <div class="service-actions">
              <a [routerLink]="['/services', s.slug]" class="btn btn-outline">Learn more</a>
              <a [routerLink]="['/services', s.slug, 'book']" class="btn btn-primary">Book now</a>
            </div>
          </div>

          <!-- Placeholder cards when empty -->
          <div class="service-card" *ngFor="let p of placeholders">
            <div class="service-type">{{ p.type }}</div>
            <h2>{{ p.title }}</h2>
            <p>{{ p.desc }}</p>
            <div class="service-meta">
              <div class="meta-item">
                <span class="meta-label">Rate</span>
                <span class="meta-value price">{{ p.price }}</span>
              </div>
            </div>
            <div class="service-actions">
              <a routerLink="/auth/register" class="btn btn-primary">Get started</a>
            </div>
          </div>
        </div>

        <!-- Why Indigo -->
        <div class="why-section">
          <h2>Why choose Indigo?</h2>
          <div class="why-grid">
            <div class="why-item" *ngFor="let w of whyItems">
              <div class="why-icon">{{ w.icon }}</div>
              <h3>{{ w.title }}</h3>
              <p>{{ w.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { background: #f8fafc; min-height: 100vh; }
    .page-header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      padding: 72px 24px;
      text-align: center;
      color: #fff;
    }
    .page-header h1 { font-size: 40px; font-weight: 800; margin: 0 0 12px; }
    .page-header p  { font-size: 18px; opacity: 0.85; margin: 0; max-width: 500px; margin: 0 auto; }
    .container { max-width: 1100px; margin: 0 auto; padding: 56px 24px; }
    .loading { text-align: center; color: #64748b; padding: 48px; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      margin-bottom: 72px;
    }
    .service-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .service-card:hover {
      box-shadow: 0 8px 32px rgba(79,70,229,0.12);
      transform: translateY(-2px);
    }
    .service-type {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #4f46e5;
      background: #ede9fe;
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
    }
    .service-card h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; }
    .service-card p  { color: #64748b; font-size: 15px; line-height: 1.6; margin: 0; flex: 1; }
    .service-meta { display: flex; gap: 24px; }
    .meta-item { display: flex; flex-direction: column; gap: 2px; }
    .meta-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
    .meta-value { font-size: 15px; color: #0f172a; font-weight: 600; }
    .price { color: #4f46e5 !important; }
    .service-actions { display: flex; gap: 10px; margin-top: 4px; }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-outline {
      background: transparent;
      color: #4f46e5;
      border: 1.5px solid #4f46e5;
    }
    .btn-outline:hover { background: #ede9fe; }

    /* Why section */
    .why-section { border-top: 1px solid #e2e8f0; padding-top: 56px; }
    .why-section h2 {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 32px;
      text-align: center;
    }
    .why-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    .why-item {
      text-align: center;
      padding: 24px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }
    .why-icon { font-size: 32px; margin-bottom: 12px; }
    .why-item h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
    .why-item p  { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; }
  `]
})
export class ServicesListComponent implements OnInit {
  services: ServiceListing[] = [];
  loading = true;

  placeholders = [
    { type: 'migration',          title: 'Rust Migration',      desc: 'Full codebase migration from C++, Go, or Python to idiomatic Rust.',  price: 'from $150/hr' },
    { type: 'custom_app',         title: 'Custom Rust App',     desc: 'End-to-end development of systems tools, CLIs, APIs, and services.',   price: 'from $120/hr' },
    { type: 'general_consulting', title: 'General Consulting',  desc: 'Architecture advice, code review, team mentoring, and best practices.', price: 'from $100/hr' },
  ];

  whyItems = [
    { icon: '🎯', title: 'Rust-only focus',   desc: 'We specialise exclusively in Rust — no generalists.' },
    { icon: '⚡', title: 'Fast turnaround',   desc: 'Same-week availability for most engagements.' },
    { icon: '🔒', title: 'NDA & IP protected', desc: 'All work is fully confidential and IP belongs to you.' },
    { icon: '🌍', title: 'Global team',        desc: 'Consultants across UTC-8 to UTC+8 timezones.' },
  ];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.listServices().subscribe({
      next: data => {
        this.services = data;
        this.loading  = false;
        if (data.length > 0) this.placeholders = [];
      },
      error: () => { this.loading = false; }
    });
  }

  formatPrice(price: number): string {
    return '$' + price;
  }
}
