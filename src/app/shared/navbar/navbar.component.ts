import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">

        <!-- Brand -->
        <a routerLink="/" class="brand">
          <span class="brand-icon">◆</span>
          <span class="brand-name">Indigo</span>
        </a>

        <!-- Desktop links -->
        <ul class="nav-links" [class.open]="menuOpen">
          <li><a routerLink="/services" routerLinkActive="active">Services</a></li>
          <li><a routerLink="/courses"  routerLinkActive="active">Courses</a></li>
          <li><a routerLink="/shop"     routerLinkActive="active">Shop</a></li>
          <li><a routerLink="/blog"     routerLinkActive="active">Blog</a></li>
          <li><a routerLink="/blockchain" routerLinkActive="active">Blockchain</a></li>
          <li><a routerLink="/community" routerLinkActive="active">Community</a></li>
        </ul>

        <!-- Auth buttons -->
        <div class="nav-auth">
          <ng-container *ngIf="currentUser; else guestLinks">
            <a routerLink="/dashboard" class="btn btn-ghost">
              {{ currentUser.full_name.split(' ')[0] }}
            </a>
            <button class="btn btn-outline" (click)="logout()">Logout</button>
          </ng-container>
          <ng-template #guestLinks>
            <a routerLink="/auth/login"    class="btn btn-ghost">Login</a>
            <a routerLink="/auth/register" class="btn btn-primary">Get Started</a>
          </ng-template>
        </div>

        <!-- Mobile hamburger -->
        <button class="hamburger" (click)="toggleMenu()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 10, 20, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      gap: 32px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-icon { color: #818cf8; font-size: 20px; }
    .brand-name {
      font-size: 20px;
      font-weight: 700;
      color: #e2e8f0;
      letter-spacing: -0.5px;
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 4px;
      margin: 0;
      padding: 0;
      flex: 1;
    }
    .nav-links a {
      padding: 6px 14px;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #e2e8f0;
      background: rgba(99, 102, 241, 0.15);
    }
    .nav-auth {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-left: auto;
    }
    .btn {
      padding: 8px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      border: none;
      transition: all 0.2s;
    }
    .btn-ghost {
      color: #94a3b8;
      background: transparent;
    }
    .btn-ghost:hover { color: #e2e8f0; }
    .btn-outline {
      color: #818cf8;
      background: transparent;
      border: 1px solid rgba(99,102,241,0.4);
    }
    .btn-outline:hover { background: rgba(99,102,241,0.1); }
    .btn-primary {
      background: #4f46e5;
      color: #fff;
    }
    .btn-primary:hover { background: #4338ca; }
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      margin-left: auto;
    }
    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: #94a3b8;
      border-radius: 2px;
    }
    @media (max-width: 768px) {
      .hamburger { display: flex; }
      .nav-links {
        display: none;
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background: rgba(10,10,20,0.98);
        flex-direction: column;
        padding: 16px;
        border-bottom: 1px solid rgba(99,102,241,0.2);
      }
      .nav-links.open { display: flex; }
      .nav-auth { display: none; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  menuOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}