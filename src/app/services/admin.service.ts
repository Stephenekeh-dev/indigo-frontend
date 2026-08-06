import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ServiceListing } from '../models/service.model';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';

export interface AdminStats {
  total_users:    number;
  total_bookings: number;
  total_courses:  number;
  total_orders:   number;
}

export interface AdminBooking {
  id:               string;
  service_id:       string;
  client_id:        string;
  scheduled_at:     string;
  duration_minutes: number;
  status:           string;
  zoom_join_url:    string | null;
  client_notes:     string | null;
  created_at:       string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {

  constructor(private api: ApiService) {}

  // Services
  listServices(): Observable<ServiceListing[]> {
    return this.api.get<ServiceListing[]>('services');
  }

  createService(dto: Partial<ServiceListing>): Observable<ServiceListing> {
    return this.api.post<ServiceListing>('services', dto);
  }

  // Courses
  listCourses(): Observable<Course[]> {
    return this.api.get<Course[]>('education');
  }

  createCourse(dto: any): Observable<Course> {
    return this.api.post<Course>('education', dto);
  }

  // Users
  listUsers(): Observable<User[]> {
    return this.api.get<User[]>('auth/users');
  }
  // Services
updateService(id: string, dto: Partial<ServiceListing>): Observable<ServiceListing> {
  return this.api.put<ServiceListing>(`services/${id}`, dto);
}
deleteService(id: string): Observable<void> {
  return this.api.delete<void>(`services/${id}`);
}

// Courses
updateCourse(id: string, dto: any): Observable<Course> {
  return this.api.put<Course>(`education/${id}`, dto);
}


deleteCourse(id: string): Observable<void> {
  return this.api.delete<void>(`education/${id}`);
}
// Media / Blog
listAllPosts(): Observable<any[]> {
  return this.api.get<any[]>('media/posts/all');
}

createPost(dto: any): Observable<any> {
  return this.api.post<any>('media/posts', dto);
}

updatePost(slug: string, dto: any): Observable<any> {
  return this.api.put<any>(`media/posts/${slug}`, dto);
}

deletePost(slug: string): Observable<void> {
  return this.api.delete<void>(`media/posts/${slug}`);
}

// Shop
listProducts(): Observable<Product[]> {
  return this.api.get<Product[]>('commerce/products');
}

createProduct(dto: any): Observable<Product> {
  return this.api.post<Product>('commerce/products', dto);
}

updateProduct(id: string, dto: any): Observable<Product> {
  return this.api.put<Product>(`commerce/products/${id}`, dto);
}

deleteProduct(id: string): Observable<void> {
  return this.api.delete<void>(`commerce/products/${id}`);
}
}

