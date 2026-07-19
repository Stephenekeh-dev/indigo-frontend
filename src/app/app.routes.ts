import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Landing
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/home/home.component')
        .then(m => m.HomeComponent),
  },

  // Auth
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.RegisterComponent),
  },

  // Services / Booking
  {
    path: 'services',
    loadComponent: () =>
      import('./features/services/services-list/services-list.component')
        .then(m => m.ServicesListComponent),
  },
  {
    path: 'services/:slug',
    loadComponent: () =>
      import('./features/services/service-detail/service-detail.component')
        .then(m => m.ServiceDetailComponent),
  },
  {
    path: 'services/:slug/book',
    loadComponent: () =>
      import('./features/services/booking/booking.component')
        .then(m => m.BookingComponent),
    canActivate: [AuthGuard],
  },

  // Education
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/education/course-list/course-list.component')
        .then(m => m.CourseListComponent),
  },
  {
    path: 'courses/:slug',
    loadComponent: () =>
      import('./features/education/course-detail/course-detail.component')
        .then(m => m.CourseDetailComponent),
  },
  {
    path: 'courses/:slug/learn',
    loadComponent: () =>
      import('./features/education/course-player/course-player.component')
        .then(m => m.CoursePlayerComponent),
    canActivate: [AuthGuard],
  },

  // Shop
  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/product-list/product-list.component')
        .then(m => m.ProductListComponent),
  },
  {
    path: 'shop/cart',
    loadComponent: () =>
      import('./features/shop/cart/cart.component')
        .then(m => m.CartComponent),
    canActivate: [AuthGuard],
  },

  // Blog
  {
    path: 'blog',
    loadComponent: () =>
      import('./features/media/blog-list/blog-list.component')
        .then(m => m.BlogListComponent),
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./features/media/blog-post/blog-post.component')
        .then(m => m.BlogPostComponent),
  },

  // Community
  {
    path: 'community',
    loadComponent: () =>
      import('./features/community/events-list/events-list.component')
        .then(m => m.EventsListComponent),
  },
  {
    path: 'community/:slug',
    loadComponent: () =>
      import('./features/community/event-detail/event-detail.component')
        .then(m => m.EventDetailComponent),
  },

  // Dashboard (protected)
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/user-dashboard/user-dashboard.component')
        .then(m => m.UserDashboardComponent),
    canActivate: [AuthGuard],
  },

  // Wildcard
  { path: '**', redirectTo: '' },
];