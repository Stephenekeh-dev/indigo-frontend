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
        <button class="btn btn-primary" (click)="openCreateForm()">
          + Add Course
        </button>
      </div>

      <!-- Create / Edit form -->
      <div class="form-card" *ngIf="showForm">
        <h2>{{ editingId ? 'Edit Course' : 'New Course' }}</h2>
        <div class="form-grid">
          <div class="field">
            <label>Title *</label>
            <input
              type="text"
              [(ngModel)]="form.title"
              placeholder="e.g. Async Rust in Practice"
            />
          </div>
          <div class="field">
            <label>Level *</label>
            <select [(ngModel)]="form.level">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div class="field">
            <label>Price (USD)</label>
            <input type="number" [(ngModel)]="form.price_usd" placeholder="49" />
          </div>
          <div class="field">
            <label>Free Course?</label>
            <select [(ngModel)]="form.is_free">
              <option [ngValue]="false">No — paid</option>
              <option [ngValue]="true">Yes — free</option>
            </select>
          </div>
          <div class="field full">
            <label>Description *</label>
            <textarea
              [(ngModel)]="form.description"
              rows="4"
              placeholder="What students will learn..."
            ></textarea>
          </div>
          <div class="field full">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              [(ngModel)]="tagsInput"
              placeholder="rust, async, tokio"
            />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-ghost" (click)="cancelForm()">Cancel</button>
          <div class="success-msg" *ngIf="formSuccess">
            ✅ Course {{ editingId ? 'updated' : 'created' }}!
          </div>
          <div class="error-msg" *ngIf="formError">{{ formError }}</div>
          <button
            class="btn btn-primary"
            (click)="submitForm()"
            [disabled]="saving"
          >
            {{ saving ? 'Saving...' : (editingId ? 'Update Course' : 'Create Course') }}
          </button>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <div class="modal-overlay" *ngIf="deletingId">
        <div class="modal">
          <h3>Delete Course?</h3>
          <p>
            Are you sure you want to delete
            <strong>{{ getCourseTitle(deletingId) }}</strong>?
            This cannot be undone.
          </p>
          <div class="modal-actions">
            <button class="btn btn-ghost" (click)="deletingId = null">Cancel</button>
            <button
              class="btn btn-danger"
              (click)="confirmDelete()"
              [disabled]="deleting"
            >
              {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
            </button>
          </div>
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
              <th>Actions</th>
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
                <span *ngIf="c.is_free"  class="free-tag">Free</span>
                <span *ngIf="!c.is_free" class="price">{{ formatPrice(c.price_usd) }}</span>
              </td>
              <td>{{ c.total_lessons || 0 }}</td>
              <td>
                <span class="status-dot" [class]="c.status">{{ c.status }}</span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon edit"   (click)="openEditForm(c)">✏️ Edit</button>
                  <button class="btn-icon delete" (click)="promptDelete(c.id)">🗑 Delete</button>
                </div>
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
    label {
      font-size: 12px; font-weight: 600; color: #64748b;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    input, select, textarea {
      padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 14px; color: #0f172a; background: #fff; outline: none;
      transition: border-color 0.2s; font-family: inherit;
    }
    input:focus, select:focus, textarea:focus { border-color: #4f46e5; }
    textarea { resize: vertical; }
    .form-actions {
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    }
    .success-msg { font-size: 14px; color: #15803d; font-weight: 500; }
    .error-msg   { font-size: 14px; color: #b91c1c; }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: #fff; border-radius: 16px; padding: 32px;
      max-width: 420px; width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .modal h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 10px; }
    .modal p  { font-size: 14px; color: #64748b; margin: 0 0 24px; line-height: 1.6; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

    .data-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      overflow: hidden;
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
    .price    { font-weight: 700; color: #4f46e5; }
    .free-tag { font-weight: 700; color: #15803d; font-size: 13px; }

    .level-badge {
      padding: 3px 10px; border-radius: 20px; font-size: 12px;
      font-weight: 700; text-transform: capitalize;
    }
    .level-badge.beginner     { background: #dcfce7; color: #15803d; }
    .level-badge.intermediate { background: #fef9c3; color: #854d0e; }
    .level-badge.advanced     { background: #fee2e2; color: #b91c1c; }

    .status-dot { font-size: 12px; font-weight: 600; text-transform: capitalize; }
    .status-dot.published { color: #15803d; }
    .status-dot.draft     { color: #94a3b8; }

    .action-btns { display: flex; gap: 6px; }
    .btn-icon {
      padding: 5px 10px; border-radius: 6px; font-size: 12px;
      font-weight: 600; border: none; cursor: pointer; transition: all 0.2s;
    }
    .btn-icon.edit   { background: #ede9fe; color: #4f46e5; }
    .btn-icon.edit:hover   { background: #ddd6fe; }
    .btn-icon.delete { background: #fee2e2; color: #b91c1c; }
    .btn-icon.delete:hover { background: #fecaca; }

    .btn {
      padding: 10px 20px; border-radius: 8px; font-size: 14px;
      font-weight: 700; border: none; cursor: pointer; transition: all 0.2s;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-ghost  { background: #f1f5f9; color: #475569; }
    .btn-ghost:hover { background: #e2e8f0; }
    .btn-danger { background: #ef4444; color: #fff; }
    .btn-danger:hover:not(:disabled) { background: #dc2626; }
    .btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class AdminCoursesComponent implements OnInit {
  courses:     Course[] = [];
  loading      = true;
  showForm     = false;
  editingId:   string | null = null;
  deletingId:  string | null = null;
  saving       = false;
  deleting     = false;
  formSuccess  = false;
  formError    = '';
  tagsInput    = '';

  form = {
    title:       '',
    description: '',
    level:       'beginner',
    price_usd:   49,
    is_free:     false,
    tags:        [] as string[],
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.adminService.listCourses().subscribe({
      next: data => { this.courses = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  openCreateForm(): void {
    this.editingId = null;
    this.form = {
      title: '', description: '', level: 'beginner',
      price_usd: 49, is_free: false, tags: []
    };
    this.tagsInput   = '';
    this.formSuccess = false;
    this.formError   = '';
    this.showForm    = true;
  }

  openEditForm(c: Course): void {
    this.editingId = c.id;
    this.form = {
      title:       c.title,
      description: c.description,
      level:       c.level,
      price_usd:   c.price_usd,
      is_free:     c.is_free,
      tags:        c.tags || [],
    };
    this.tagsInput   = (c.tags || []).join(', ');
    this.formSuccess = false;
    this.formError   = '';
    this.showForm    = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelForm(): void {
    this.showForm    = false;
    this.editingId   = null;
    this.formError   = '';
    this.formSuccess = false;
  }

  submitForm(): void {
    if (!this.form.title || !this.form.description) return;
    this.saving      = true;
    this.formError   = '';
    this.formSuccess = false;

    const tags = this.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = { ...this.form, tags };

    if (this.editingId) {
      this.adminService.updateCourse(this.editingId, payload).subscribe({
        next: updated => {
          const idx = this.courses.findIndex(c => c.id === this.editingId);
          if (idx !== -1) this.courses[idx] = updated;
          this.saving      = false;
          this.formSuccess = true;
          this.showForm    = false;
          this.editingId   = null;
          setTimeout(() => this.formSuccess = false, 3000);
        },
        error: e => {
          this.formError = e?.error?.error?.message || 'Update failed';
          this.saving    = false;
        }
      });
    } else {
      this.adminService.createCourse(payload).subscribe({
        next: created => {
          this.courses.unshift(created);
          this.saving      = false;
          this.formSuccess = true;
          this.showForm    = false;
          setTimeout(() => this.formSuccess = false, 3000);
        },
        error: e => {
          this.formError = e?.error?.error?.message || 'Create failed';
          this.saving    = false;
        }
      });
    }
  }

  promptDelete(id: string): void {
    this.deletingId = id;
  }

  confirmDelete(): void {
    if (!this.deletingId) return;
    this.deleting = true;

    this.adminService.deleteCourse(this.deletingId).subscribe({
      next: () => {
        this.courses    = this.courses.filter(c => c.id !== this.deletingId);
        this.deletingId = null;
        this.deleting   = false;
      },
      error: e => {
        console.error('Delete failed', e);
        this.deleting   = false;
        this.deletingId = null;
      }
    });
  }

  getCourseTitle(id: string | null): string {
    if (!id) return '';
    return this.courses.find(c => c.id === id)?.title || '';
  }

  formatPrice(price: number): string {
     return '$' + price; 
    }
}