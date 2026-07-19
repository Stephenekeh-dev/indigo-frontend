import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface ChatMessage {
  role:       'user' | 'assistant';
  content:    string;
  timestamp:  Date;
}

export interface SessionResponse {
  session_token: string;
  context:       string;
}

export interface MessageResponse {
  reply:         string;
  tokens_used:   number;
  session_token: string;
}

@Injectable({ providedIn: 'root' })
export class AiChatService {

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private sessionToken: string | null = null;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private api: ApiService) {}

  startSession(context = 'general'): Observable<SessionResponse> {
    return this.api.post<SessionResponse>('ai/session', { context }).pipe(
      tap(res => {
        this.sessionToken = res.session_token;
        this.messagesSubject.next([]);
      })
    );
  }

  sendMessage(message: string): Observable<MessageResponse> {
    if (!this.sessionToken) {
      throw new Error('No active session');
    }

    // Add user message immediately
    const userMsg: ChatMessage = {
      role: 'user', content: message, timestamp: new Date()
    };
    this.messagesSubject.next([...this.messagesSubject.value, userMsg]);
    this.isLoadingSubject.next(true);

    return this.api.post<MessageResponse>('ai/message', {
      session_token: this.sessionToken,
      message
    }).pipe(
      tap(res => {
        const assistantMsg: ChatMessage = {
          role: 'assistant', content: res.reply, timestamp: new Date()
        };
        this.messagesSubject.next([
          ...this.messagesSubject.value, assistantMsg
        ]);
        this.isLoadingSubject.next(false);
      })
    );
  }

  endSession(): void {
    if (this.sessionToken) {
      this.api.post('ai/session/end', {
        session_token: this.sessionToken
      }).subscribe();
      this.sessionToken = null;
      this.messagesSubject.next([]);
    }
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }
}