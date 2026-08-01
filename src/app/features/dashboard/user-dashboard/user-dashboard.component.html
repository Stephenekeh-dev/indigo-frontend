import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CoursesService } from '../../../services/courses.service';
import { BookingService } from '../../../services/booking.service';
import { ShopService } from '../../../services/shop.service';
import { User } from '../../../models/user.model';
import { Enrollment } from '../../../models/course.model';
import { Booking } from '../../../models/service.model';
import { Order } from '../../../models/product.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">

      <!-- ── Sidebar ─────────────────────────────── -->
      <aside class="sidebar">
        <div class="user-card">
          <div class="avatar">{{ getInitials() }}</div>
          <div class="user-meta">
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
            <span class="nav-icon">{{ tab.icon }}</span>
            {{ tab.label }}
            <span class="nav-badge" *ngIf="tab.badge && getBadgeCount(tab.id) > 0">
              {{ getBadgeCount(tab.id) }}
            </span>
          </button>
        </nav>

        <div class="sidebar-actions">
          <a routerLink="/services" class="sidebar-link">⚙️ Book a session</a>
          <a routerLink="/courses"  class="sidebar-link">📚 Browse courses</a>
          <a routerLink="/shop"     class="sidebar-link">🛒 Visit shop</a>
        </div>
      </aside>

      <!-- ── Main content ────────────────────────── -->
      <main class="main">

        <!-- Overview tab -->
        <div *ngIf="activeTab === 'overview'" class="tab-content">
          <div class="tab-header">
            <h1>Welcome back, {{ getFirstName() }} 👋</h1>
            <p>Here is a summary of your Indigo activity.</p>
          </div>

          <div class="stats-row">
            <div class="stat-card" (click)="activeTab = 'courses'">
              <div class="stat-icon courses">📚</div>
              <div class="stat-body">
                <div class="stat-value">{{ enrollments.length }}</div>
                <div class="stat-label">Enrolled Courses</div>
              </div>
              <div class="stat-arrow">→</div>
            </div>
            <div class="stat-card" (click)="activeTab = 'bookings'">
              <div class="stat-icon bookings">📅</div>
              <div class="stat-body">
                <div class="stat-value">{{ bookings.length }}</div>
                <div class="stat-label">Bookings</div>
              </div>
              <div class="stat-arrow">→</div>
            </div>
            <div class="stat-card" (click)="activeTab = 'orders'">
              <div class="stat-icon orders">🛒</div>
              <div class="stat-body">
                <div class="stat-value">{{ orders.length }}</div>
                <div class="stat-label">Orders</div>
              </div>
              <div class="stat-arrow">→</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon progress">⭐</div>
              <div class="stat-body">
                <div class="stat-value">{{ getAvgProgress() }}%</div>
                <div class="stat-label">Avg Progress</div>
              </div>
            </div>
          </div>

          <!-- Recent bookings preview -->
          <div class="section-block" *ngIf="bookings.length > 0">
            <div class="block-header">
              <h2>Recent Bookings</h2>
              <button class="view-all-btn" (click)="activeTab = 'bookings'">View all →</button>
            </div>
            <div class="bookings-list">
              <div class="booking-row" *ngFor="let b of bookings.slice(0,3)">
                <div class="booking-icon">📅</div>
                <div class="booking-info">
                  <strong>Consulting Session</strong>
                  <span>{{ b.scheduled_at | date:'MMM d, y · h:mm a' }}</span>
                </div>
                <span class="status-pill" [class]="b.status">{{ b.status }}</span>
              </div>
            </div>
          </div>

          <!-- Course progress preview -->
          <div class="section-block" *ngIf="enrollments.length > 0">
            <div class="block-header">
              <h2>Course Progress</h2>
              <button class="view-all-btn" (click)="activeTab = 'courses'">View all →</button>
            </div>
            <div class="progress-list">
              <div class="progress-row" *ngFor="let e of enrollments.slice(0,3)">
                <div class="progress-info">
                  <span class="course-name">Course {{ e.course_id.slice(0,8) }}...</span>
                  <span class="progress-pct">{{ e.progress_pct }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="e.progress_pct"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick actions -->
          <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="actions-grid">
              <a routerLink="/services" class="action-card">
                <span class="action-icon">⚙️</span>
                <div>
                  <strong>Book a Session</strong>
                  <p>Schedule 1-on-1 Rust consulting</p>
                </div>
              </a>
              <a routerLink="/courses" class="action-card">
                <span class="action-icon">📚</span>
                <div>
                  <strong>Browse Courses</strong>
                  <p>Continue your Rust learning</p>
                </div>
              </a>
              <a routerLink="/community" class="action-card">
                <span class="action-icon">👥</span>
                <div>
                  <strong>Join an Event</strong>
                  <p>Live workshops and meetups</p>
                </div>
              </a>
              <a routerLink="/shop" class="action-card">
                <span class="action-icon">🛒</span>
                <div>
                  <strong>Visit the Shop</strong>
                  <p>Ebooks, templates, and merch</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Courses tab -->
        <div *ngIf="activeTab === 'courses'" class="tab-content">
          <div class="tab-header">
            <h1>My Courses</h1>
            <p>Track your learning progress across all enrolled courses.</p>
          </div>

          <div class="loading-state" *ngIf="loadingCourses">Loading courses...</div>

          <div class="empty-state" *ngIf="!loadingCourses && enrollments.length === 0">
            <div class="empty-icon">📚</div>
            <h3>No courses yet</h3>
            <p>Browse our courses and start learning Rust today.</p>
            <a routerLink="/courses" class="btn btn-primary">Browse Courses</a>
          </div>

          <div class="courses-grid" *ngIf="!loadingCourses && enrollments.length > 0">
            <div class="course-card" *ngFor="let e of enrollments">
              <div class="course-thumb">🦀</div>
              <div class="course-info">
                <div class="course-id">Course #{{ e.course_id.slice(0,8) }}</div>
                <div class="enrollment-date">
                  Enrolled {{ e.enrolled_at | date:'MMM d, y' }}
                </div>
                <div class="progress-section">
                  <div class="progress-header">
                    <span>Progress</span>
                    <strong>{{ e.progress_pct }}%</strong>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      [style.width.%]="e.progress_pct"
                      [class.complete]="e.progress_pct === 100"
                    ></div>
                  </div>
                </div>
                <div class="course-actions">
                  <span class="status-pill" [class]="e.status">{{ e.status }}</span>
                  
                  <button
  class="btn btn-primary btn-sm"
  (click)="goToCourse(e.course_id)"
>
  Continue →
</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings tab -->
        <div *ngIf="activeTab === 'bookings'" class="tab-content">
          <div class="tab-header">
            <h1>My Bookings</h1>
            <p>Manage your consulting sessions and meeting links.</p>
            <a routerLink="/services" class="btn btn-primary">
              + New Booking
            </a>
          </div>

          <div class="loading-state" *ngIf="loadingBookings">Loading bookings...</div>

          <div class="empty-state" *ngIf="!loadingBookings && bookings.length === 0">
            <div class="empty-icon">📅</div>
            <h3>No bookings yet</h3>
            <p>Book a 1-on-1 session with a Rust expert.</p>
            <a routerLink="/services" class="btn btn-primary">Book a Session</a>
          </div>

          <div class="bookings-table" *ngIf="!loadingBookings && bookings.length > 0">
            <div class="table-header">
              <span>Service</span>
              <span>Date & Time</span>
              <span>Duration</span>
              <span>Status</span>
              <span>Zoom</span>
            </div>
            <div class="table-row" *ngFor="let b of bookings">
              <span class="cell">
                <div class="cell-icon">⚙️</div>
                <div>
                  <strong>Consulting Session</strong>
                  <small>ID: {{ b.id.slice(0,8) }}</small>
                </div>
              </span>
              <span class="cell">
                {{ b.scheduled_at | date:'MMM d, y' }}<br>
                <small>{{ b.scheduled_at | date:'h:mm a' }} UTC</small>
              </span>
              <span class="cell">{{ b.duration_minutes }} min</span>
              <span class="cell">
                <span class="status-pill" [class]="b.status">{{ b.status }}</span>
              </span>
              <span class="cell">
  <a *ngIf="b.zoom_join_url"
   [href]="b.zoom_join_url"
   target="_blank"
   class="zoom-btn">Join ↗</a>

                <span *ngIf="!b.zoom_join_url" class="no-zoom">Pending</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Orders tab -->
        <div *ngIf="activeTab === 'orders'" class="tab-content">
          <div class="tab-header">
            <h1>Order History</h1>
            <p>All your shop purchases and downloads.</p>
          </div>

          <div class="loading-state" *ngIf="loadingOrders">Loading orders...</div>

          <div class="empty-state" *ngIf="!loadingOrders && orders.length === 0">
            <div class="empty-icon">🛒</div>
            <h3>No orders yet</h3>
            <p>Browse the shop for ebooks, templates, and merch.</p>
            <a routerLink="/shop" class="btn btn-primary">Visit Shop</a>
          </div>

          <div class="orders-table" *ngIf="!loadingOrders && orders.length > 0">
            <div class="table-header">
              <span>Order ID</span>
              <span>Date</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            <div class="table-row" *ngFor="let o of orders">
              <span class="cell">
                <strong>#{{ o.id.slice(0,8) }}</strong>
              </span>
              <span class="cell">{{ o.created_at | date:'MMM d, y' }}</span>
              <span class="cell price">{{ formatPrice(o.total_usd) }}</span>
              <span class="cell">
                <span class="status-pill" [class]="o.status">{{ o.status }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Settings tab -->
        <div *ngIf="activeTab === 'settings'" class="tab-content">
          <div class="tab-header">
            <h1>Account Settings</h1>
            <p>Manage your profile and preferences.</p>
          </div>

          <div class="settings-layout">
            <div class="settings-card">
              <h3>Profile Information</h3>
              <div class="profile-avatar-row">
                <div class="big-avatar">{{ getInitials() }}</div>
                <div>
                  <div class="profile-name">{{ user?.full_name }}</div>
                  <div class="profile-email">{{ user?.email }}</div>
                  <span class="role-badge">{{ user?.role }}</span>
                </div>
              </div>
              <div class="field">
                <label>Full Name</label>
                <input type="text" [value]="user?.full_name || ''" readonly />
              </div>
              <div class="field">
                <label>Email</label>
                <input type="email" [value]="user?.email || ''" readonly />
              </div>
              <div class="field">
                <label>Member Since</label>
                <input type="text" [value]="(user?.created_at | date:'MMMM d, y') || ''" readonly />
              </div>
              <div class="field">
                <label>Email Verified</label>
                <input type="text" [value]="user?.email_verified ? 'Yes ✅' : 'No — check your inbox'" readonly />
              </div>
            </div>

            <div class="settings-card danger-zone">
              <h3>Account Actions</h3>
              <p>Sign out of your Indigo account on this device.</p>
              <button class="btn btn-danger" (click)="logout()">
                Sign Out
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: [`
    /* ── Layout ───────────────────────────────── */
    .dashboard {
      display: flex;
      min-height: calc(100vh - 64px);
      background: #f8fafc;
    }

    /* ── Sidebar ──────────────────────────────── */
    .sidebar {
      width: 256px;
      background: #fff;
      border-right: 1px solid #e2e8f0;
      padding: 24px 12px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      flex-shrink: 0;
      position: sticky;
      top: 64px;
      height: calc(100vh - 64px);
      overflow-y: auto;
    }
    .user-card {
      display: flex; gap: 12px; align-items: center;
      padding: 12px; background: #f8fafc;
      border-radius: 12px;
    }
    .avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff; display: flex; align-items: center;
      justify-content: center; font-size: 16px; font-weight: 700;
      flex-shrink: 0;
    }
    .user-meta { overflow: hidden; }
    .user-name  { font-size: 14px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-email { font-size: 12px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .role-badge {
      display: inline-block; padding: 2px 8px;
      background: #ede9fe; color: #4f46e5;
      font-size: 11px; font-weight: 700;
      border-radius: 20px; text-transform: uppercase; margin-top: 4px;
    }

    .side-nav { display: flex; flex-direction: column; gap: 2px; }
    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 8px;
      font-size: 14px; font-weight: 500; color: #475569;
      background: none; border: none; cursor: pointer;
      text-align: left; transition: all 0.15s; width: 100%;
    }
    .nav-item:hover  { background: #f8fafc; color: #0f172a; }
    .nav-item.active { background: #ede9fe; color: #4f46e5; font-weight: 600; }
    .nav-icon { font-size: 16px; width: 20px; text-align: center; }
    .nav-badge {
      margin-left: auto; background: #4f46e5; color: #fff;
      font-size: 11px; font-weight: 700; padding: 2px 7px;
      border-radius: 20px;
    }

    .sidebar-actions {
      border-top: 1px solid #f1f5f9;
      padding-top: 16px;
      display: flex; flex-direction: column; gap: 4px;
    }
    .sidebar-link {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 12px; border-radius: 8px;
      font-size: 13px; color: #64748b; text-decoration: none;
      transition: all 0.15s;
    }
    .sidebar-link:hover { background: #f8fafc; color: #0f172a; }

    /* ── Main ─────────────────────────────────── */
    .main { flex: 1; overflow-y: auto; }
    .tab-content { padding: 36px 40px; max-width: 900px; }

    .tab-header { margin-bottom: 28px; }
    .tab-header h1 {
      font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 4px;
    }
    .tab-header p { color: #64748b; font-size: 15px; margin: 0 0 16px; }

    /* ── Stats row ────────────────────────────── */
    .stats-row {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 14px; margin-bottom: 32px;
    }
    .stat-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      padding: 18px; display: flex; align-items: center; gap: 14px;
      cursor: pointer; transition: all 0.2s;
    }
    .stat-card:hover {
      border-color: #c7d2fe;
      box-shadow: 0 4px 16px rgba(79,70,229,0.08);
    }
    .stat-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .stat-icon.courses  { background: #ede9fe; }
    .stat-icon.bookings { background: #dbeafe; }
    .stat-icon.orders   { background: #dcfce7; }
    .stat-icon.progress { background: #fef9c3; }
    .stat-body { flex: 1; }
    .stat-value { font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1; }
    .stat-label { font-size: 12px; color: #64748b; margin-top: 3px; }
    .stat-arrow { font-size: 16px; color: #cbd5e1; margin-left: auto; }

    /* ── Section blocks ───────────────────────── */
    .section-block {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      padding: 22px; margin-bottom: 20px;
    }
    .block-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .block-header h2 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; }
    .view-all-btn {
      font-size: 13px; color: #4f46e5; font-weight: 600;
      background: none; border: none; cursor: pointer;
    }
    .view-all-btn:hover { text-decoration: underline; }

    /* Booking rows */
    .bookings-list { display: flex; flex-direction: column; gap: 10px; }
    .booking-row {
      display: flex; align-items: center; gap: 12px;
      padding: 10px; border-radius: 8px; background: #f8fafc;
    }
    .booking-icon { font-size: 20px; }
    .booking-info { flex: 1; display: flex; flex-direction: column; }
    .booking-info strong { font-size: 14px; font-weight: 600; color: #0f172a; }
    .booking-info span   { font-size: 12px; color: #64748b; }

    /* Progress rows */
    .progress-list { display: flex; flex-direction: column; gap: 12px; }
    .progress-row {}
    .progress-info {
      display: flex; justify-content: space-between;
      font-size: 13px; margin-bottom: 4px;
    }
    .course-name  { color: #475569; font-weight: 500; }
    .progress-pct { color: #4f46e5; font-weight: 700; }
    .progress-bar {
      height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4f46e5, #7c3aed);
      border-radius: 3px; transition: width 0.5s ease;
    }
    .progress-fill.complete { background: linear-gradient(90deg, #10b981, #059669); }

    /* ── Quick actions ────────────────────────── */
    .quick-actions { margin-top: 24px; }
    .quick-actions h2 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 14px; }
    .actions-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
    }
    .action-card {
      display: flex; align-items: center; gap: 14px;
      padding: 16px; background: #fff; border: 1px solid #e2e8f0;
      border-radius: 12px; text-decoration: none; transition: all 0.2s;
    }
    .action-card:hover {
      border-color: #c7d2fe;
      box-shadow: 0 4px 12px rgba(79,70,229,0.08);
    }
    .action-icon { font-size: 26px; flex-shrink: 0; }
    .action-card strong { display: block; font-size: 14px; font-weight: 700; color: #0f172a; }
    .action-card p { font-size: 12px; color: #64748b; margin: 2px 0 0; }

    /* ── Courses grid ─────────────────────────── */
    .courses-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr));
      gap: 16px;
    }
    .course-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      overflow: hidden; display: flex; flex-direction: column;
    }
    .course-thumb {
      height: 100px;
      background: linear-gradient(135deg, #ede9fe, #c4b5fd);
      display: flex; align-items: center; justify-content: center;
      font-size: 40px;
    }
    .course-info { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
    .course-id    { font-size: 14px; font-weight: 700; color: #0f172a; }
    .enrollment-date { font-size: 12px; color: #94a3b8; }
    .progress-section {}
    .progress-header {
      display: flex; justify-content: space-between;
      font-size: 12px; margin-bottom: 4px; color: #64748b;
    }
    .progress-header strong { color: #4f46e5; }
    .course-actions {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: 4px;
    }

    /* ── Tables ───────────────────────────────── */
    .bookings-table, .orders-table {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      overflow: hidden;
    }
    .table-header {
      display: grid;
      background: #f8fafc; padding: 12px 20px;
      font-size: 12px; font-weight: 700; color: #64748b;
      text-transform: uppercase; letter-spacing: 0.5px;
      border-bottom: 1px solid #e2e8f0;
    }
    .bookings-table .table-header { grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr; }
    .orders-table   .table-header { grid-template-columns: 1.5fr 1.5fr 1fr 1fr; }
    .table-row {
      display: grid; padding: 14px 20px;
      border-bottom: 1px solid #f1f5f9; align-items: center;
    }
    .table-row:last-child { border-bottom: none; }
    .bookings-table .table-row { grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr; }
    .orders-table   .table-row { grid-template-columns: 1.5fr 1.5fr 1fr 1fr; }
    .cell { font-size: 14px; color: #475569; display: flex; align-items: center; gap: 8px; }
    .cell strong { display: block; font-weight: 600; color: #0f172a; }
    .cell small  { font-size: 12px; color: #94a3b8; }
    .cell-icon { font-size: 18px; }
    .price { font-weight: 700; color: #4f46e5; }

    .zoom-btn {
      padding: 4px 12px; background: #2563eb; color: #fff;
      border-radius: 6px; font-size: 12px; font-weight: 700;
      text-decoration: none; transition: background 0.2s;
    }
    .zoom-btn:hover { background: #1d4ed8; }
    .no-zoom { font-size: 12px; color: #94a3b8; }

    /* ── Status pills ─────────────────────────── */
    .status-pill {
      display: inline-block; padding: 3px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 700; text-transform: capitalize;
    }
    .status-pill.pending   { background: #fef9c3; color: #854d0e; }
    .status-pill.confirmed { background: #dcfce7; color: #15803d; }
    .status-pill.cancelled { background: #fee2e2; color: #b91c1c; }
    .status-pill.completed { background: #ede9fe; color: #4f46e5; }
    .status-pill.active    { background: #dcfce7; color: #15803d; }
    .status-pill.paid      { background: #dcfce7; color: #15803d; }

    /* ── Settings ─────────────────────────────── */
    .settings-layout { display: flex; flex-direction: column; gap: 20px; }
    .settings-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px;
    }
    .settings-card h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 20px; }
    .profile-avatar-row {
      display: flex; gap: 16px; align-items: center; margin-bottom: 24px;
      padding: 16px; background: #f8fafc; border-radius: 12px;
    }
    .big-avatar {
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff; display: flex; align-items: center;
      justify-content: center; font-size: 20px; font-weight: 700;
    }
    .profile-name  { font-size: 16px; font-weight: 700; color: #0f172a; }
    .profile-email { font-size: 14px; color: #64748b; }
    .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
    label  { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    input  {
      padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 14px; color: #475569; background: #f8fafc;
    }
    .danger-zone { border-color: #fecaca; }
    .danger-zone h3 { color: #b91c1c; }
    .danger-zone p { font-size: 14px; color: #64748b; margin: 0 0 16px; }

    /* ── Buttons ──────────────────────────────── */
    .btn {
      padding: 10px 20px; border-radius: 8px; font-size: 14px;
      font-weight: 700; text-decoration: none; border: none;
      cursor: pointer; transition: all 0.2s;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .btn-sm  { padding: 7px 14px; font-size: 12px; }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-danger  { background: #ef4444; color: #fff; }
    .btn-danger:hover { background: #dc2626; }

    /* ── States ───────────────────────────────── */
    .loading-state { text-align: center; color: #64748b; padding: 48px; }
    .empty-state {
      text-align: center; padding: 60px 24px;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
    }
    .empty-icon { font-size: 48px; margin-bottom: 14px; }
    .empty-state h3 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
    .empty-state p  { color: #64748b; margin: 0 0 20px; }

    /* ── Responsive ───────────────────────────── */
    @media (max-width: 900px) {
      .dashboard { flex-direction: column; }
      .sidebar {
        width: 100%; height: auto; position: static;
        border-right: none; border-bottom: 1px solid #e2e8f0;
        flex-direction: row; flex-wrap: wrap; padding: 12px;
      }
      .user-card { display: none; }
      .side-nav { flex-direction: row; flex: 1; }
      .sidebar-actions { display: none; }
      .tab-content { padding: 24px 16px; }
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .actions-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  user:        User | null  = null;
  enrollments: Enrollment[] = [];
  bookings:    Booking[]    = [];
  orders:      Order[]      = [];

  loadingCourses  = true;
  loadingBookings = true;
  loadingOrders   = true;

  activeTab = 'overview';

  tabs = [
    { id: 'overview',  label: 'Overview',      icon: '🏠', badge: false },
    { id: 'courses',   label: 'My Courses',    icon: '📚', badge: true  },
    { id: 'bookings',  label: 'Bookings',      icon: '📅', badge: true  },
    { id: 'orders',    label: 'Orders',        icon: '🛒', badge: true  },
    { id: 'settings',  label: 'Settings',      icon: '⚙️', badge: false },
  ];

  constructor(
    private authService:    AuthService,
    private coursesService: CoursesService,
    private bookingService: BookingService,
    private shopService:    ShopService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;

    this.coursesService.myEnrollments().subscribe({
      next: data => { this.enrollments = data; this.loadingCourses = false; },
      error: ()   => { this.loadingCourses = false; }
    });

    this.bookingService.myBookings().subscribe({
      next: data => {
        this.bookings = data.data || data || [];
        this.loadingBookings = false;
      },
      error: () => { this.loadingBookings = false; }
    });

    this.shopService.myOrders().subscribe({
      next: data => { this.orders = data; this.loadingOrders = false; },
      error: ()   => { this.loadingOrders = false; }
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
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvgProgress(): number {
    if (!this.enrollments.length) return 0;
    const sum = this.enrollments.reduce((a, e) => a + e.progress_pct, 0);
    return Math.round(sum / this.enrollments.length);
  }

  getBadgeCount(tabId: string): number {
    if (tabId === 'courses')  return this.enrollments.length;
    if (tabId === 'bookings') return this.bookings.length;
    if (tabId === 'orders')   return this.orders.length;
    return 0;
  }

  formatPrice(price: number): string {
     return '$' + price;

   }
   goToCourse(courseId: string): void {
  window.location.href = `/courses/${courseId}/learn`;
}

  logout(): void {
    this.authService.logout();
  }
}