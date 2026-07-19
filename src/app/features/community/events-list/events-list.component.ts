import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommunityService } from '../../../services/community.service';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Indigo Community</h1>
        <p>Live events, workshops, and Zoom sessions — join the Rust community.</p>
      </div>

      <div class="container">
        <div class="loading" *ngIf="loading">Loading events...</div>

        <div class="events-section" *ngIf="!loading">
          <h2>Upcoming Events</h2>
          <div class="grid">
            <div class="event-card" *ngFor="let e of events">
              <div class="event-type">{{ e.event_type.replace('_', ' ') }}</div>
              <h3>{{ e.title }}</h3>
              <p>{{ e.description.slice(0, 120) }}</p>
              <div class="event-meta">
                <div class="meta-row">
                  <span class="meta-icon">📅</span>
                  <span>{{ e.scheduled_at | date:'EEE, MMM d · h:mm a' }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-icon">⏱</span>
                  <span>{{ e.duration_minutes }} minutes</span>
                </div>
                <div class="meta-row">
                  <span class="meta-icon">📍</span>
                  <span>{{ e.is_online ? 'Online · Zoom' : 'In-person' }}</span>
                </div>
              </div>
              <div class="event-footer">
                <span class="free-tag" *ngIf="e.is_free">Free</span>
                <span class="paid-tag" *ngIf="!e.is_free">{{ formatPrice(e.price_usd) }}</span>
                <a [routerLink]="['/community', e.slug]" class="btn btn-primary">Register →</a>
              </div>
            </div>

            <!-- Placeholders -->
            <div class="event-card" *ngFor="let p of placeholders">
              <div class="event-type">{{ p.type }}</div>
              <h3>{{ p.title }}</h3>
              <p>{{ p.desc }}</p>
              <div class="event-meta">
                <div class="meta-row">
                  <span class="meta-icon">📅</span>
                  <span>{{ p.date }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-icon">📍</span>
                  <span>Online · Zoom</span>
                </div>
              </div>
              <div class="event-footer">
                <span class="free-tag">Free</span>
                <a routerLink="/auth/register" class="btn btn-primary">Register →</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Membership section -->
        <div class="membership-section">
          <h2>Become a Member</h2>
          <div class="plans-grid">
            <div class="plan" *ngFor="let p of plans" [class.featured]="p.featured">
              <div class="plan-badge" *ngIf="p.featured">Most Popular</div>
              <h3>{{ p.name }}</h3>
              <div class="plan-price">{{ p.price }}<span>/month</span></div>
              <ul class="plan-features">
                <li *ngFor="let f of p.features">✓ {{ f }}</li>
              </ul>
              <a routerLink="/auth/register" class="btn" [class]="p.featured ? 'btn-primary' : 'btn-outline'">
                Get started
              </a>
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
    .page-header p  { font-size: 18px; opacity: 0.85; margin: 0; }
    .container { max-width: 1100px; margin: 0 auto; padding: 48px 24px; }
    .loading { text-align: center; color: #64748b; padding: 48px; }

    .events-section h2,
    .membership-section h2 {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 24px;
    }
    .events-section { margin-bottom: 64px; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .event-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .event-card:hover {
      box-shadow: 0 8px 24px rgba(79,70,229,0.1);
      transform: translateY(-2px);
    }
    .event-type {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7c3aed;
      background: #f5f3ff;
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
    }
    .event-card h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
    .event-card p  { color: #64748b; font-size: 14px; line-height: 1.5; margin: 0; flex: 1; }
    .event-meta { display: flex; flex-direction: column; gap: 6px; }
    .meta-row { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #475569; }
    .meta-icon { font-size: 16px; }
    .event-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
    .free-tag { font-size: 14px; font-weight: 700; color: #15803d; }
    .paid-tag { font-size: 14px; font-weight: 700; color: #4f46e5; }

    /* Plans */
    .membership-section { border-top: 1px solid #e2e8f0; padding-top: 56px; }
    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }
    .plan {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
    }
    .plan.featured {
      border-color: #4f46e5;
      box-shadow: 0 0 0 2px #4f46e5;
    }
    .plan-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #4f46e5;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 20px;
      white-space: nowrap;
    }
    .plan h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
    .plan-price { font-size: 32px; font-weight: 800; color: #0f172a; }
    .plan-price span { font-size: 16px; color: #64748b; font-weight: 400; }
    .plan-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .plan-features li { font-size: 14px; color: #475569; }

    .btn {
      padding: 11px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-outline {
      background: transparent;
      color: #4f46e5;
      border: 1.5px solid #4f46e5;
    }
    .btn-outline:hover { background: #ede9fe; }
  `]
})
export class EventsListComponent implements OnInit {
  events:   Event[] = [];
  loading = true;

  placeholders = [
    { type: 'zoom meetup',  title: 'Weekly Rust Office Hours',      desc: 'Ask anything about Rust — live Q&A with the Indigo consultants.',              date: 'Every Friday · 5:00 PM UTC' },
    { type: 'workshop',     title: 'Async Rust Workshop',           desc: 'Hands-on session building a concurrent server with Tokio and async/await.',    date: 'Jul 24 · 3:00 PM UTC'       },
    { type: 'webinar',      title: 'Solana Development with Rust',  desc: 'Introduction to writing and deploying Solana programs using the Anchor framework.', date: 'Aug 2 · 4:00 PM UTC'    },
  ];

  plans = [
    {
      name: 'Free',
      price: '$0',
      featured: false,
      features: ['Access to public events', 'Blog & tutorials', 'Community Discord', 'AI assistant (limited)'],
    },
    {
      name: 'Pro',
      price: '$29',
      featured: true,
      features: ['All Free features', 'Unlimited AI assistant', 'Private office hours', 'Course discounts 20%', 'Priority support'],
    },
    {
      name: 'Enterprise',
      price: '$199',
      featured: false,
      features: ['All Pro features', 'Team seats (up to 10)', 'Dedicated consultant', 'Custom workshops', 'SLA guarantee'],
    },
  ];

  constructor(private communityService: CommunityService) {}

  ngOnInit(): void {
    this.communityService.listEvents().subscribe({
      next: data => {
        this.events  = data;
        this.loading = false;
        if (data.length > 0) this.placeholders = [];
      },
      error: () => { this.loading = false; }
    });
  }

  formatPrice(price: number | null): string {
    return price ? '$' + price : 'Free';
  }
}