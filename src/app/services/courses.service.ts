import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Course, Enrollment } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CoursesService {

  constructor(private api: ApiService) {}

  list(page = 1, limit = 12): Observable<Course[]> {
    return this.api.get<Course[]>('education', { page, limit });
  }

  get(slug: string): Observable<Course> {
    return this.api.get<Course>(`education/${slug}`);
  }

  enroll(course_id: string, stripe_payment_id?: string): Observable<Enrollment> {
    return this.api.post<Enrollment>('education/enroll', {
      course_id, stripe_payment_id
    });
  }

  myEnrollments(): Observable<Enrollment[]> {
    return this.api.get<Enrollment[]>('education/my-courses');
  }

  updateProgress(lesson_id: string, completed: boolean, watch_seconds?: number): Observable<void> {
    return this.api.post<void>('education/progress', {
      lesson_id, completed, watch_seconds
    });
  }
}