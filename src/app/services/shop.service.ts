import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product, CartItem, Order } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ShopService {

  constructor(private api: ApiService) {}

  listProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('commerce/products');
  }

  getProduct(slug: string): Observable<Product> {
    return this.api.get<Product>(`commerce/products/${slug}`);
  }

  getCart(): Observable<CartItem[]> {
    return this.api.get<CartItem[]>('commerce/cart');
  }

  addToCart(product_id: string, quantity = 1): Observable<void> {
    return this.api.post<void>('commerce/cart', { product_id, quantity });
  }

  removeFromCart(product_id: string): Observable<void> {
    return this.api.delete<void>(`commerce/cart/${product_id}`);
  }

  myOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('commerce/orders');
  }
}