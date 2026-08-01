import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-head">
        <div>
          <h1>Courses</h1>
          <p>Manage course listings and content</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          {{ showForm ? '✕ Cancel' : '+ Add Course' }}
        </button>
      </div>

      <!-- Add course form -->
      <div class="form-card" *ngIf="showForm">
        <h2>New Course</h2>
        <div class="form-grid">
          <div class="field">
            <label>Title *</label>
            <input type="text" [(ngModel)]="newCourse.title" placeholder="e.g. Async Rust in Practice" />
          </div>
          <div class="field">
            <label>Level *</label>
            <select [(ngModel)]="newCourse.level">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div class="field">
            <label>Price (USD)</label>
            <input type="number" [(ngModel)]="newCourse.price_usd" placeholder="49" />
          </div>
          <div class="field">
            <label>Free Course?</label>
            <select [(ngModel)]="newCourse.is_free">
              <option [ngValue]="false">No — paid</option>
              <option [ngValue]="true">Yes — free</option>
            </select>
          </div>
          <div class="field full">
            <label>Description *</label>
            <textarea [(ngModel)]="newCourse.description" rows="4" placeholder="What students will learn..."></textarea>
          </div>
          <div class="field full">
            <label>Tags (comma separated)</label>
            <input type="text" [(ngModel)]="tagsInput" placeholder="rust, async, tokio" />
          </div>
        </div>
        <div class="form-actions">
          <div class="success-msg" *ngIf="createSuccess">✅ Course created!</div>
          <div class="error-msg"   *ngIf="createError">{{ createError }}</div>
          <button class="btn btn-primary" (click)="createCourse()" [disabled]="creating">
            {{ creating ? 'Creating...' : 'Create Course' }}
          </button>
        </div>
      </div>

      <!-- Courses table -->
      <div class="data-card">
        <div class="loading" *ngIf="loading">Loading courses...</div>
        <table class="data-table" *ngIf="!loading">
          <thead>
            <tr>
              <th>Title</th>
              <th>Level</th>
              <th>Price</th>
              <th>Lessons</th>
              <th>Status</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of courses">
              <td>
                <strong>{{ c.title }}</strong>
                <small>{{ c.description.slice(0,60) }}...</small>
              </td>
              <td>
                <span class="level-badge" [class]="c.level">{{ c.level }}</span>
              </td>
              <td>
                <span *ngIf="c.is_free" class="free-tag">Free</span>
                <span *ngIf="!c.is_free" class="price">{{ formatPrice(c.price_usd) }}</span>
              </td>
              <td>{{ c.total_lessons || 0 }}</td>
              <td>
                <span class="status-dot" [class]="c.status">{{ c.status }}</span>
              </td>
              <td>
                <span class="tag" *ngFor="let t of (c.tags || []).slice(0,2)">{{ t }}</span>
              </td>
            </tr>
            <tr *ngIf="courses.length === 0">
              <td colspan="6" class="empty-row">No courses found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {}
    .page-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px;
    }
    .page-head h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
    .page-head p  { font-size: 14px; color: #64748b; margin: 0; }

    .form-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      padding: 24px; margin-bottom: 24px;
    }
    .form-card h2 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 20px; }
    .form-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;
    }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field.full { grid-column: 1 / -1; }
    label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    input, select, textarea {
      padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 14px; color: #0f172a; background: #fff; outline: none;
      transition: border-color 0.2s; font-family: inherit;
    }
    input:focus, select:focus, textarea:focus { border-color: #4f46e5; }
    textarea { resize: vertical; }
    .form-actions { display: flex; align-items: center; gap: 16px; }
    .success-msg { font-size: 14px; color: #15803d; font-weight: 500; }
    .error-msg   { font-size: 14px; color: #b91c1c; }

    .data-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden;
    }
    .loading { padding: 48px; text-align: center; color: #64748b; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th {
      background: #f8fafc; padding: 12px 16px; text-align: left;
      font-size: 12px; font-weight: 700; color: #64748b;
      text-transform: uppercase; letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-table td {
      padding: 14px 16px; border-bottom: 1px solid #f1f5f9;
      font-size: 14px; color: #475569; vertical-align: middle;
    }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table td strong { display: block; font-weight: 600; color: #0f172a; }
    .data-table td small  { font-size: 12px; color: #94a3b8; }
    .empty-row { text-align: center; color: #94a3b8; padding: 32px !important; }
    .price     { font-weight: 700; color: #4f46e5; }
    .free-tag  { font-weight: 700; color: #15803d; font-size: 13px; }

    .level-badge {
      padding: 3px 10px; border-radius: 20px; font-size: 12px;
      font-weight: 700; text-transform: capitalize;
    }
    .level-badge.beginner     { background: #dcfce7; color: #15803d; }
    .level-badge.intermediate { background: #fef9c3; color: #854d0e; }
    .level-badge.advanced     { background: #fee2e2; color: #b91c1c; }

    .status-dot {
      font-size: 12px; font-weight: 600; text-transform: capitalize;
    }
    .status-dot.published { color: #15803d; }
    .status-dot.draft     { color: #94a3b8; }

    .tag {
      display: inline-block; padding: 2px 8px; border-radius: 20px;
      font-size: 11px; font-weight: 600; background: #ede9fe; color: #4f46e5;
      margin-right: 4px;
    }

    .btn {
      padding: 10px 20px; border-radius: 8px; font-size: 14px;
      font-weight: 700; border: none; cursor: pointer; transition: all 0.2s;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class AdminCoursesComponent implements OnInit {
  courses:       Course[] = [];
  loading        = true;
  showForm       = false;
  creating       = false;
  createSuccess  = false;
  createError    = '';
  tagsInput      = '';

  newCourse = {
    title:       '',
    description: '',
    level:       'beginner',
    price_usd:   49,
    is_free:     false,
    tags:        [] as string[],
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.listCourses().subscribe({
      next: data => { this.courses = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  createCourse(): void {
    if (!this.newCourse.title || !this.newCourse.description) return;
    this.creating     = true;
    this.createError  = '';
    this.createSuccess = false;

    const tags = this.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    this.adminService.createCourse({ ...this.newCourse, tags }).subscribe({
      next: c => {
        this.courses.unshift(c);
        this.creating      = false;
        this.createSuccess = true;
        this.showForm      = false;
        this.newCourse = {
          title: '', description: '', level: 'beginner',
          price_usd: 49, is_free: false, tags: []
        };
        this.tagsInput = '';
        setTimeout(() => this.createSuccess = false, 3000);
      },
      error: e => {
        this.createError = e?.error?.error?.message || 'Failed to create course';
        this.creating    = false;
      }
    });
  }
  formatPrice(price: number): string { 
    return '$' + price; 
  }
}