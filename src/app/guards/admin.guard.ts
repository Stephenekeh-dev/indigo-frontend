import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router:      Router,
  ) {}

  canActivate(): boolean | UrlTree {
  const user = this.authService.currentUser;

  // Debug — remove after fixing
  console.log('AdminGuard — user:', JSON.stringify(user));

  if (user && user.role === 'admin') {
    return true;
  }
  if (!user) {
    return this.router.createUrlTree(['/auth/login']);
  }
  return this.router.createUrlTree(['/']);
}
}