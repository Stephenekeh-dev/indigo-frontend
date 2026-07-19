import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Event } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class CommunityService {

  constructor(private api: ApiService) {}

  listEvents(): Observable<Event[]> {
    return this.api.get<Event[]>('community/events');
  }

  getEvent(slug: string): Observable<Event> {
    return this.api.get<Event>(`community/events/${slug}`);
  }

  register(event_id: string): Observable<void> {
    return this.api.post<void>('community/register', { event_id });
  }

  myMembership(): Observable<any> {
    return this.api.get<any>('community/membership');
  }
}