import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShopService } from '../../../services/shop.service';
import { CartItem } from '../../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Your Cart</h1>
        <a routerLink="/shop" class="back-link">← Continue shopping</a>
      </div>

      <div class="container">
        <div class="loading" *ngIf="loading">Loading cart...</div>

        <div class="empty-cart" *ngIf="!loading && items.length === 0">
          <div class="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started.</p>
          <a routerLink="/shop" class="btn btn-primary">Browse Shop</a>
        </div>

        <div class="cart-layout" *ngIf="!loading && items.length > 0">
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of items">
              <div class="item-icon">🎁</div>
              <div class="item-info">
                <h3>Product #{{ item.product_id.slice(0, 8) }}</h3>
                <p>Qty: {{ item.quantity }}</p>
              </div>
              <button class="remove-btn" (click)="remove(item)">Remove</button>
            </div>
          </div>

          <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
              <span>Items ({{ items.length }})</span>
              <span>—</span>
            </div>
            <div class="summary-divider"></div>
           <a routerLink="/shop/checkout" class="btn btn-primary btn-full">
            Proceed to Checkout
          </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { background: #f8fafc; min-height: 100vh; }
    .page-header {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      padding: 48px 24px;
      display: flex;
      align-items: center;
      gap: 24px;
      color: #fff;
    }
    .page-header h1 { font-size: 32px; font-weight: 800; margin: 0; }
    .back-link { color: rgba(255,255,255,0.75); text-decoration: none; font-size: 14px; }
    .back-link:hover { color: #fff; }
    .container { max-width: 900px; margin: 0 auto; padding: 48px 24px; }
    .loading { text-align: center; color: #64748b; padding: 48px; }

    .empty-cart {
      text-align: center;
      padding: 64px;
      background: #fff;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    .empty-icon { font-size: 56px; margin-bottom: 16px; }
    .empty-cart h2 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
    .empty-cart p  { color: #64748b; margin: 0 0 24px; }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 24px;
      align-items: start;
    }
    .cart-items { display: flex; flex-direction: column; gap: 12px; }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
    }
    .item-icon { font-size: 32px; }
    .item-info { flex: 1; }
    .item-info h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
    .item-info p  { font-size: 13px; color: #64748b; margin: 0; }
    .remove-btn {
      padding: 6px 14px;
      border-radius: 6px;
      border: 1px solid #fecaca;
      background: #fef2f2;
      color: #b91c1c;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .remove-btn:hover { background: #fee2e2; }

    .cart-summary {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 24px;
      position: sticky;
      top: 80px;
    }
    .cart-summary h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 16px; }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #475569;
      margin-bottom: 10px;
    }
    .summary-divider { border-top: 1px solid #e2e8f0; margin: 16px 0; }
    .btn {
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-full { width: 100%; }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }

    @media (max-width: 768px) {
      .cart-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class CartComponent implements OnInit {
  items:   CartItem[] = [];
  loading = true;

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.shopService.getCart().subscribe({
      next: data => { this.items = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  remove(item: CartItem): void {
    this.shopService.removeFromCart(item.product_id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.product_id !== item.product_id);
      },
      error: () => {}
    });
  }
}
