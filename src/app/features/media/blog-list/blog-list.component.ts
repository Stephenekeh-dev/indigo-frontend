import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MediaService } from '../../../services/media.service';
import { Post } from '../../../models/post.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink,  FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Indigo Blog</h1>
        <p>Deep dives into Rust, systems programming, blockchain, and engineering.</p>
      </div>

      <div class="container">
        <div class="loading" *ngIf="loading">Loading posts...</div>

        <div class="grid" *ngIf="!loading">
          <article class="post-card" *ngFor="let p of posts; let i = index" [class.featured]="i === 0">
            <div class="post-meta">
              <span class="category">{{ p.category.replace('_', ' ') }}</span>
              <span class="date">{{ p.published_at | date:'mediumDate' }}</span>
            </div>
            <h2>{{ p.title }}</h2>
            <p>{{ p.excerpt || p.content.slice(0, 150) }}</p>
            <div class="post-footer">
              <div class="post-stats">
                <span>{{ p.read_time_mins }} min read</span>
                <span>👁 {{ p.view_count }}</span>
                <span>❤️ {{ p.likes_count }}</span>
              </div>
              <a [routerLink]="['/blog', p.slug]" class="btn btn-primary">Read →</a>
            </div>
          </article>

          <!-- Placeholders -->
          <article class="post-card" *ngFor="let p of placeholders; let i = index" [class.featured]="i === 0">
            <div class="post-meta">
              <span class="category">{{ p.category }}</span>
            </div>
            <h2>{{ p.title }}</h2>
            <p>{{ p.excerpt }}</p>
            <div class="post-footer">
              <span>{{ p.readTime }} min read</span>
              <a routerLink="/auth/register" class="btn btn-primary">Read →</a>
            </div>
          </article>
        </div>

        <!-- Newsletter -->
        <div class="newsletter-box">
          <h3>Stay up to date</h3>
          <p>Get the latest Rust articles and Indigo news delivered to your inbox.</p>
          <div class="newsletter-form">
            <input
              type="email"
              [(ngModel)]="email"
              placeholder="your@email.com"
              [ngModelOptions]="{standalone: true}"
            />
            <button class="btn btn-primary" (click)="subscribe()">
              {{ subscribed ? 'Subscribed ✓' : 'Subscribe' }}
            </button>
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
    .container { max-width: 900px; margin: 0 auto; padding: 48px 24px; }
    .loading { text-align: center; color: #64748b; padding: 48px; }

    .grid { display: flex; flex-direction: column; gap: 20px; margin-bottom: 56px; }

    .post-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: box-shadow 0.2s;
    }
    .post-card:hover { box-shadow: 0 4px 20px rgba(79,70,229,0.1); }
    .post-card.featured {
      border-color: #c7d2fe;
      background: linear-gradient(135deg, #fafbff, #f5f3ff);
    }

    .post-meta { display: flex; gap: 12px; align-items: center; }
    .category {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #4f46e5;
      background: #ede9fe;
      padding: 3px 10px;
      border-radius: 20px;
    }
    .date { font-size: 13px; color: #94a3b8; }

    .post-card h2 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; }
    .post-card p  { color: #64748b; font-size: 15px; line-height: 1.6; margin: 0; flex: 1; }
    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .post-stats { display: flex; gap: 16px; }
    .post-stats span { font-size: 13px; color: #94a3b8; }

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

    /* Newsletter */
    .newsletter-box {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      color: #fff;
    }
    .newsletter-box h3 { font-size: 24px; font-weight: 700; margin: 0 0 8px; }
    .newsletter-box p  { opacity: 0.85; margin: 0 0 24px; }
    .newsletter-form {
      display: flex;
      gap: 10px;
      max-width: 440px;
      margin: 0 auto;
    }
    .newsletter-form input {
      flex: 1;
      padding: 12px 16px;
      border-radius: 8px;
      border: none;
      font-size: 15px;
      outline: none;
    }
  `]
})
export class BlogListComponent implements OnInit {
  posts:      Post[]  = [];
  loading     = true;
  email       = '';
  subscribed  = false;

  placeholders = [
    { category: 'Rust Basics',          title: 'Understanding Ownership in Rust',         excerpt: 'A deep dive into Rust\'s ownership model and why it makes memory safety possible without a garbage collector.',    readTime: 8 },
    { category: 'Systems Programming',  title: 'Building a Fast HTTP Server with Axum',   excerpt: 'Step-by-step guide to building a production-ready REST API using Rust\'s Axum framework and Tokio runtime.',        readTime: 12 },
    { category: 'Blockchain',           title: 'Writing Solana Programs in Rust',          excerpt: 'Get started with Solana smart contract development using Rust and the Anchor framework.',                           readTime: 15 },
  ];

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.mediaService.listPosts().subscribe({
      next: data => {
        this.posts   = data;
        this.loading = false;
        if (data.length > 0) this.placeholders = [];
      },
      error: () => { this.loading = false; }
    });
  }

  subscribe(): void {
    if (!this.email) return;
    this.mediaService.subscribe(this.email).subscribe({
      next: () => { this.subscribed = true; this.email = ''; },
      error: () => { this.subscribed = true; }
    });
  }
}