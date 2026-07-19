import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import {
  User, AuthResponse, LoginDto, RegisterDto
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadUser()
  );

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('indigo_token');
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get isConsultant(): boolean {
    return this.currentUser?.role === 'consultant'
        || this.currentUser?.role === 'admin';
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/register', dto).pipe(
      tap(res => this.saveSession(res))
    );
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', dto).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout(): void {
    const refresh_token = localStorage.getItem('indigo_refresh_token');
    if (refresh_token) {
      this.api.post('auth/logout', { refresh_token }).subscribe();
    }
    localStorage.removeItem('indigo_token');
    localStorage.removeItem('indigo_refresh_token');
    localStorage.removeItem('indigo_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  me(): Observable<User> {
    return this.api.get<User>('auth/me').pipe(
      tap(user => {
        localStorage.setItem('indigo_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('indigo_token', res.token);
    localStorage.setItem('indigo_refresh_token', res.refresh_token);
    localStorage.setItem('indigo_user', JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem('indigo_user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
}