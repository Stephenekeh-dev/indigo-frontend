import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PaymentInit {
  authorization_url: string;
  access_code:       string;
  reference:         string;
}

export interface PaymentVerify {
  status:    string;
  reference: string;
  amount:    number;
  email:     string;
  paid:      boolean;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {

  constructor(private api: ApiService) {}

  initialize(
    email:      string,
    amount_usd: number,
    order_type: string,
    item_id?:   string,
  ): Observable<PaymentInit> {
    return this.api.post<PaymentInit>('payments/initialize', {
      email,
      amount_usd,
      order_type,
      item_id,
      callback_url: `${window.location.origin}/shop/checkout/success`,
    });
  }

  verify(reference: string): Observable<PaymentVerify> {
    return this.api.get<PaymentVerify>('payments/verify', { reference });
  }
}