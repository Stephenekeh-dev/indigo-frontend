import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-shell">

      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <span class="brand-icon">◆</span>
          <span>Admin Panel</span>
        </div>

        <nav class="admin-nav">
          <a routerLink="/admin/services"
             routerLinkActive="active"
             class="nav-item">
            ⚙️ Services
          </a>
          <a routerLink="/admin/courses"
             routerLinkActive="active"
             class="nav-item">
            📚 Courses
          </a>
          <a routerLink="/admin/bookings"
             routerLinkActive="active"
             class="nav-item">
            📅 Bookings
          </a>
          <a routerLink="/admin/users"
             routerLinkActive="active"
             class="nav-item">
            👥 Users
          </a>
          <a routerLink="/admin/media"
            routerLinkActive="active"
            class="nav-item">
            📝 Blog Posts
          </a>
                  <a routerLink="/admin/shop"
          routerLinkActive="active"
          class="nav-item">
          🛒 Shop
        </a>
        </nav>

        <div class="admin-footer-links">
          <a routerLink="/" class="footer-link">← Back to site</a>
          <a routerLink="/dashboard" class="footer-link">My Dashboard</a>
          <button class="footer-link logout-btn" (click)="logout()">Sign Out</button>
        </div>
      </aside>

      <!-- Content -->
      <div class="admin-content">
        <div class="admin-topbar">
          <div class="topbar-title">
            Welcome, {{ adminName }}
          </div>
          <div class="topbar-badge">Admin</div>
        </div>
        <div class="admin-body">
          <router-outlet />
        </div>
      </div>

    </div>
  `,
  styles: [`
    .admin-shell {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }

    /* Sidebar */
    .admin-sidebar {
      width: 220px;
      background: #0f172a;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
    }
    .admin-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px 18px;
      font-size: 16px;
      font-weight: 800;
      color: #f1f5f9;
      border-bottom: 1px solid #1e293b;
    }
    .brand-icon { color: #818cf8; font-size: 18px; }

    .admin-nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 16px 10px;
      flex: 1;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.15s;
    }
    .nav-item:hover { background: #1e293b; color: #f1f5f9; }
    .nav-item.active { background: #4f46e5; color: #fff; }

    .admin-footer-links {
      padding: 16px 10px;
      border-top: 1px solid #1e293b;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .footer-link {
      display: block;
      padding: 8px 12px;
      font-size: 13px;
      color: #475569;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.15s;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      width: 100%;
    }
    .footer-link:hover { color: #94a3b8; background: #1e293b; }
    .logout-btn { color: #ef4444; }
    .logout-btn:hover { color: #fca5a5; }

    /* Content */
    .admin-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .admin-topbar {
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      padding: 0 28px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .topbar-title { font-size: 15px; font-weight: 600; color: #0f172a; }
    .topbar-badge {
      padding: 4px 12px;
      background: #ede9fe;
      color: #4f46e5;
      font-size: 12px;
      font-weight: 700;
      border-radius: 20px;
    }
    .admin-body { flex: 1; overflow-y: auto; padding: 28px; }
  `]
})
export class AdminLayoutComponent implements OnInit {
  adminName = '';

  constructor(
    private authService: AuthService,
    private router:      Router,
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.adminName = user.full_name.split(' ')[0];
  }

  logout(): void {
    this.authService.logout();
  }
}