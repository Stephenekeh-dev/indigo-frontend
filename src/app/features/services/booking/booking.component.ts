import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { ServiceListing } from '../../../models/service.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <a [routerLink]="['/services', slug]" class="back-link">← Back to service</a>
        <h1>Book a Session</h1>
        <p *ngIf="service">{{ service.title }}</p>
      </div>

      <div class="booking-container">
        <div class="booking-form-card">
          <h2>Session details</h2>

          <div class="success-box" *ngIf="success">
            ✅ Booking confirmed! Check your email for the Zoom link.
            <br><br>
            <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard</a>
          </div>

          <form *ngIf="!success" (ngSubmit)="submit()">
            <div class="field">
              <label>Preferred Date & Time</label>
              <input
                type="datetime-local"
                name="scheduled_at"
                [(ngModel)]="scheduledAt"
                required
                [min]="minDate"
              />
              <span class="field-hint">All times are in UTC. We will confirm within 2 hours.</span>
            </div>

            <div class="field">
              <label>Tell us about your project (optional)</label>
              <textarea
                name="notes"
                [(ngModel)]="notes"
                rows="5"
                placeholder="Describe what you need help with — your codebase, goals, specific questions..."
              ></textarea>
            </div>

            <div class="error-box" *ngIf="error">{{ error }}</div>

            <div class="form-actions">
              <a [routerLink]="['/services', slug]" class="btn btn-outline">Cancel</a>
              <button type="submit" class="btn btn-primary" [disabled]="loading">
                {{ loading ? 'Booking...' : 'Confirm booking' }}
              </button>
            </div>
          </form>
        </div>

        <div class="booking-summary" *ngIf="service">
          <h3>Summary</h3>
          <div class="summary-item">
            <span class="si-label">Service</span>
            <span class="si-value">{{ service.title }}</span>
          </div>
          <div class="summary-item" *ngIf="service.duration_hours">
            <span class="si-label">Duration</span>
            <span class="si-value">{{ service.duration_hours }}h</span>
          </div>
          <div class="summary-item">
            <span class="si-label">Rate</span>
            <span class="si-value">from {{ formatPrice(service.price_usd) }}/hr</span>
          </div>
          <div class="summary-item">
            <span class="si-label">Format</span>
            <span class="si-value">Zoom call</span>
          </div>
          <div class="summary-divider"></div>
          <p class="summary-note">
            💳 Payment is collected after the session is confirmed.
            No upfront payment required.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { background: #f8fafc; min-height: 100vh; }
    .page-header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      padding: 48px 24px;
      color: #fff;
    }
    .page-header h1 { font-size: 32px; font-weight: 800; margin: 0 0 6px; }
    .page-header p  { opacity: 0.85; margin: 0; }
    .back-link {
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-size: 14px;
      display: inline-block;
      margin-bottom: 16px;
    }
    .back-link:hover { color: #fff; }

    .booking-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 48px 24px;
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 32px;
      align-items: start;
    }

    .booking-form-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 32px;
    }
    .booking-form-card h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 24px; }

    .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
    label  { font-size: 14px; font-weight: 600; color: #374151; }
    input, textarea {
      padding: 11px 14px;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 15px;
      color: #0f172a;
      background: #fff;
      outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    input:focus, textarea:focus { border-color: #4f46e5; }
    textarea { resize: vertical; }
    .field-hint { font-size: 12px; color: #94a3b8; }

    .error-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .success-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #15803d;
      padding: 20px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
    }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }

    .btn {
      padding: 11px 22px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-outline {
      background: transparent;
      color: #4f46e5;
      border: 1.5px solid #4f46e5;
    }
    .btn-outline:hover { background: #ede9fe; }

    /* Summary */
    .booking-summary {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      position: sticky;
      top: 80px;
    }
    .booking-summary h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 16px; }
    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .si-label { font-size: 13px; color: #64748b; }
    .si-value  { font-size: 13px; color: #0f172a; font-weight: 600; text-align: right; }
    .summary-divider { margin: 12px 0; }
    .summary-note { font-size: 13px; color: #64748b; line-height: 1.5; margin: 0; }

    @media (max-width: 768px) {
      .booking-container { grid-template-columns: 1fr; }
    }
  `]
})
export class BookingComponent implements OnInit {
  service:     ServiceListing | null = null;
  slug         = '';
  scheduledAt  = '';
  notes        = '';
  loading      = false;
  success      = false;
  error        = '';
  minDate      = '';

  constructor(
    private route:          ActivatedRoute,
    private router:         Router,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.minDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);

    this.bookingService.getService(this.slug).subscribe({
      next: data => this.service = data,
      error: ()  => {}
    });
  }

  submit(): void {
    if (!this.scheduledAt || !this.service) return;
    this.loading = true;
    this.error   = '';

    this.bookingService.createBooking({
      service_id:   this.service.id,
      scheduled_at: new Date(this.scheduledAt).toISOString(),
      client_notes: this.notes || undefined,
    }).subscribe({
      next: ()    => { this.success = true; this.loading = false; },
      error: (err) => {
        this.error   = err?.error?.error?.message || 'Booking failed. Please try again.';
        this.loading = false;
      }
    });
  }

  formatPrice(price: number): string { return '$' + price; }
}