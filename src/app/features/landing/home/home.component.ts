import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { BookingService } from '../../../services/booking.service';
import { MediaService } from '../../../services/media.service';
import { Course } from '../../../models/course.model';
import { ServiceListing } from '../../../models/service.model';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">🦀 Rust Specialists</div> 
        <h1>
          Build Faster.<br>
          <span class="gradient-text">Ship Safer.</span><br>
          Scale Further.
        </h1>
        <p class="hero-sub">
          Indigo is the premier Rust consulting platform — offering expert consulting,
          structured courses, blockchain development, and a thriving developer community.
        </p>
        <div class="hero-actions">
          <a routerLink="/services" class="btn btn-primary btn-lg">Hire a Consultant</a>
          <a routerLink="/courses"  class="btn btn-outline btn-lg">Browse Courses</a>
        </div>
        <div class="hero-stats">
          <div class="stat"><strong>500+</strong><span>Clients served</span></div>
          <div class="stat"><strong>50+</strong><span>Courses</span></div>
          <div class="stat"><strong>10k+</strong><span>Community members</span></div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-card">
          <div class="hc-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="hc-title">main.rs</span>
          </div>
          <div class="hc-body" [innerHTML]="codeSnippet"></div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="section bg-white">
      <div class="section-container">
        <div class="section-header">
          <div>
            <h2>Professional Services</h2>
            <p>Expert Rust consulting for teams of every size</p>
          </div>
          <a routerLink="/services" class="view-all">View all services →</a>
        </div>
        <div class="cards-grid">
          <div class="card" *ngFor="let s of services">
            <div class="card-icon">⚙️</div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.short_desc || s.description.slice(0, 100) }}</p>
            <div class="card-footer">
              <span class="price">from {{ formatPrice(s.price_usd) }}/hr</span>
              <a [routerLink]="['/services', s.slug]" class="btn btn-primary btn-sm">Book →</a>
            </div>
          </div>
          <div class="card card-cta" *ngIf="services.length === 0">
            <div class="card-icon">⚙️</div>
            <h3>Rust Migration</h3>
            <p>Move your C++, Go or Python codebase to Rust safely and efficiently.</p>
            <div class="card-footer">
              <span class="price">from $150/hr</span>
              <a routerLink="/services" class="btn btn-primary btn-sm">Book →</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Courses -->
    <section class="section bg-gray">
      <div class="section-container">
        <div class="section-header">
          <div>
            <h2>Featured Courses</h2>
            <p>From Rust basics to advanced blockchain development</p>
          </div>
          <a routerLink="/courses" class="view-all">View all courses →</a>
        </div>
        <div class="cards-grid">
          <div class="card course-card" *ngFor="let c of courses">
            <div class="course-thumb">🦀</div>
            <div class="course-body">
              <span class="badge" [class]="'badge ' + c.level">{{ c.level }}</span>
              <h3>{{ c.title }}</h3>
              <p>{{ c.description.slice(0, 90) }}</p>
              <div class="card-footer">
                <span class="price free" *ngIf="c.is_free">Free</span>
                <span class="price" *ngIf="!c.is_free">{{ formatPrice(c.price_usd) }}</span>
                <a [routerLink]="['/courses', c.slug]" class="btn btn-primary btn-sm">Enroll →</a>
              </div>
            </div>
          </div>
          <div class="card course-card" *ngIf="courses.length === 0">
            <div class="course-thumb">🦀</div>
            <div class="course-body">
              <span class="badge badge-beginner">Beginner</span>
              <h3>Rust from Zero to Hero</h3>
              <p>Learn ownership, borrowing, and lifetimes from the ground up.</p>
              <div class="card-footer">
                <span class="price">$49</span>
                <a routerLink="/courses" class="btn btn-primary btn-sm">Enroll →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section bg-white">
      <div class="section-container">
        <div class="section-header center">
          <div>
            <h2>Everything Rust, in one place</h2>
            <p>The complete platform for Rust professionals</p>
          </div>
        </div>
        <div class="features-grid">
          <div class="feature" *ngFor="let f of features">
            <div class="feature-icon">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to build with Rust?</h2>
        <p>Join thousands of developers and companies who trust Indigo.</p>
        <div class="cta-actions">
          <a routerLink="/auth/register" class="btn btn-white btn-lg">Start for Free</a>
          <a routerLink="/services"      class="btn btn-outline-white btn-lg">Talk to an Expert</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── Hero ───────────────────────────────────────── */
    .hero {
      display: flex;
      align-items: center;
      gap: 64px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 24px 100px;
      min-height: 88vh;
    }
    .hero-content { flex: 1; }
    .hero-badge {
      display: inline-block;
      padding: 6px 16px;
      background: #ede9fe;
      border-radius: 20px;
      color: #6d28d9;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    h1 {
      font-size: clamp(36px, 5vw, 60px);
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
      margin: 0 0 20px;
    }
    .gradient-text {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-sub {
      font-size: 18px;
      color: #475569;
      line-height: 1.7;
      max-width: 520px;
      margin: 0 0 36px;
    }
    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }
    .hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
    .stat { display: flex; flex-direction: column; }
    .stat strong { font-size: 26px; color: #0f172a; font-weight: 800; }
    .stat span   { font-size: 13px; color: #64748b; margin-top: 2px; }

    /* ── Hero visual ────────────────────────────────── */
    .hero-visual { flex: 1; max-width: 500px; }
    .hero-card {
      background: #1e1e2e;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(79,70,229,0.2), 0 4px 16px rgba(0,0,0,0.1);
    }
    .hc-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 12px 16px;
      background: #2a2a3e;
    }
    .dot {
      width: 12px; height: 12px;
      border-radius: 50%;
    }
    .dot.red    { background: #ef4444; }
    .dot.yellow { background: #f59e0b; }
    .dot.green  { background: #10b981; }
    .hc-title {
      margin-left: 8px;
      font-size: 13px;
      color: #94a3b8;
      font-family: monospace;
    }
    .hc-body {
      padding: 24px;
      font-family: 'Fira Code','Courier New',monospace;
      font-size: 14px;
      line-height: 1.9;
      color: #e2e8f0;
    }
    :host ::ng-deep .hc-body .c { color: #475569; }
    :host ::ng-deep .hc-body .k { color: #818cf8; }
    :host ::ng-deep .hc-body .f { color: #34d399; }
    :host ::ng-deep .hc-body .s { color: #fbbf24; }

    /* ── Sections ───────────────────────────────────── */
    .section { padding: 80px 24px; }
    .bg-white { background: #ffffff; }
    .bg-gray  { background: #f8fafc; }
    .section-container { max-width: 1200px; margin: 0 auto; }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 40px;
      gap: 16px;
      flex-wrap: wrap;
    }
    .section-header.center { justify-content: center; text-align: center; }
    .section-header h2 {
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px;
    }
    .section-header p { color: #64748b; font-size: 15px; margin: 0; }
    .view-all {
      color: #4f46e5;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .view-all:hover { color: #4338ca; text-decoration: underline; }

    /* ── Cards ──────────────────────────────────────── */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .card:hover {
      box-shadow: 0 8px 30px rgba(79,70,229,0.12);
      transform: translateY(-2px);
    }
    .card-icon { font-size: 28px; margin-bottom: 14px; }
    .card h3 {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px;
    }
    .card p {
      color: #64748b;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 20px;
      flex: 1;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    /* Course card */
    .course-card { padding: 0; overflow: hidden; }
    .course-thumb {
      height: 120px;
      background: linear-gradient(135deg, #ede9fe, #ddd6fe);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
    }
    .course-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    /* ── Badges ─────────────────────────────────────── */
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .badge-beginner,
    .beginner     { background: #dcfce7; color: #15803d; }
    .badge-intermediate,
    .intermediate { background: #fef9c3; color: #854d0e; }
    .badge-advanced,
    .advanced     { background: #fee2e2; color: #b91c1c; }

    /* ── Features ───────────────────────────────────── */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }
    .feature {
      padding: 28px 24px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: box-shadow 0.2s;
    }
    .feature:hover { box-shadow: 0 4px 16px rgba(79,70,229,0.1); }
    .feature-icon { font-size: 32px; margin-bottom: 14px; }
    .feature h3 {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px;
    }
    .feature p { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0; }

    /* ── Buttons ────────────────────────────────────── */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-lg  { padding: 14px 28px; font-size: 16px; border-radius: 10px; }
    .btn-sm  { padding: 7px 16px;  font-size: 13px; }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-outline {
      background: transparent;
      color: #4f46e5;
      border: 2px solid #4f46e5;
    }
    .btn-outline:hover { background: #ede9fe; }
    .btn-white {
      background: #fff;
      color: #4f46e5;
      font-weight: 700;
    }
    .btn-white:hover { background: #f1f5f9; }
    .btn-outline-white {
      background: transparent;
      color: #fff;
      border: 2px solid rgba(255,255,255,0.6);
    }
    .btn-outline-white:hover { background: rgba(255,255,255,0.1); }

    /* ── Price ──────────────────────────────────────── */
    .price      { font-size: 15px; font-weight: 700; color: #4f46e5; }
    .price.free { color: #15803d; }

    /* ── CTA section ────────────────────────────────── */
    .cta-section {
      padding: 100px 24px;
      text-align: center;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
    }
    .cta-content { max-width: 580px; margin: 0 auto; }
    .cta-content h2 {
      font-size: 40px;
      font-weight: 800;
      color: #fff;
      margin: 0 0 16px;
    }
    .cta-content p {
      font-size: 18px;
      color: rgba(255,255,255,0.8);
      margin: 0 0 36px;
    }
    .cta-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* ── Responsive ─────────────────────────────────── */
    @media (max-width: 900px) {
      .hero {
        flex-direction: column;
        min-height: auto;
        padding: 60px 24px;
        gap: 40px;
      }
      .hero-visual { max-width: 100%; width: 100%; }
    }
  `]
})
export class HomeComponent implements OnInit {
  services: ServiceListing[] = [];
  courses:  Course[]         = [];
  posts:    Post[]           = [];

  codeSnippet = `<span class="c">// Indigo — Rust that ships</span>
<span class="k">use</span> indigo::{consulting, courses, blockchain};

<span class="k">async fn</span> <span class="f">build_great_software</span>() {
    <span class="k">let</span> expertise = Consultant::hire().await;
    <span class="k">let</span> knowledge  = Course::enroll().await;
    expertise.<span class="f">ship</span>(knowledge)
}`;

  features = [
    { icon: '🔧', title: 'Rust Migration',     desc: 'Migrate your C++, Go, or Python codebase to Rust safely and efficiently.' },
    { icon: '📚', title: 'Structured Learning', desc: 'From beginner to advanced — video courses, exercises, and 1-on-1 mentoring.' },
    { icon: '⛓️', title: 'Blockchain & Web3',   desc: 'Build Solana programs, Substrate pallets, and DeFi protocols in Rust.' },
    { icon: '👥', title: 'Live Community',      desc: 'Weekly Zoom sessions, office hours, and an active Discord server.' },
    { icon: '🛒', title: 'Digital Shop',        desc: 'Ebooks, templates, and tools to accelerate your Rust projects.' },
    { icon: '🤖', title: 'AI Rust Assistant',   desc: 'Get instant answers to Rust questions from our AI, trained on the platform.' },
  ];

  constructor(
    private bookingService: BookingService,
    private coursesService: CoursesService,
    private mediaService:   MediaService,
  ) {}

  ngOnInit(): void {
    this.bookingService.listServices().subscribe({
      next: data => this.services = data.slice(0, 3),
      error: ()   => {}
    });
    this.coursesService.list(1, 3).subscribe({
      next: data => this.courses = data,
      error: ()   => {}
    });
    this.mediaService.listPosts(1, 3).subscribe({
      next: data => this.posts = data,
      error: ()   => {}
    });
  }

  formatPrice(price: number): string {
    return '$' + price;
  }
}
//<section class="section bg-white" [@scrollReveal]="servicesVisible ? 'visible' : 'hidden'" data-section="services">