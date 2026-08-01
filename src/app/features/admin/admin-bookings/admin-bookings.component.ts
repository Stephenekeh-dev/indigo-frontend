import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="page-head">
        <div>
          <h1>All Bookings</h1>
          <p>View and manage all consulting session bookings</p>
        </div>
        <div class="head-stats">
          <div class="head-stat">
            <strong>{{ bookings.length }}</strong>
            <span>Total</span>
          </div>
          <div class="head-stat pending">
            <strong>{{ countByStatus('pending') }}</strong>
            <span>Pending</span>
          </div>
          <div class="head-stat confirmed">
            <strong>{{ countByStatus('confirmed') }}</strong>
            <span>Confirmed</span>
          </div>
        </div>
      </div>

      <div class="data-card">
        <div class="loading" *ngIf="loading">Loading bookings...</div>

        <div class="empty-state" *ngIf="!loading && bookings.length === 0">
          <p>No bookings yet. They will appear here once clients book sessions.</p>
        </div>

        <table class="data-table" *ngIf="!loading && bookings.length > 0">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Scheduled</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Zoom</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of bookings">
              <td>
                <strong>#{{ b.id.slice(0,8) }}</strong>
              </td>
              <td>
                {{ b.scheduled_at | date:'MMM d, y' }}<br>
                <small>{{ b.scheduled_at | date:'h:mm a' }} UTC</small>
              </td>
              <td>{{ b.duration_minutes }} min</td>
              <td>
                <span class="status-pill" [class]="b.status">{{ b.status }}</span>
              </td>
              <td>
                <a *ngIf="b.zoom_join_url"
                   [href]="b.zoom_join_url"
                   target="_blank"
                   class="zoom-btn">Join ↗</a>
                <span *ngIf="!b.zoom_join_url" class="no-zoom">—</span>
              </td>
              <td>
                <span class="notes-text">{{ b.client_notes || '—' }}</span>
              </td>
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
    .head-stat.pending  strong { color: #854d0e; }
    .head-stat.confirmed strong { color: #15803d; }

    .data-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden;
    }
    .loading { padding: 48px; text-align: center; color: #64748b; }
    .empty-state { padding: 48px; text-align: center; color: #94a3b8; }
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
    .data-table td strong { display: block; font-weight: 600; color: #0f172a; font-size: 13px; }
    .data-table td small  { font-size: 12px; color: #94a3b8; }
    .notes-text { font-size: 12px; color: #94a3b8; max-width: 180px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .status-pill {
      display: inline-block; padding: 3px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 700; text-transform: capitalize;
    }
    .status-pill.pending   { background: #fef9c3; color: #854d0e; }
    .status-pill.confirmed { background: #dcfce7; color: #15803d; }
    .status-pill.cancelled { background: #fee2e2; color: #b91c1c; }
    .status-pill.completed { background: #ede9fe; color: #4f46e5; }

    .zoom-btn {
      padding: 4px 10px; background: #2563eb; color: #fff;
      border-radius: 6px; font-size: 12px; font-weight: 700;
      text-decoration: none;
    }
    .zoom-btn:hover { background: #1d4ed8; }
    .no-zoom { color: #94a3b8; font-size: 14px; }
  `]
})
export class AdminBookingsComponent implements OnInit {
  bookings: any[] = [];
  loading   = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.myBookings(1).subscribe({
      next: data => {
        this.bookings = data.data || data || [];
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  countByStatus(status: string): number {
    return this.bookings.filter(b => b.status === status).length;
  }
}