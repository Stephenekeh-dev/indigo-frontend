import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="loading" *ngIf="loading">Loading course...</div>

      <div class="not-found" *ngIf="!loading && !course">
        <h2>Course not found</h2>
        <a routerLink="/courses" class="btn btn-primary">Back to Courses</a>
      </div>

      <ng-container *ngIf="!loading && course">
        <div class="course-header">
          <div class="header-container">
            <a routerLink="/courses" class="back-link">← Back to courses</a>
            <span class="level-badge" [class]="course.level">{{ course.level }}</span>
            <h1>{{ course.title }}</h1>
            <p>{{ course.description }}</p>
            <div class="header-meta">
              <span>📹 {{ course.total_lessons }} lessons</span>
              <span>⏱ {{ formatDuration(course.total_duration_mins) }}</span>
              <span *ngIf="course.tags && course.tags.length">
                🏷 {{ course.tags.join(', ') }}
              </span>
            </div>
          </div>
        </div>

        <div class="course-body">
          <div class="course-main">
            <div class="what-youll-learn">
              <h2>What you'll learn</h2>
              <div class="learn-grid">
                <div class="learn-item" *ngFor="let item of learnItems">
                  <span>✓</span> {{ item }}
                </div>
              </div>
            </div>

            <div class="requirements">
              <h2>Requirements</h2>
              <ul>
                <li *ngFor="let r of requirements">{{ r }}</li>
              </ul>
            </div>
          </div>

          <div class="course-sidebar">
            <div class="enroll-card">
              <div class="enroll-price">
                <span *ngIf="course.is_free" class="price free">Free</span>
                <span *ngIf="!course.is_free" class="price">
                  {{ formatPrice(course.price_usd) }}
                </span>
              </div>

              <ul class="enroll-features">
                <li>✓ Lifetime access</li>
                <li>✓ {{ course.total_lessons }} video lessons</li>
                <li>✓ Exercises and projects</li>
                <li>✓ Certificate of completion</li>
                <li>✓ Community support</li>
              </ul>

              <div class="success-box" *ngIf="enrolled">
                ✅ Enrolled! Start learning now.
                <br><br>
                <a [routerLink]="['/courses', course.slug, 'learn']"
                   class="btn btn-primary btn-full">
                  Start course →
                </a>
              </div>

              <ng-container *ngIf="!enrolled">
                <button
                  class="btn btn-primary btn-full"
                  [disabled]="enrolling"
                  (click)="enroll()"
                >
                  {{ enrolling ? 'Enrolling...' : (course.is_free ? 'Enroll for free' : 'Enroll now') }}
                </button>
                <p class="enroll-note" *ngIf="!isLoggedIn">
                  <a routerLink="/auth/login">Sign in</a> to enroll in this course.
                </p>
              </ng-container>
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

    .course-header {
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
      margin-bottom: 16px;
    }
    .back-link:hover { color: #fff; }
    .level-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .level-badge.beginner     { background: #dcfce7; color: #15803d; }
    .level-badge.intermediate { background: #fef9c3; color: #854d0e; }
    .level-badge.advanced     { background: #fee2e2; color: #b91c1c; }
    h1 { font-size: 36px; font-weight: 800; margin: 0 0 12px; }
    .course-header p { font-size: 17px; opacity: 0.85; margin: 0 0 20px; max-width: 640px; }
    .header-meta { display: flex; gap: 20px; flex-wrap: wrap; }
    .header-meta span { font-size: 14px; opacity: 0.9; }

    .course-body {
      max-width: 1000px;
      margin: 0 auto;
      padding: 48px 24px;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 40px;
      align-items: start;
    }
    .course-main h2 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px; }
    .what-youll-learn { margin-bottom: 40px; }
    .learn-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .learn-item { display: flex; gap: 8px; font-size: 14px; color: #475569; }
    .learn-item span { color: #4f46e5; font-weight: 700; flex-shrink: 0; }
    .requirements ul { padding-left: 20px; }
    .requirements li { font-size: 15px; color: #475569; margin-bottom: 6px; }

    .enroll-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 28px;
      position: sticky;
      top: 80px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .enroll-price { text-align: center; }
    .price { font-size: 32px; font-weight: 800; color: #0f172a; }
    .price.free { color: #15803d; }
    .enroll-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .enroll-features li { font-size: 14px; color: #475569; }
    .success-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #15803d;
      padding: 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
    }
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
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .enroll-note { font-size: 13px; color: #64748b; text-align: center; margin: 0; }
    .enroll-note a { color: #4f46e5; font-weight: 600; text-decoration: none; }

    @media (max-width: 768px) {
      .course-body { grid-template-columns: 1fr; }
      .learn-grid  { grid-template-columns: 1fr; }
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  course:    Course | null = null;
  loading    = true;
  enrolled   = false;
  enrolling  = false;

  learnItems = [
    'Rust ownership and borrowing',
    'Error handling with Result and Option',
    'Traits and generics',
    'Async programming with Tokio',
    'Building REST APIs with Axum',
    'Working with databases using SQLx',
  ];

  requirements = [
    'Basic programming knowledge in any language',
    'A computer with internet access',
    'Enthusiasm for systems programming',
  ];

  constructor(
    private route:          ActivatedRoute,
    private router:         Router,
    private coursesService: CoursesService,
    private authService:    AuthService,
  ) {}

  get isLoggedIn(): boolean { return this.authService.isLoggedIn; }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.coursesService.get(slug).subscribe({
      next: data => { this.course = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  enroll(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.course) return;
    this.enrolling = true;
    this.coursesService.enroll(this.course.id).subscribe({
      next: ()  => { this.enrolled = true;  this.enrolling = false; },
      error: () => { this.enrolling = false; }
    });
  }

  formatPrice(price: number): string    { return '$' + price; }
  formatDuration(mins: number): string  {
    if (!mins) return '—';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}