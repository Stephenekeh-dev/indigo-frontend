import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-head">
        <div>
          <h1>Blog Posts</h1>
          <p>Create, edit, and manage blog content</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateForm()">
          + New Post
        </button>
      </div>

      <!-- Create / Edit form -->
      <div class="form-card" *ngIf="showForm">
        <h2>{{ editingSlug ? 'Edit Post' : 'New Post' }}</h2>
        <div class="form-grid">
          <div class="field full">
            <label>Title *</label>
            <input type="text" [(ngModel)]="form.title" placeholder="Post title" />
          </div>
          <div class="field">
            <label>Category *</label>
            <select [(ngModel)]="form.category">
              <option value="rust_basics">Rust Basics</option>
              <option value="tutorial">Tutorial</option>
              <option value="news">News</option>
              <option value="blockchain">Blockchain</option>
              <option value="career">Career</option>
            </select>
          </div>
          <div class="field">
            <label>Status</label>
            <select [(ngModel)]="form.status">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div class="field full">
            <label>Excerpt</label>
            <input type="text" [(ngModel)]="form.excerpt" placeholder="Short summary shown in listings" />
          </div>
          <div class="field full">
            <label>Content *</label>
            <textarea [(ngModel)]="form.content" rows="12" placeholder="Write your post content here..."></textarea>
          </div>
          <div class="field full">
            <label>Tags (comma separated)</label>
            <input type="text" [(ngModel)]="form.tags_input" placeholder="rust, async, tutorial" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-ghost" (click)="cancelForm()">Cancel</button>
          <div class="success-msg" *ngIf="formSuccess">
            ✅ Post {{ editingSlug ? 'updated' : 'published' }}!
          </div>
          <div class="error-msg" *ngIf="formError">{{ formError }}</div>
          <button class="btn btn-primary" (click)="submitForm()" [disabled]="saving">
            {{ saving ? 'Saving...' : (editingSlug ? 'Update Post' : 'Publish Post') }}
          </button>
        </div>
      </div>

      <!-- Delete modal -->
      <div class="modal-overlay" *ngIf="deletingSlug">
        <div class="modal">
          <h3>Delete Post?</h3>
          <p>Are you sure you want to delete <strong>{{ getPostTitle(deletingSlug) }}</strong>? This cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" (click)="deletingSlug = null">Cancel</button>
            <button class="btn btn-danger" (click)="confirmDelete()" [disabled]="deleting">
              {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Posts table -->
      <div class="data-card">
        <div class="loading" *ngIf="loading">Loading posts...</div>
        <table class="data-table" *ngIf="!loading">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of posts">
              <td>
                <strong>{{ p.title }}</strong>
                <small>{{ p.excerpt?.slice(0,60) }}</small>
              </td>
              <td>
                <span class="cat-badge">{{ p.category.replace('_',' ') }}</span>
              </td>
              <td>
                <span class="status-dot" [class]="p.status">{{ p.status }}</span>
              </td>
              <td>{{ p.view_count || 0 }}</td>
              <td>{{ p.likes_count || 0 }}</td>
              <td>{{ p.published_at ? (p.published_at | date:'MMM d, y') : '—' }}</td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon edit"   (click)="openEditForm(p)">✏️ Edit</button>
                  <button class="btn-icon delete" (click)="promptDelete(p.slug)">🗑 Delete</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="posts.length === 0">
              <td colspan="7" class="empty-row">No posts yet — create your first one</td>
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
    .form-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .success-msg { font-size: 14px; color: #15803d; font-weight: 500; }
    .error-msg   { font-size: 14px; color: #b91c1c; }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal {
      background: #fff; border-radius: 16px; padding: 32px;
      max-width: 420px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .modal h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 10px; }
    .modal p  { font-size: 14px; color: #64748b; margin: 0 0 24px; line-height: 1.6; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

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

    .cat-badge {
      padding: 3px 10px; border-radius: 20px; font-size: 12px;
      font-weight: 600; background: #ede9fe; color: #4f46e5;
      text-transform: capitalize;
    }
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
export class AdminMediaComponent implements OnInit {
  posts:        any[]         = [];
  loading       = true;
  showForm      = false;
  editingSlug:  string | null = null;
  deletingSlug: string | null = null;
  saving        = false;
  deleting      = false;
  formSuccess   = false;
  formError     = '';

  form = {
    title:      '',
    content:    '',
    excerpt:    '',
    category:   'rust_basics',
    status:     'draft',
    tags_input: '',
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.adminService.listAllPosts().subscribe({
      next: data => { this.posts = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  openCreateForm(): void {
    this.editingSlug = null;
    this.form = {
      title: '', content: '', excerpt: '',
      category: 'rust_basics', status: 'draft', tags_input: ''
    };
    this.formSuccess = false;
    this.formError   = '';
    this.showForm    = true;
  }

  openEditForm(p: any): void {
    this.editingSlug = p.slug;
    this.form = {
      title:      p.title,
      content:    p.content,
      excerpt:    p.excerpt || '',
      category:   p.category,
      status:     p.status,
      tags_input: (p.tags || []).join(', '),
    };
    this.formSuccess = false;
    this.formError   = '';
    this.showForm    = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelForm(): void {
    this.showForm    = false;
    this.editingSlug = null;
    this.formError   = '';
    this.formSuccess = false;
  }

  submitForm(): void {
    if (!this.form.title || !this.form.content) return;
    this.saving      = true;
    this.formError   = '';
    this.formSuccess = false;

    const tags = this.form.tags_input
      .split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      title:    this.form.title,
      content:  this.form.content,
      excerpt:  this.form.excerpt,
      category: this.form.category,
      status:   this.form.status,
      tags,
    };

    if (this.editingSlug) {
      this.adminService.updatePost(this.editingSlug, payload).subscribe({
        next: updated => {
          const idx = this.posts.findIndex(p => p.slug === this.editingSlug);
          if (idx !== -1) this.posts[idx] = updated;
          this.saving      = false;
          this.formSuccess = true;
          this.showForm    = false;
          this.editingSlug = null;
          setTimeout(() => this.formSuccess = false, 3000);
        },
        error: e => {
          this.formError = e?.error?.error?.message || 'Update failed';
          this.saving    = false;
        }
      });
    } else {
      this.adminService.createPost(payload).subscribe({
        next: created => {
          this.posts.unshift(created);
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

  promptDelete(slug: string): void {
    this.deletingSlug = slug;
  }

  confirmDelete(): void {
    if (!this.deletingSlug) return;
    this.deleting = true;

    this.adminService.deletePost(this.deletingSlug).subscribe({
      next: () => {
        this.posts        = this.posts.filter(p => p.slug !== this.deletingSlug);
        this.deletingSlug = null;
        this.deleting     = false;
      },
      error: e => {
        console.error('Delete failed', e);
        this.deleting     = false;
        this.deletingSlug = null;
      }
    });
  }

  getPostTitle(slug: string | null): string {
    if (!slug) return '';
    return this.posts.find(p => p.slug === slug)?.title || '';
  }
}