import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlockchainApiService, BlockchainService } from '../../../services/blockchain.service';

@Component({
  selector: 'app-blockchain-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Blockchain & Web3 Services</h1>
        <p>Rust-powered smart contracts, DeFi protocols, and blockchain consulting.</p>
      </div>

      <div class="container">
        <div class="loading" *ngIf="loading">Loading services...</div>

        <div class="filter-row" *ngIf="!loading">
          <button
            *ngFor="let n of networks"
            class="filter-btn"
            [class.active]="selectedNetwork === n.value"
            (click)="filterByNetwork(n.value)"
          >
            {{ n.label }}
          </button>
        </div>

        <!-- Real services from API -->
        <div class="grid" *ngIf="!loading && services.length > 0">
          <div class="service-card" *ngFor="let s of filtered">
            <div class="card-top">
              <div class="network-badge" [class]="s.network">
                {{ getNetworkIcon(s.network) }} {{ s.network }}
              </div>
              <div class="type-badge">{{ s.project_type.replace('_',' ') }}</div>
            </div>
            <h2>{{ s.title }}</h2>
            <p>{{ s.description.slice(0, 140) }}</p>
            <div class="card-footer">
              <span class="price" *ngIf="s.price_from_usd">
                from {{ formatPrice(s.price_from_usd) }}/hr
              </span>
              <a [routerLink]="['/blockchain', s.slug]" class="btn btn-primary">
                Learn more →
              </a>
            </div>
          </div>
        </div>

        <!-- Placeholders when API is empty -->
        <div class="grid" *ngIf="!loading && services.length === 0">
          <div class="service-card" *ngFor="let p of placeholders">
            <div class="card-top">
              <div class="network-badge" [class]="p.net">
                {{ getNetworkIcon(p.net) }} {{ p.net }}
              </div>
              <div class="type-badge">{{ p.type.replace('_',' ') }}</div>
            </div>
            <h2>{{ p.title }}</h2>
            <p>{{ p.description.slice(0, 140) }}</p>
            <div class="card-footer">
              <span class="price">from {{ formatPrice(p.price) }}/hr</span>
              <a routerLink="/blockchain" class="btn btn-primary">Learn more →</a>
            </div>
          </div>
        </div>

        <!-- Inquiry CTA -->
        <div class="inquiry-cta">
          <h2>Have a blockchain project in mind?</h2>
          <p>Tell us about your project and we will respond within 24 hours.</p>
          <a routerLink="/services" class="btn btn-white btn-lg">Submit an Inquiry →</a>
        </div>

        <!-- Why Rust for blockchain -->
        <div class="why-rust">
          <h2>Why Rust for Blockchain?</h2>
          <div class="why-grid">
            <div class="why-item" *ngFor="let w of whyRust">
              <div class="why-icon">{{ w.icon }}</div>
              <h3>{{ w.title }}</h3>
              <p>{{ w.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { background: #f8fafc; min-height: 100vh; }
    .page-header {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      padding: 72px 24px; text-align: center; color: #fff;
    }
    .page-header h1 { font-size: 40px; font-weight: 800; margin: 0 0 12px; }
    .page-header p  { font-size: 18px; opacity: 0.85; margin: 0; }

    .container { max-width: 1100px; margin: 0 auto; padding: 48px 24px; }
    .loading { text-align: center; color: #64748b; padding: 48px; }

    .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }
    .filter-btn {
      padding: 8px 18px; border-radius: 20px;
      border: 1.5px solid #e2e8f0; background: #fff;
      color: #475569; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .filter-btn:hover,
    .filter-btn.active {
      border-color: #7c3aed; background: #f5f3ff; color: #7c3aed;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 22px; margin-bottom: 64px;
    }
    .service-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
      padding: 26px; display: flex; flex-direction: column; gap: 12px;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .service-card:hover {
      box-shadow: 0 8px 32px rgba(124,58,237,0.12);
      transform: translateY(-3px);
    }
    .card-top { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .network-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 12px; border-radius: 20px; font-size: 12px;
      font-weight: 700; text-transform: capitalize;
      background: #f5f3ff; color: #7c3aed;
    }
    .network-badge.solana   { background: #f0fdf4; color: #15803d; }
    .network-badge.polkadot { background: #fdf2f8; color: #be185d; }
    .network-badge.near     { background: #eff6ff; color: #1d4ed8; }
    .network-badge.ethereum { background: #f5f3ff; color: #6d28d9; }
    .network-badge.substrate { background: #fff7ed; color: #c2410c; }
    .type-badge {
      padding: 4px 12px; border-radius: 20px; font-size: 12px;
      font-weight: 600; background: #ede9fe; color: #7c3aed;
      text-transform: capitalize;
    }
    .service-card h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
    .service-card p  { color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; flex: 1; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .price { font-size: 15px; font-weight: 700; color: #7c3aed; }

    .btn {
      padding: 10px 20px; border-radius: 8px; font-size: 14px;
      font-weight: 700; text-decoration: none; border: none;
      cursor: pointer; transition: all 0.2s;
      display: inline-flex; align-items: center;
    }
    .btn-lg { padding: 14px 28px; font-size: 16px; }
    .btn-primary { background: #7c3aed; color: #fff; }
    .btn-primary:hover { background: #6d28d9; }
    .btn-white { background: #fff; color: #7c3aed; font-weight: 800; }
    .btn-white:hover { background: #f5f3ff; }

    .inquiry-cta {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-radius: 20px; padding: 56px; text-align: center;
      margin-bottom: 64px; color: #fff;
    }
    .inquiry-cta h2 { font-size: 28px; font-weight: 800; margin: 0 0 12px; }
    .inquiry-cta p  { font-size: 16px; opacity: 0.85; margin: 0 0 28px; }

    .why-rust h2 {
      font-size: 28px; font-weight: 700; color: #0f172a;
      margin: 0 0 28px; text-align: center;
    }
    .why-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 18px;
    }
    .why-item {
      background: #fff; border: 1px solid #e2e8f0;
      border-radius: 12px; padding: 22px; text-align: center;
    }
    .why-icon { font-size: 32px; margin-bottom: 12px; }
    .why-item h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
    .why-item p  { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; }
  `]
})
export class BlockchainListComponent implements OnInit {
  services:       BlockchainService[] = [];
  filtered:       BlockchainService[] = [];
  loading         = true;
  selectedNetwork = 'all';

  networks = [
    { value: 'all',      label: 'All Networks'  },
    { value: 'solana',   label: '🟢 Solana'     },
    { value: 'polkadot', label: '🔴 Polkadot'   },
    { value: 'near',     label: '🔵 Near'        },
    { value: 'ethereum', label: '🟣 Ethereum'    },
  ];

  placeholders = [
    { title: 'Solana Program Development',   net: 'solana',   type: 'smart_contract', description: 'Build, test, and deploy Solana programs in Rust using the Anchor framework.', price: 200 },
    { title: 'Substrate / Polkadot Pallets', net: 'polkadot', type: 'protocol',       description: 'Design and build custom Substrate pallets for Polkadot parachains.',          price: 180 },
    { title: 'Blockchain Security Audit',    net: 'solana',   type: 'audit',          description: 'Comprehensive audit of your Rust blockchain code for vulnerabilities.',        price: 150 },
  ];

  whyRust = [
    { icon: '🔒', title: 'Memory Safety',  desc: 'No null pointers or buffer overflows — guaranteed at compile time.' },
    { icon: '⚡', title: 'Performance',    desc: 'C-level speed without garbage collection — critical for on-chain computation.' },
    { icon: '🌐', title: 'Native Support', desc: 'Solana, Polkadot, and Near all use Rust as their primary smart contract language.' },
    { icon: '🔍', title: 'Auditability',   desc: 'Rust code is explicit and predictable — easier to audit than Solidity.' },
  ];

  constructor(private blockchainService: BlockchainApiService) {}

  ngOnInit(): void {
    this.blockchainService.listServices().subscribe({
      next: data => {
        this.services = data;
        this.filtered = data;
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterByNetwork(network: string): void {
    this.selectedNetwork = network;
    this.filtered = network === 'all'
      ? this.services
      : this.services.filter(s => s.network === network);
  }

  getNetworkIcon(network: string): string {
    const map: Record<string, string> = {
      solana: '🟢', polkadot: '🔴', near: '🔵',
      ethereum: '🟣', substrate: '🟠', other: '⚪'
    };
    return map[network] || '⚪';
  }

  formatPrice(price: number): string { return '$' + price; }
}