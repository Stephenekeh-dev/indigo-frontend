import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ServiceListing, Booking, CreateBookingDto } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class BookingService {

  constructor(private api: ApiService) {}

  listServices(): Observable<ServiceListing[]> {
    return this.api.get<ServiceListing[]>('services');
  }

  getService(slug: string): Observable<ServiceListing> {
    return this.api.get<ServiceListing>(`services/${slug}`);
  }

  createBooking(dto: CreateBookingDto): Observable<Booking> {
    return this.api.post<Booking>('services/bookings', dto);
  }

  myBookings(page = 1): Observable<any> {
    return this.api.get<any>('services/bookings', { page });
  }

  cancelBooking(id: string): Observable<void> {
    return this.api.patch<void>(`services/bookings/${id}/cancel`, {});
  }
}