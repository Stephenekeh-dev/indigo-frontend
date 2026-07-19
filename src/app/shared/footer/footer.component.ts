import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">

        <div class="footer-brand">
          <span class="brand-icon">◆</span>
          <span class="brand-name">Indigo</span>
          <p>Where Rust is built, taught, and scaled.</p>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4>Services</h4>
            <a routerLink="/services">Consulting</a>
            <a routerLink="/services">Rust Migration</a>
            <a routerLink="/services">Code Review</a>
          </div>
          <div class="link-group">
            <h4>Learn</h4>
            <a routerLink="/courses">Courses</a>
            <a routerLink="/blog">Blog</a>
            <a routerLink="/community">Community</a>
          </div>
          <div class="link-group">
            <h4>Company</h4>
            <a routerLink="/">About</a>
            <a routerLink="/shop">Shop</a>
            <a routerLink="/auth/register">Sign Up</a>
          </div>
        </div>

      </div>
      <div class="footer-bottom">
        <p>© 2026 Indigo. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #050510;
      border-top: 1px solid rgba(99,102,241,0.15);
      padding: 48px 24px 0;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 64px;
      flex-wrap: wrap;
    }
    .footer-brand {
      flex: 1;
      min-width: 200px;
    }
    .brand-icon { color: #818cf8; font-size: 20px; margin-right: 8px; }
    .brand-name {
      font-size: 18px;
      font-weight: 700;
      color: #e2e8f0;
    }
    .footer-brand p {
      color: #64748b;
      font-size: 14px;
      margin-top: 12px;
      line-height: 1.6;
    }
    .footer-links {
      display: flex;
      gap: 48px;
      flex-wrap: wrap;
    }
    .link-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .link-group h4 {
      color: #e2e8f0;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin: 0 0 4px;
    }
    .link-group a {
      color: #64748b;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
    }
    .link-group a:hover { color: #818cf8; }
    .footer-bottom {
      max-width: 1200px;
      margin: 32px auto 0;
      padding: 20px 0;
      border-top: 1px solid rgba(99,102,241,0.1);
      text-align: center;
    }
    .footer-bottom p { color: #475569; font-size: 13px; }
  `]
})
export class FooterComponent {}