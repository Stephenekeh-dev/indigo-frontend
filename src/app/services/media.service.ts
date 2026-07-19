import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class MediaService {

  constructor(private api: ApiService) {}

  listPosts(page = 1, limit = 10): Observable<Post[]> {
    return this.api.get<Post[]>('media/posts', { page, limit });
  }

  getPost(slug: string): Observable<Post> {
    return this.api.get<Post>(`media/posts/${slug}`);
  }

  likePost(slug: string): Observable<void> {
    return this.api.post<void>(`media/posts/${slug}/like`, {});
  }

  subscribe(email: string, full_name?: string): Observable<void> {
    return this.api.post<void>('media/newsletter/subscribe', {
      email, full_name
    });
  }
}