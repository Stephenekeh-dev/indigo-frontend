import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ShopService } from '../../../services/shop.service';
import { CartItem } from '../../../models/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <a routerLink="/shop/cart" class="back-link">← Back to cart</a>
        <h1>Checkout</h1>
      </div>

      <div class="container">
        <div class="loading" *ngIf="loading">Loading...</div>

        <div class="checkout-layout" *ngIf="!loading">

          <!-- Order summary -->
          <div class="order-summary">
            <h2>Order Summary</h2>
            <div class="order-items">
              <div class="order-item" *ngFor="let item of items">
                <div class="item-icon">🎁</div>
                <div class="item-info">
                  <strong>Product #{{ item.product_id.slice(0,8) }}</strong>
                  <span>Qty: {{ item.quantity }}</span>
                </div>
              </div>
              <div class="empty-cart" *ngIf="items.length === 0">
                <p>Your cart is empty.</p>
                <a routerLink="/shop" class="btn btn-primary">Browse Shop</a>
              </div>
            </div>
          </div>

          <!-- Payment section -->
          <div class="payment-section" *ngIf="items.length > 0">
            <h2>Payment</h2>

            <div class="success-box" *ngIf="orderPlaced">
              ✅ Order placed successfully! You will receive a confirmation email shortly.
              <br><br>
              <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard →</a>
            </div>

            <div class="payment-card" *ngIf="!orderPlaced">
              <div class="stripe-placeholder">
                <div class="stripe-icon">💳</div>
                <h3>Stripe Payment</h3>
                <p>
                  Stripe integration will be connected here. For now click below
                  to simulate a successful order.
                </p>
                <div class="test-note">
                  🔧 Development mode — no real payment required
                </div>
                <button
                  class="btn btn-primary btn-full"
                  [disabled]="processing"
                  (click)="placeOrder()"
                >
                  {{ processing ? 'Processing...' : 'Place Order (Test)' }}
                </button>
              </div>
            </div>

            <div class="security-note">
              <span>🔒</span>
              Payments are secured by Stripe. Your card details are never stored on our servers.
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
      padding: 40px 24px; color: #fff;
    }
    .back-link {
      color: rgba(255,255,255,0.75); text-decoration: none;
      font-size: 14px; display: inline-block; margin-bottom: 12px;
    }
    .back-link:hover { color: #fff; }
    .page-header h1 { font-size: 32px; font-weight: 800; margin: 0; }

    .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
    .loading { text-align: center; color: #64748b; padding: 48px; }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      align-items: start;
    }

    .order-summary, .payment-section {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 28px;
    }
    .order-summary h2,
    .payment-section h2 {
      font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 20px;
    }

    .order-item {
      display: flex; gap: 12px; align-items: center;
      padding: 12px 0; border-bottom: 1px solid #f1f5f9;
    }
    .order-item:last-child { border-bottom: none; }
    .item-icon { font-size: 24px; }
    .item-info { display: flex; flex-direction: column; gap: 2px; }
    .item-info strong { font-size: 14px; font-weight: 600; color: #0f172a; }
    .item-info span   { font-size: 13px; color: #64748b; }

    .empty-cart { text-align: center; padding: 24px 0; }
    .empty-cart p { color: #64748b; margin: 0 0 16px; }

    .stripe-placeholder {
      text-align: center; padding: 24px;
      background: #f8fafc; border-radius: 12px;
      border: 2px dashed #e2e8f0;
    }
    .stripe-icon { font-size: 40px; margin-bottom: 12px; }
    .stripe-placeholder h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
    .stripe-placeholder p  { font-size: 14px; color: #64748b; margin: 0 0 16px; line-height: 1.6; }
    .test-note {
      display: inline-block; padding: 6px 14px;
      background: #fef9c3; color: #854d0e;
      border-radius: 20px; font-size: 12px; font-weight: 600;
      margin-bottom: 20px;
    }

    .success-box {
      background: #f0fdf4; border: 1px solid #bbf7d0;
      color: #15803d; padding: 20px; border-radius: 10px;
      font-size: 14px; font-weight: 500;
    }

    .security-note {
      display: flex; align-items: center; gap: 8px;
      margin-top: 16px; font-size: 12px; color: #94a3b8;
    }

    .btn {
      padding: 12px 20px; border-radius: 8px; font-size: 14px;
      font-weight: 700; text-decoration: none; border: none;
      cursor: pointer; transition: all 0.2s;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .btn-full { width: 100%; }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 680px) {
      .checkout-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  items:       CartItem[] = [];
  loading      = true;
  processing   = false;
  orderPlaced  = false;

  constructor(
    private shopService: ShopService,
    private router:      Router,
  ) {}

  ngOnInit(): void {
    this.shopService.getCart().subscribe({
      next: data => { this.items = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  placeOrder(): void {
    this.processing = true;
    // Simulate order processing — Stripe will be wired here
    setTimeout(() => {
      this.orderPlaced = true;
      this.processing  = false;
    }, 1500);
  }
}