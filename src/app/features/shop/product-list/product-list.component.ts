import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShopService } from '../../../services/shop.service';
import { Product } from '../../../models/product.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Indigo Shop</h1>
        <p>Ebooks, templates, tools, and merch to accelerate your Rust journey.</p>
      </div>

      <div class="container">
        <div class="loading" *ngIf="loading">Loading products...</div>

        <div class="grid" *ngIf="!loading">
          <div class="product-card" *ngFor="let p of products">
            <div class="product-thumb">
              <img *ngIf="p.thumbnail_url" [src]="p.thumbnail_url" [alt]="p.title" />
              <div class="thumb-placeholder" *ngIf="!p.thumbnail_url">
                {{ getProductEmoji(p.product_type) }}
              </div>
              <span class="digital-badge" *ngIf="p.is_digital">Digital</span>
            </div>
            <div class="product-body">
              <span class="product-type">{{ p.product_type.replace('_', ' ') }}</span>
              <h2>{{ p.title }}</h2>
              <p>{{ p.short_desc || p.description.slice(0, 100) }}</p>
              <div class="product-footer">
                <div class="price-group">
                  <span class="compare-price" *ngIf="p.compare_price">
                    {{ formatPrice(p.compare_price) }}
                  </span>
                  <span class="price">{{ formatPrice(p.price_usd) }}</span>
                </div>
                <button class="btn btn-primary" (click)="addToCart(p)">
                  {{ addedIds.includes(p.id) ? '✓ Added' : 'Add to cart' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Placeholders -->
          <div class="product-card" *ngFor="let p of placeholders">
            <div class="product-thumb">
              <div class="thumb-placeholder">{{ p.emoji }}</div>
            </div>
            <div class="product-body">
              <span class="product-type">{{ p.type }}</span>
              <h2>{{ p.title }}</h2>
              <p>{{ p.desc }}</p>
              <div class="product-footer">
                <span class="price">{{ p.price }}</span>
                <a routerLink="/auth/register" class="btn btn-primary">Buy now</a>
              </div>
            </div>
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
    .container { max-width: 1100px; margin: 0 auto; padding: 48px 24px; }
    .loading { text-align: center; color: #64748b; padding: 48px; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    .product-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .product-card:hover {
      box-shadow: 0 8px 32px rgba(79,70,229,0.12);
      transform: translateY(-2px);
    }
    .product-thumb {
      position: relative;
      height: 160px;
      background: linear-gradient(135deg, #f5f3ff, #ede9fe);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .product-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .thumb-placeholder { font-size: 56px; }
    .digital-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #ede9fe;
      color: #4f46e5;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
    }
    .product-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 8px;
    }
    .product-type {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #4f46e5;
    }
    .product-body h2 { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0; }
    .product-body p  { color: #64748b; font-size: 14px; line-height: 1.5; margin: 0; flex: 1; }
    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }
    .price-group { display: flex; flex-direction: column; }
    .compare-price {
      font-size: 13px;
      color: #94a3b8;
      text-decoration: line-through;
    }
    .price { font-size: 18px; font-weight: 700; color: #4f46e5; }

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
  `]
})
export class ProductListComponent implements OnInit {
  products:  Product[] = [];
  loading  = true;
  addedIds: string[]   = [];

  placeholders = [
    { emoji: '📖', type: 'ebook',    title: 'Rust in Production',              desc: 'A practical guide to running Rust services at scale.',              price: '$29'  },
    { emoji: '🔧', type: 'template', title: 'Axum API Starter Template',       desc: 'Production-ready Rust REST API with auth, DB, and tests included.', price: '$19'  },
    { emoji: '👕', type: 'merch',    title: 'Indigo Rust Developer T-Shirt',   desc: 'Premium cotton tee with the Indigo logo and Rust crab.',            price: '$35'  },
    { emoji: '📦', type: 'bundle',   title: 'Complete Rust Course Bundle',     desc: 'All 10 courses for the price of 3. Lifetime access included.',      price: '$149' },
  ];

  constructor(
    private shopService: ShopService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.shopService.listProducts().subscribe({
      next: data => {
        this.products = data;
        this.loading  = false;
        if (data.length > 0) this.placeholders = [];
      },
      error: () => { this.loading = false; }
    });
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn) {
      window.location.href = '/auth/login';
      return;
    }
    this.shopService.addToCart(product.id).subscribe({
      next: () => this.addedIds.push(product.id),
      error: () => {}
    });
  }

  getProductEmoji(type: string): string {
    const map: Record<string, string> = {
      ebook: '📖', template: '🔧', tool: '⚙️',
      merch: '👕', course_bundle: '📦', other: '🎁'
    };
    return map[type] || '🎁';
  }

  formatPrice(price: number): string { return '$' + price; }
}