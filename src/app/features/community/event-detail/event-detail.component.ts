import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../../services/community.service';
import { AuthService } from '../../../services/auth.service';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="loading" *ngIf="loading">Loading event...</div>

      <div class="not-found" *ngIf="!loading && !event">
        <h2>Event not found</h2>
        <a routerLink="/community" class="btn btn-primary">Back to Community</a>
      </div>

      <ng-container *ngIf="!loading && event">
        <!-- Header -->
        <div class="event-header">
          <div class="header-container">
            <a routerLink="/community" class="back-link">← Back to events</a>
            <div class="event-type-badge">{{ event.event_type.replace('_',' ') }}</div>
            <h1>{{ event.title }}</h1>
            <div class="event-meta-row">
              <span class="meta-item">📅 {{ event.scheduled_at | date:'EEEE, MMMM d, y · h:mm a' }}</span>
              <span class="meta-item">⏱ {{ event.duration_minutes }} minutes</span>
              <span class="meta-item">📍 {{ event.is_online ? 'Online · Zoom' : 'In-person' }}</span>
              <span class="meta-item free" *ngIf="event.is_free">🎉 Free</span>
              <span class="meta-item paid" *ngIf="!event.is_free">💳 {{ formatPrice(event.price_usd) }}</span>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="event-body">
          <div class="event-main">
            <h2>About this event</h2>
            <p class="description">{{ event.description }}</p>

            <div class="tags" *ngIf="event.tags && event.tags.length">
              <span class="tag" *ngFor="let t of event.tags">{{ t }}</span>
            </div>
          </div>

          <!-- Registration sidebar -->
          <div class="event-sidebar">
            <div class="register-card">
              <div class="register-price">
                <span *ngIf="event.is_free" class="price free">Free</span>
                <span *ngIf="!event.is_free" class="price">{{ formatPrice(event.price_usd) }}</span>
              </div>

              <div class="register-meta">
                <div class="meta-row">
                  <span>📅</span>
                  <span>{{ event.scheduled_at | date:'MMM d, y' }}</span>
                </div>
                <div class="meta-row">
                  <span>⏰</span>
                  <span>{{ event.scheduled_at | date:'h:mm a' }} ({{ event.timezone }})</span>
                </div>
                <div class="meta-row">
                  <span>⏱</span>
                  <span>{{ event.duration_minutes }} minutes</span>
                </div>
                <div class="meta-row" *ngIf="event.max_attendees">
                  <span>👥</span>
                  <span>Max {{ event.max_attendees }} attendees</span>
                </div>
              </div>

              <div class="success-box" *ngIf="registered">
                ✅ You're registered! Check your email for details.
                <div *ngIf="event.zoom_join_url" class="zoom-link">
                  <a [href]="event.zoom_join_url" target="_blank" class="btn btn-zoom">
                    Join Zoom Meeting
                  </a>
                </div>
              </div>

              <button
                *ngIf="!registered"
                class="btn btn-primary btn-full"
                [disabled]="registering"
                (click)="register()"
              >
                {{ registering ? 'Registering...' : 'Register for free' }}
              </button>

              <p class="register-note" *ngIf="!isLoggedIn && !registered">
                <a routerLink="/auth/login">Sign in</a> to register for this event.
              </p>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .page { background: #f8fafc; min-height: 100vh; }
    .loading, .not-found {
      text-align: center;
      padding: 80px 24px;
      color: #64748b;
    }
    .not-found h2 { font-size: 24px; color: #0f172a; margin: 0 0 16px; }

    /* Header */
    .event-header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      padding: 48px 24px;
      color: #fff;
    }
    .header-container { max-width: 1000px; margin: 0 auto; }
    .back-link {
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      display: inline-block;
      margin-bottom: 20px;
    }
    .back-link:hover { color: #fff; }
    .event-type-badge {
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
    h1 { font-size: 36px; font-weight: 800; margin: 0 0 20px; }
    .event-meta-row { display: flex; gap: 20px; flex-wrap: wrap; }
    .meta-item { font-size: 14px; opacity: 0.9; }
    .meta-item.free { color: #86efac; font-weight: 700; }
    .meta-item.paid { color: #fde68a; font-weight: 700; }

    /* Body */
    .event-body {
      max-width: 1000px;
      margin: 0 auto;
      padding: 48px 24px;
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 40px;
      align-items: start;
    }
    .event-main h2 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px; }
    .description { color: #475569; font-size: 16px; line-height: 1.8; margin: 0 0 24px; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; }
    .tag {
      padding: 4px 12px;
      background: #ede9fe;
      color: #4f46e5;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }

    /* Sidebar */
    .register-card {
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
    .register-price { text-align: center; }
    .price { font-size: 32px; font-weight: 800; color: #0f172a; }
    .price.free { color: #15803d; }
    .register-meta { display: flex; flex-direction: column; gap: 10px; }
    .meta-row { display: flex; gap: 10px; font-size: 14px; color: #475569; }
    .success-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #15803d;
      padding: 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
    }
    .zoom-link { margin-top: 12px; }
    .btn {
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
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
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-zoom { background: #2563eb; color: #fff; width: 100%; margin-top: 4px; }
    .btn-zoom:hover { background: #1d4ed8; }
    .register-note { font-size: 13px; color: #64748b; text-align: center; margin: 0; }
    .register-note a { color: #4f46e5; font-weight: 600; text-decoration: none; }

    @media (max-width: 768px) {
      .event-body { grid-template-columns: 1fr; }
    }
  `]
})
export class EventDetailComponent implements OnInit {
  event:      Event | null = null;
  loading     = true;
  registered  = false;
  registering = false;

  constructor(
    private route:            ActivatedRoute,
    private router:           Router,
    private communityService: CommunityService,
    private authService:      AuthService,
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.communityService.getEvent(slug).subscribe({
      next: data => { this.event = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  register(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.event) return;
    this.registering = true;
    this.communityService.register(this.event.id).subscribe({
      next: ()  => { this.registered = true;  this.registering = false; },
      error: () => { this.registering = false; }
    });
  }

  formatPrice(price: number | null): string {
    return price ? '$' + price : 'Free';
  }
}