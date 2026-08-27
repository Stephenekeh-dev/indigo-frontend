import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
            <span>Total</span>
          </div>
          <div class="head-stat">
            <strong>{{ countVerified() }}</strong>
            <span>Verified</span>
          </div>
          <div class="head-stat">
            <strong>{{ countByRole('admin') }}</strong>
            <span>Admins</span>
          </div>
        </div>
      </div>

      <div class="data-card">
        <div class="loading" *ngIf="loading">Loading users...</div>

        <table class="data-table" *ngIf="!loading">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>
                <div class="user-cell">
                  <div class="avatar">{{ getInitials(u.full_name) }}</div>
                  <strong>{{ u.full_name }}</strong>
                </div>
              </td>
              <td>{{ u.email }}</td>
              <td>
                <span class="role-badge" [class]="u.role">{{ u.role }}</span>
              </td>
              <td>
                <span *ngIf="u.email_verified"  class="verified">✅ Yes</span>
                <span *ngIf="!u.email_verified" class="unverified">⚠️ No</span>
              </td>
              <td>{{ u.created_at | date:'MMM d, y' }}</td>
            </tr>
            <tr *ngIf="users.length === 0">
              <td colspan="5" class="empty-row">No users found</td>
            </tr>
          </tbody>
        </table>
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
      padding: 10px 16px; text-align: center; min-width: 72px;
    }
    .head-stat strong { display: block; font-size: 20px; font-weight: 800; color: #0f172a; }
    .head-stat span   { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

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
    .empty-row { text-align: center; color: #94a3b8; padding: 32px !important; }

    .user-cell { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff; display: flex; align-items: center;
      justify-content: center; font-size: 13px; font-weight: 700;
      flex-shrink: 0;
    }
    .user-cell strong { font-weight: 600; color: #0f172a; }

    .role-badge {
      padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700;
      text-transform: uppercase;
    }
    .role-badge.admin      { background: #fee2e2; color: #b91c1c; }
    .role-badge.consultant { background: #fef9c3; color: #854d0e; }
    .role-badge.user       { background: #ede9fe; color: #4f46e5; }

    .verified   { font-size: 13px; color: #15803d; font-weight: 600; }
    .unverified { font-size: 13px; color: #854d0e; font-weight: 600; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users:   any[] = [];
  loading  = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/auth/users`).subscribe({
      next: data => { this.users = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  countVerified(): number {
    return this.users.filter(u => u.email_verified).length;
  }

  countByRole(role: string): number {
    return this.users.filter(u => u.role === role).length;
  }
}