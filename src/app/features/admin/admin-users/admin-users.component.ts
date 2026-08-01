import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="page-head">
        <div>
          <h1>Users</h1>
          <p>All registered Indigo members</p>
        </div>
        <div class="head-stats">
          <div class="head-stat">
            <strong>{{ users.length }}</strong>
            <span>Total Users</span>
          </div>
          <div class="head-stat">
            <strong>{{ countVerified() }}</strong>
            <span>Verified</span>
          </div>
        </div>
      </div>

      <div class="data-card">
        <div class="loading" *ngIf="loading">Loading users...</div>

        <div class="current-user-card" *ngIf="!loading">
          <h3>Currently Logged In</h3>
          <div class="user-row featured">
            <div class="user-avatar">{{ getInitials(currentUser?.full_name) }}</div>
            <div class="user-info">
              <strong>{{ currentUser?.full_name }}</strong>
              <span>{{ currentUser?.email }}</span>
            </div>
            <span class="role-badge" [class]="currentUser?.role">
              {{ currentUser?.role }}
            </span>
            <span class="verified-badge" *ngIf="currentUser?.email_verified">
              ✅ Verified
            </span>
            <span class="unverified-badge" *ngIf="!currentUser?.email_verified">
              ⚠️ Unverified
            </span>
          </div>
        </div>

        <div class="note-box" *ngIf="!loading">
          <p>
            📌 Full user management (list all users, change roles, suspend accounts)
            requires an admin-specific backend endpoint. This will be added in the
            next backend update. For now you can see your own account above.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
    }
    .page-head h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
    .page-head p  { font-size: 14px; color: #64748b; margin: 0; }
    .head-stats { display: flex; gap: 12px; }
    .head-stat {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
      padding: 10px 16px; text-align: center; min-width: 80px;
    }
    .head-stat strong { display: block; font-size: 20px; font-weight: 800; color: #0f172a; }
    .head-stat span   { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

    .data-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      overflow: hidden;
    }
    .loading { padding: 48px; text-align: center; color: #64748b; }

    .current-user-card { padding: 24px; border-bottom: 1px solid #f1f5f9; }
    .current-user-card h3 { font-size: 14px; font-weight: 600; color: #64748b; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px; }

    .user-row {
      display: flex; align-items: center; gap: 14px;
      padding: 14px; border-radius: 10px;
    }
    .user-row.featured { background: #f8fafc; border: 1px solid #e2e8f0; }
    .user-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff; display: flex; align-items: center;
      justify-content: center; font-size: 15px; font-weight: 700;
      flex-shrink: 0;
    }
    .user-info { flex: 1; }
    .user-info strong { display: block; font-size: 15px; font-weight: 700; color: #0f172a; }
    .user-info span   { font-size: 13px; color: #64748b; }

    .role-badge {
      padding: 4px 12px; border-radius: 20px; font-size: 12px;
      font-weight: 700; text-transform: uppercase;
    }
    .role-badge.admin       { background: #fee2e2; color: #b91c1c; }
    .role-badge.consultant  { background: #fef9c3; color: #854d0e; }
    .role-badge.user        { background: #ede9fe; color: #4f46e5; }

    .verified-badge   { font-size: 13px; color: #15803d; font-weight: 600; }
    .unverified-badge { font-size: 13px; color: #854d0e; font-weight: 600; }

    .note-box {
      padding: 20px 24px;
      background: #f8fafc;
      border-top: 1px solid #f1f5f9;
    }
    .note-box p {
      font-size: 14px; color: #64748b; margin: 0; line-height: 1.6;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  currentUser: User | null = null;
  users:       User[]      = [];
  loading      = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.users       = this.currentUser ? [this.currentUser] : [];
    this.loading     = false;
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  countVerified(): number {
    return this.users.filter(u => u.email_verified).length;
  }
}