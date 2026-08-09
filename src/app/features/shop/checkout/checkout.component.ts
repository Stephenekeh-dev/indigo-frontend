import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../../services/shop.service';
import { PaymentService } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';
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

        <!-- Payment success page -->
        <div class="success-page" *ngIf="paymentSuccess">
          <div class="success-icon">✅</div>
          <h2>Payment Successful!</h2>
          <p>Your order has been confirmed. You will receive a confirmation email shortly.</p>
          <div class="success-details" *ngIf="verifyResult">
            <div class="detail-row">
              <span>Reference</span>
              <strong>{{ verifyResult.reference }}</strong>
            </div>
            <div class="detail-row">
              <span>Amount</span>
              <strong>{{ formatPrice(verifyResult.amount) }}</strong>
            </div>
            <div class="detail-row">
              <span>Status</span>
              <strong class="paid">Paid ✓</strong>
            </div>
          </div>
          <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard →</a>
        </div>

        <div class="checkout-layout" *ngIf="!loading && !paymentSuccess">

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

            <div class="order-total" *ngIf="items.length > 0">
              <span>Items</span>
              <strong>{{ items.length }} item(s)</strong>
            </div>
          </div>

          <!-- Payment section -->
          <div class="payment-section" *ngIf="items.length > 0">
            <h2>Payment</h2>

            <div class="paystack-card">
              <div class="paystack-header">
                <img
                  src="https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png"
                  alt="Paystack"
                  class="paystack-logo"
                  onerror="this.style.display='none'"
                />
                <span class="paystack-label">Pay securely with Paystack</span>
              </div>

              <div class="paystack-features">
                <div class="feature-item">💳 Cards (Visa, Mastercard, Verve)</div>
                <div class="feature-item">🏦 Bank Transfer</div>
                <div class="feature-item">📱 USSD</div>
                <div class="feature-item">🔒 256-bit SSL encrypted</div>
              </div>

              <div class="test-mode-notice">
                🔧 Test Mode — use card <strong>4084 0840 8408 4081</strong>,
                any future expiry, CVV <strong>408</strong>
              </div>

              <div class="error-box" *ngIf="paymentError">{{ paymentError }}</div>

              <button
                class="btn btn-paystack btn-full"
                [disabled]="initiating"
                (click)="initiatePayment()"
              >
                <span *ngIf="!initiating">🔐 Pay with Paystack →</span>
                <span *ngIf="initiating">Redirecting to Paystack...</span>
              </button>

              <p class="security-note">
                🔒 Your payment is secured by Paystack.
                Card details are never stored on our servers.
              </p>
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

    /* Success page */
    .success-page {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
      padding: 48px; text-align: center;
    }
    .success-icon { font-size: 56px; margin-bottom: 16px; }
    .success-page h2 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 10px; }
    .success-page p  { color: #64748b; margin: 0 0 28px; }
    .success-details {
      background: #f8fafc; border-radius: 12px; padding: 20px;
      margin-bottom: 28px; text-align: left; max-width: 360px;
      margin-left: auto; margin-right: auto;
    }
    .detail-row {
      display: flex; justify-content: space-between;
      font-size: 14px; color: #475569; padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-row strong { color: #0f172a; }
    .paid { color: #15803d !important; }

    /* Checkout layout */
    .checkout-layout {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 28px; align-items: start;
    }
    .order-summary, .payment-section {
      background: #fff; border: 1px solid #e2e8f0;
      border-radius: 16px; padding: 28px;
    }
    .order-summary h2, .payment-section h2 {
      font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 20px;
    }
    .order-item {
      display: flex; gap: 12px; align-items: center;
      padding: 12px 0; border-bottom: 1px solid #f1f5f9;
    }
    .order-item:last-child { border-bottom: none; }
    .item-icon { font-size: 24px; }
    .item-info strong { display: block; font-size: 14px; font-weight: 600; color: #0f172a; }
    .item-info span   { font-size: 13px; color: #64748b; }
    .order-total {
      display: flex; justify-content: space-between;
      padding-top: 14px; margin-top: 14px;
      border-top: 1px solid #e2e8f0;
      font-size: 15px; color: #475569;
    }
    .order-total strong { color: #0f172a; font-weight: 700; }
    .empty-cart { text-align: center; padding: 24px 0; }
    .empty-cart p { color: #64748b; margin: 0 0 16px; }

    /* Paystack card */
    .paystack-card {
      display: flex; flex-direction: column; gap: 18px;
    }
    .paystack-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px; background: #0ba4db;
      border-radius: 10px; color: #fff;
    }
    .paystack-logo { width: 32px; height: 32px; object-fit: contain; }
    .paystack-label { font-size: 15px; font-weight: 700; }
    .paystack-features {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    }
    .feature-item {
      font-size: 13px; color: #475569; padding: 8px 12px;
      background: #f8fafc; border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .test-mode-notice {
      background: #fef9c3; border: 1px solid #fde047;
      color: #854d0e; padding: 12px 14px; border-radius: 8px;
      font-size: 13px; line-height: 1.6;
    }
    .error-box {
      background: #fef2f2; border: 1px solid #fecaca;
      color: #b91c1c; padding: 12px 16px;
      border-radius: 8px; font-size: 14px;
    }
    .security-note {
      font-size: 12px; color: #94a3b8; text-align: center; margin: 0;
    }

    .btn {
      padding: 12px 20px; border-radius: 8px; font-size: 14px;
      font-weight: 700; text-decoration: none; border: none;
      cursor: pointer; transition: all 0.2s;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .btn-full { width: 100%; }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-paystack { background: #0ba4db; color: #fff; font-size: 15px; padding: 14px; }
    .btn-paystack:hover:not(:disabled) { background: #0990c4; }
    .btn-paystack:disabled { opacity: 0.7; cursor: not-allowed; }

    @media (max-width: 680px) {
      .checkout-layout { grid-template-columns: 1fr; }
      .paystack-features { grid-template-columns: 1fr; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  items:         CartItem[] = [];
  loading        = true;
  initiating     = false;
  paymentSuccess = false;
  paymentError   = '';
  verifyResult:  any = null;

  constructor(
    private shopService:    ShopService,
    private paymentService: PaymentService,
    private authService:    AuthService,
    private route:          ActivatedRoute,
    private router:         Router,
  ) {}

  ngOnInit(): void {
    // Check if returning from Paystack with a reference
    const reference = this.route.snapshot.queryParamMap.get('reference') ||
                      this.route.snapshot.queryParamMap.get('trxref');

    if (reference) {
      this.loading = true;
      this.paymentService.verify(reference).subscribe({
        next: result => {
          this.loading        = false;
          this.verifyResult   = result;
          this.paymentSuccess = result.paid;
          if (!result.paid) {
            this.paymentError = 'Payment was not completed. Please try again.';
          }
        },
        error: () => {
          this.loading      = false;
          this.paymentError = 'Could not verify payment. Please contact support.';
        }
      });
      return;
    }

    this.shopService.getCart().subscribe({
      next: data => { this.items = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  initiatePayment(): void {
    const user = this.authService.currentUser;
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.initiating   = true;
    this.paymentError = '';

    // Calculate total — for now use item count as proxy
    // In production each cart item would have a price
    const amount = this.items.length * 10; // $10 per item as placeholder

    this.paymentService.initialize(
      user.email,
      amount,
      'cart',
    ).subscribe({
      next: result => {
        // Redirect to Paystack hosted payment page
        window.location.href = result.authorization_url;
      },
      error: e => {
        this.paymentError = e?.error?.message || 'Failed to initialize payment. Try again.';
        this.initiating   = false;
      }
    });
  }

  formatPrice(amount: number): string {
    return '$' + amount.toFixed(2);
  }
}