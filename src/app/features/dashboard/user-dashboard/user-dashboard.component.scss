import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CoursesService } from '../../../services/courses.service';
import { BookingService } from '../../../services/booking.service';
import { User } from '../../../models/user.model';
import { Enrollment } from '../../../models/course.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="user-info">
          <div class="avatar">
            {{ getInitials() }}
          </div>
          <div>
            <div class="user-name">{{ user?.full_name }}</div>
            <div class="user-email">{{ user?.email }}</div>
            <span class="role-badge">{{ user?.role }}</span>
          </div>
        </div>

        <nav class="side-nav">
          <button
            *ngFor="let tab of tabs"
            class="nav-item"
            [class.active]="activeTab === tab.id"
            (click)="activeTab = tab.id"
          >
            <span>{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="main">

        <!-- Overview -->
        <div *ngIf="activeTab === 'overview'">
          <h1>Welcome back, {{ getFirstName() }} 👋</h1>
          <p class="subtitle">Here's a summary of your Indigo activity.</p>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📚</div>
              <div class="stat-value">{{ enrollments.length }}</div>
              <div class="stat-label">Enrolled Courses</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-value">{{ bookings.length }}</div>
              <div class="stat-label">Bookings</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-value">{{ getAvgProgress() }}%</div>
              <div class="stat-label">Avg Progress</div>
            </div>
          </div>

          <div class="quick-actions">
            <h2>Quick actions</h2>
            <div class="actions-grid">
              <a routerLink="/services" class="action-card">
                <span>⚙️</span>
                <div>
                  <strong>Book a session</strong>
                  <p>Schedule 1-on-1 Rust consulting</p>
                </div>
              </a>
              <a routerLink="/courses" class="action-card">
                <span>📚</span>
                <div>
                  <strong>Browse courses</strong>
                  <p>Continue your Rust learning</p>
                </div>
              </a>
              <a routerLink="/community" class="action-card">
                <span>👥</span>
                <div>
                  <strong>Join an event</strong>
                  <p>Live workshops and meetups</p>
                </div>
              </a>
              <a routerLink="/shop" class="action-card">
                <span>🛒</span>
                <div>
                  <strong>Visit the shop</strong>
                  <p>Ebooks, templates, and merch</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- My Courses -->
        <div *ngIf="activeTab === 'courses'">
          <h1>My Courses</h1>
          <p class="subtitle">Track your learning progress.</p>

          <div class="empty-state" *ngIf="enrollments.length === 0">
            <div class="empty-icon">📚</div>
            <h3>No courses yet</h3>
            <p>Browse our courses and start learning Rust today.</p>
            <a routerLink="/courses" class="btn btn-primary">Browse courses</a>
          </div>

          <div class="course-list" *ngIf="enrollments.length > 0">
            <div class="enrollment-card" *ngFor="let e of enrollments">
              <div class="enrollment-info">
                <h3>Course #{{ e.course_id.slice(0, 8) }}</h3>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="e.progress_pct"></div>
                </div>
                <span class="progress-label">{{ e.progress_pct }}% complete</span>
              </div>
              <span class="status-badge" [class]="e.status">{{ e.status }}</span>
            </div>
          </div>
        </div>

        <!-- My Bookings -->
        <div *ngIf="activeTab === 'bookings'">
          <h1>My Bookings</h1>
          <p class="subtitle">Manage your consulting sessions.</p>

          <div class="empty-state" *ngIf="bookings.length === 0">
            <div class="empty-icon">📅</div>
            <h3>No bookings yet</h3>
            <p>Book a 1-on-1 session with a Rust expert.</p>
            <a routerLink="/services" class="btn btn-primary">Book a session</a>
          </div>
        </div>

        <!-- Settings -->
        <div *ngIf="activeTab === 'settings'">
          <h1>Account Settings</h1>
          <p class="subtitle">Manage your profile and preferences.</p>
          <div class="settings-card">
            <div class="field">
              <label>Full Name</label>
              <input type="text" [value]="user?.full_name" readonly />
            </div>
            <div class="field">
              <label>Email</label>
              <input type="email" [value]="user?.email" readonly />
            </div>
            <div class="field">
              <label>Role</label>
              <input type="text" [value]="user?.role" readonly />
            </div>
            <button class="btn btn-outline" (click)="logout()">Sign out</button>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      min-height: calc(100vh - 64px);
      background: #f8fafc;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: #fff;
      border-right: 1px solid #e2e8f0;
      padding: 28px 16px;
      display: flex;
      flex-direction: column;
      gap: 28px;
      flex-shrink: 0;
    }
    .user-info {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 0 8px;
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .user-name  { font-size: 14px; font-weight: 700; color: #0f172a; }
    .user-email { font-size: 12px; color: #94a3b8; margin-top: 1px; }
    .role-badge {
      display: inline-block;
      padding: 2px 8px;
      background: #ede9fe;
      color: #4f46e5;
      font-size: 11px;
      font-weight: 700;
      border-radius: 20px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .side-nav { display: flex; flex-direction: column; gap: 2px; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #475569;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      width: 100%;
    }
    .nav-item:hover  { background: #f8fafc; color: #0f172a; }
    .nav-item.active { background: #ede9fe; color: #4f46e5; font-weight: 600; }

    /* Main */
    .main { flex: 1; padding: 40px 48px; overflow-y: auto; }
    .main h1    { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
    .subtitle   { color: #64748b; font-size: 15px; margin: 0 0 32px; }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
    }
    .stat-icon  { font-size: 28px; margin-bottom: 8px; }
    .stat-value { font-size: 32px; font-weight: 800; color: #0f172a; }
    .stat-label { font-size: 13px; color: #64748b; margin-top: 4px; }

    /* Quick actions */
    .quick-actions h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px; }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .action-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .action-card:hover {
      border-color: #c7d2fe;
      box-shadow: 0 4px 12px rgba(79,70,229,0.08);
    }
    .action-card span { font-size: 28px; flex-shrink: 0; }
    .action-card strong { display: block; font-size: 14px; font-weight: 700; color: #0f172a; }
    .action-card p { font-size: 12px; color: #64748b; margin: 2px 0 0; }

    /* Courses tab */
    .enrollment-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 12px;
    }
    .enrollment-info { flex: 1; }
    .enrollment-info h3 { font-size: 15px; font-weight: 600; color: #0f172a; margin: 0 0 10px; }
    .progress-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4f46e5, #7c3aed);
      border-radius: 3px;
      transition: width 0.3s;
    }
    .progress-label { font-size: 12px; color: #64748b; }
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-badge.active    { background: #dcfce7; color: #15803d; }
    .status-badge.completed { background: #ede9fe; color: #4f46e5; }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 64px 24px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
    }
    .empty-icon { font-size: 48px; margin-bottom: 16px; }
    .empty-state h3 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
    .empty-state p  { color: #64748b; margin: 0 0 24px; }

    /* Settings */
    .settings-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 32px;
      max-width: 480px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .field { display: flex; flex-direction: column; gap: 6px; }
    label  { font-size: 13px; font-weight: 600; color: #374151; }
    input  {
      padding: 10px 14px;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      color: #475569;
      background: #f8fafc;
    }

    /* Buttons */
    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-outline {
      background: transparent;
      color: #ef4444;
      border: 1.5px solid #ef4444;
    }
    .btn-outline:hover { background: #fef2f2; }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard { flex-direction: column; }
      .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e2e8f0; }
      .main { padding: 24px; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .actions-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  user:        User | null   = null;
  enrollments: Enrollment[]  = [];
  bookings:    any[]         = [];
  activeTab = 'overview';

  tabs = [
    { id: 'overview',  label: 'Overview',   icon: '🏠' },
    { id: 'courses',   label: 'My Courses', icon: '📚' },
    { id: 'bookings',  label: 'Bookings',   icon: '📅' },
    { id: 'settings',  label: 'Settings',   icon: '⚙️' },
  ];

  constructor(
    private authService:    AuthService,
    private coursesService: CoursesService,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;

    this.coursesService.myEnrollments().subscribe({
      next: data => this.enrollments = data,
      error: () => {}
    });

    this.bookingService.myBookings().subscribe({
      next: data => this.bookings = data.data || [],
      error: () => {}
    });
  }
  getFirstName(): string {
  if (!this.user?.full_name) return '';
  return this.user.full_name.split(' ')[0];
}

  getInitials(): string {
    if (!this.user?.full_name) return '?';
    return this.user.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvgProgress(): number {
    if (!this.enrollments.length) return 0;
    const sum = this.enrollments.reduce((a, e) => a + e.progress_pct, 0);
    return Math.round(sum / this.enrollments.length);
  }

  logout(): void {
    this.authService.logout();
  }
}