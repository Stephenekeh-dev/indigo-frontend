import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ServiceListing } from '../../../models/service.model';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-head">
        <div>
          <h1>Services</h1>
          <p>Manage consulting service listings</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          {{ showForm ? '✕ Cancel' : '+ Add Service' }}
        </button>
      </div>

      <!-- Add service form -->
      <div class="form-card" *ngIf="showForm">
        <h2>New Service</h2>
        <div class="form-grid">
          <div class="field">
            <label>Title *</label>
            <input type="text" [(ngModel)]="newService.title" placeholder="e.g. Rust Migration Consulting" />
          </div>
          <div class="field">
            <label>Service Type *</label>
            <select [(ngModel)]="newService.service_type">
              <option value="migration">Migration</option>
              <option value="custom_app">Custom App</option>
              <option value="code_review">Code Review</option>
              <option value="general_consulting">General Consulting</option>
              <option value="retainer">Retainer</option>
              <option value="blockchain_consulting">Blockchain Consulting</option>
            </select>
          </div>
          <div class="field">
            <label>Price (USD/hr) *</label>
            <input type="number" [(ngModel)]="newService.price_usd" placeholder="150" />
          </div>
          <div class="field">
            <label>Duration (hours)</label>
            <input type="number" [(ngModel)]="newService.duration_hours" placeholder="1" />
          </div>
          <div class="field full">
            <label>Short Description</label>
            <input type="text" [(ngModel)]="newService.short_desc" placeholder="One line summary" />
          </div>
          <div class="field full">
            <label>Full Description *</label>
            <textarea [(ngModel)]="newService.description" rows="4" placeholder="Detailed description..."></textarea>
          </div>
        </div>
        <div class="form-actions">
          <div class="success-msg" *ngIf="createSuccess">✅ Service created successfully!</div>
          <div class="error-msg"   *ngIf="createError">{{ createError }}</div>
          <button class="btn btn-primary" (click)="createService()" [disabled]="creating">
            {{ creating ? 'Creating...' : 'Create Service' }}
          </button>
        </div>
      </div>

      <!-- Services table -->
      <div class="data-card">
        <div class="loading" *ngIf="loading">Loading services...</div>
        <table class="data-table" *ngIf="!loading">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of services">
              <td>
                <strong>{{ s.title }}</strong>
                <small>{{ s.short_desc }}</small>
              </td>
              <td><span class="type-badge">{{ s.service_type.replace('_',' ') }}</span></td>
              <td class="price">{{ formatPrice(s.price_usd) }}/hr</td>
              <td>{{ s.duration_hours ? s.duration_hours + 'h' : '—' }}</td>
              <td>
                <span class="status-dot active" *ngIf="s.is_active">Active</span>
                <span class="status-dot inactive" *ngIf="!s.is_active">Inactive</span>
              </td>
            </tr>
            <tr *ngIf="services.length === 0">
              <td colspan="5" class="empty-row">No services found</td>
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
    label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    input, select, textarea {
      padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
      font-size: 14px; color: #0f172a; background: #fff; outline: none;
      transition: border-color 0.2s; font-family: inherit;
    }
    input:focus, select:focus, textarea:focus { border-color: #4f46e5; }
    textarea { resize: vertical; }
    .form-actions { display: flex; align-items: center; gap: 16px; }
    .success-msg { font-size: 14px; color: #15803d; font-weight: 500; }
    .error-msg   { font-size: 14px; color: #b91c1c; }

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
    .price { font-weight: 700; color: #4f46e5 !important; }
    .empty-row { text-align: center; color: #94a3b8; padding: 32px !important; }

    .type-badge {
      padding: 3px 10px; border-radius: 20px; font-size: 12px;
      font-weight: 600; background: #ede9fe; color: #4f46e5;
      text-transform: capitalize; white-space: nowrap;
    }
    .status-dot {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 600;
    }
    .status-dot::before {
      content: ''; width: 7px; height: 7px; border-radius: 50%;
    }
    .status-dot.active::before   { background: #10b981; }
    .status-dot.inactive::before { background: #ef4444; }
    .status-dot.active   { color: #15803d; }
    .status-dot.inactive { color: #b91c1c; }

    .btn {
      padding: 10px 20px; border-radius: 8px; font-size: 14px;
      font-weight: 700; border: none; cursor: pointer; transition: all 0.2s;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class AdminServicesComponent implements OnInit {
  services:      ServiceListing[] = [];
  loading        = true;
  showForm       = false;
  creating       = false;
  createSuccess  = false;
  createError    = '';

  newService = {
    title:         '',
    description:   '',
    short_desc:    '',
    service_type:  'general_consulting',
    price_usd:     100,
    duration_hours: 1,
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.listServices().subscribe({
      next: data => { this.services = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  createService(): void {
    if (!this.newService.title || !this.newService.description) return;
    this.creating     = true;
    this.createError  = '';
    this.createSuccess = false;

    this.adminService.createService(this.newService).subscribe({
      next: s => {
        this.services.unshift(s);
        this.creating      = false;
        this.createSuccess = true;
        this.showForm      = false;
        this.newService = {
          title: '', description: '', short_desc: '',
          service_type: 'general_consulting', price_usd: 100, duration_hours: 1
        };
        setTimeout(() => this.createSuccess = false, 3000);
      },
      error: e => {
        this.createError = e?.error?.error?.message || 'Failed to create service';
        this.creating    = false;
      }
    });
  }
  formatPrice(price: number): string {
     return '$' + price; 
    }
}