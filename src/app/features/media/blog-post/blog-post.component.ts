import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MediaService } from '../../../services/media.service';
import { AuthService } from '../../../services/auth.service';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="loading" *ngIf="loading">Loading post...</div>

      <div class="not-found" *ngIf="!loading && !post">
        <h2>Post not found</h2>
        <a routerLink="/blog" class="btn btn-primary">Back to Blog</a>
      </div>

      <ng-container *ngIf="!loading && post">
        <div class="post-header">
          <div class="header-container">
            <a routerLink="/blog" class="back-link">← Back to blog</a>
            <div class="post-category">{{ post.category.replace('_',' ') }}</div>
            <h1>{{ post.title }}</h1>
            <div class="post-meta">
              <span>📅 {{ post.published_at | date:'MMMM d, y' }}</span>
              <span>⏱ {{ post.read_time_mins }} min read</span>
              <span>👁 {{ post.view_count }} views</span>
            </div>
          </div>
        </div>

        <div class="post-body">
          <article class="post-content">
            <p class="post-excerpt" *ngIf="post.excerpt">{{ post.excerpt }}</p>
            <div class="content-text">{{ post.content }}</div>

            <div class="post-tags" *ngIf="post.tags && post.tags.length">
              <span class="tag" *ngFor="let t of post.tags">{{ t }}</span>
            </div>

            <div class="post-actions">
              <button class="like-btn" (click)="like()" [class.liked]="liked">
                ❤️ {{ liked ? post.likes_count + 1 : post.likes_count }} likes
              </button>
            </div>
          </article>

          <aside class="post-sidebar">
            <div class="sidebar-card">
              <h3>Enjoyed this article?</h3>
              <p>Subscribe to the Indigo newsletter for weekly Rust content.</p>
              <a routerLink="/blog" class="btn btn-primary btn-full">
                More articles →
              </a>
            </div>

            <div class="sidebar-card">
              <h3>Learn Rust with Indigo</h3>
              <p>Structured courses from beginner to blockchain expert.</p>
              <a routerLink="/courses" class="btn btn-outline btn-full">
                Browse courses →
              </a>
            </div>
          </aside>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .page { background: #f8fafc; min-height: 100vh; }
    .loading, .not-found { text-align: center; padding: 80px 24px; color: #64748b; }
    .not-found h2 { font-size: 24px; color: #0f172a; margin: 0 0 16px; }

    .post-header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      padding: 56px 24px;
      color: #fff;
    }
    .header-container { max-width: 900px; margin: 0 auto; }
    .back-link {
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-size: 14px;
      display: inline-block;
      margin-bottom: 16px;
    }
    .back-link:hover { color: #fff; }
    .post-category {
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
    h1 { font-size: 36px; font-weight: 800; margin: 0 0 20px; line-height: 1.2; }
    .post-meta { display: flex; gap: 20px; flex-wrap: wrap; }
    .post-meta span { font-size: 14px; opacity: 0.85; }

    .post-body {
      max-width: 900px;
      margin: 0 auto;
      padding: 48px 24px;
      display: grid;
      grid-template-columns: 1fr 260px;
      gap: 40px;
      align-items: start;
    }

    .post-content {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 36px;
    }
    .post-excerpt {
      font-size: 18px;
      color: #374151;
      font-style: italic;
      line-height: 1.7;
      border-left: 3px solid #4f46e5;
      padding-left: 16px;
      margin: 0 0 28px;
    }
    .content-text {
      font-size: 16px;
      color: #374151;
      line-height: 1.9;
      white-space: pre-wrap;
    }
    .post-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 32px; }
    .tag {
      padding: 4px 12px;
      background: #ede9fe;
      color: #4f46e5;
      border-radius: 20px;
      font-size: 13px;
    }
    .post-actions { margin-top: 24px; padding-top: 24px; border-top: 1px solid #f1f5f9; }
    .like-btn {
      padding: 10px 20px;
      border-radius: 8px;
      border: 1.5px solid #e2e8f0;
      background: #fff;
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }
    .like-btn:hover, .like-btn.liked {
      border-color: #fca5a5;
      background: #fef2f2;
      color: #ef4444;
    }

    .post-sidebar { display: flex; flex-direction: column; gap: 16px; }
    .sidebar-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .sidebar-card h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
    .sidebar-card p  { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; }
    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
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
    .btn-primary:hover { background: #4338ca; }
    .btn-outline {
      background: transparent;
      color: #4f46e5;
      border: 1.5px solid #4f46e5;
    }
    .btn-outline:hover { background: #ede9fe; }

    @media (max-width: 768px) {
      .post-body { grid-template-columns: 1fr; }
    }
  `]
})
export class BlogPostComponent implements OnInit {
  post:    Post | null = null;
  loading = true;
  liked   = false;

  constructor(
    private route:       ActivatedRoute,
    private mediaService: MediaService,
    private authService:  AuthService,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.mediaService.getPost(slug).subscribe({
      next: data => { this.post = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  like(): void {
    if (!this.authService.isLoggedIn || this.liked || !this.post) return;
    this.mediaService.likePost(this.post.slug).subscribe({
      next: () => { this.liked = true; },
      error: () => {}
    });
  }
}