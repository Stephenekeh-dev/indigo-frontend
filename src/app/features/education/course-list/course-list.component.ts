import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../../../services/courses.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Rust Courses</h1>
        <p>Structured learning paths from beginner to blockchain expert.</p>
        <div class="filter-row">
          <button
            *ngFor="let l of levels"
            class="filter-btn"
            [class.active]="selectedLevel === l.value"
            (click)="filterByLevel(l.value)"
          >
            {{ l.label }}
          </button>
        </div>
      </div>

      <div class="container">
        <div class="loading" *ngIf="loading">Loading courses...</div>

        <div class="grid" *ngIf="!loading">
          <div class="course-card" *ngFor="let c of filtered">
            <div class="course-thumb">
              <img *ngIf="c.thumbnail_url" [src]="c.thumbnail_url" [alt]="c.title" />
              <div class="thumb-placeholder" *ngIf="!c.thumbnail_url">🦀</div>
              <span class="level-badge" [class]="c.level">{{ c.level }}</span>
              <span class="free-badge" *ngIf="c.is_free">FREE</span>
            </div>
            <div class="course-body">
              <h2>{{ c.title }}</h2>
              <p>{{ c.description.slice(0, 100) }}...</p>
              <div class="course-meta">
                <span>📹 {{ c.total_lessons }} lessons</span>
                <span>⏱ {{ formatDuration(c.total_duration_mins) }}</span>
              </div>
              <div class="course-footer">
                <span class="price" *ngIf="!c.is_free">{{ formatPrice(c.price_usd) }}</span>
                <span class="price free" *ngIf="c.is_free">Free</span>
                <a [routerLink]="['/courses', c.slug]" class="btn btn-primary">View course →</a>
              </div>
            </div>
          </div>

          <!-- Placeholder when no courses -->
          <div class="course-card" *ngFor="let p of placeholders">
            <div class="course-thumb">
              <div class="thumb-placeholder">🦀</div>
              <span class="level-badge" [class]="p.level">{{ p.level }}</span>
            </div>
            <div class="course-body">
              <h2>{{ p.title }}</h2>
              <p>{{ p.desc }}</p>
              <div class="course-footer">
                <span class="price">{{ p.price }}</span>
                <a routerLink="/auth/register" class="btn btn-primary">Enroll →</a>
              </div>
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
      padding: 64px 24px 40px;
      text-align: center;
      color: #fff;
    }
    .page-header h1 { font-size: 40px; font-weight: 800; margin: 0 0 10px; }
    .page-header p  { font-size: 18px; opacity: 0.85; margin: 0 0 28px; }
    .filter-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
    .filter-btn {
      padding: 8px 20px;
      border-radius: 20px;
      border: 1.5px solid rgba(255,255,255,0.4);
      background: transparent;
      color: rgba(255,255,255,0.8);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn:hover,
    .filter-btn.active {
      background: #fff;
      color: #4f46e5;
      border-color: #fff;
    }

    .container { max-width: 1100px; margin: 0 auto; padding: 48px 24px; }
    .loading { text-align: center; color: #64748b; padding: 48px; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .course-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .course-card:hover {
      box-shadow: 0 8px 32px rgba(79,70,229,0.12);
      transform: translateY(-2px);
    }
    .course-thumb {
      position: relative;
      height: 160px;
      background: linear-gradient(135deg, #ede9fe, #ddd6fe);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .course-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .thumb-placeholder { font-size: 56px; }
    .level-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .level-badge.beginner     { background: #dcfce7; color: #15803d; }
    .level-badge.intermediate { background: #fef9c3; color: #854d0e; }
    .level-badge.advanced     { background: #fee2e2; color: #b91c1c; }
    .free-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      background: #dcfce7;
      color: #15803d;
    }

    .course-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 10px;
    }
    .course-body h2 { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0; }
    .course-body p  { color: #64748b; font-size: 14px; line-height: 1.5; margin: 0; flex: 1; }
    .course-meta { display: flex; gap: 16px; }
    .course-meta span { font-size: 13px; color: #94a3b8; }
    .course-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
    }
    .price      { font-size: 16px; font-weight: 700; color: #4f46e5; }
    .price.free { color: #15803d; }

    .btn {
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
  `]
})
export class CourseListComponent implements OnInit {
  courses:  Course[] = [];
  filtered: Course[] = [];
  loading = true;
  selectedLevel = 'all';

  levels = [
    { value: 'all',          label: 'All Levels' },
    { value: 'beginner',     label: 'Beginner'   },
    { value: 'intermediate', label: 'Intermediate'},
    { value: 'advanced',     label: 'Advanced'   },
  ];

  placeholders = [
    { title: 'Rust Fundamentals',          level: 'beginner',     desc: 'Master ownership, borrowing, and the Rust type system.',        price: '$49'  },
    { title: 'Async Rust in Practice',     level: 'intermediate', desc: 'Build concurrent programs with Tokio and async/await.',         price: '$79'  },
    { title: 'Blockchain Dev with Rust',   level: 'advanced',     desc: 'Build Solana programs and DeFi protocols in Rust.',             price: '$129' },
  ];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.coursesService.list(1, 20).subscribe({
      next: data => {
        this.courses  = data;
        this.filtered = data;
        this.loading  = false;
        if (data.length > 0) this.placeholders = [];
      },
      error: () => { this.loading = false; }
    });
  }

  filterByLevel(level: string): void {
    this.selectedLevel = level;
    this.filtered = level === 'all'
      ? this.courses
      : this.courses.filter(c => c.level === level);
  }

  formatPrice(price: number): string { return '$' + price; }
  formatDuration(mins: number): string {
    if (!mins) return '—';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}