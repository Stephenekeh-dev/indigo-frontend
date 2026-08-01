import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ServiceListing } from '../models/service.model';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';

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
}