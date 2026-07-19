import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService, ChatMessage } from '../../services/ai-chat.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-widget">
      <!-- Toggle button -->
      <button class="chat-toggle" (click)="toggleChat()" [class.open]="isOpen">
        <span *ngIf="!isOpen">💬</span>
        <span *ngIf="isOpen">✕</span>
      </button>

      <!-- Chat window -->
      <div class="chat-window" *ngIf="isOpen">
        <div class="chat-header">
          <div class="chat-avatar">🤖</div>
          <div>
            <div class="chat-name">Indigo AI</div>
            <div class="chat-status">Rust expert · Online</div>
          </div>
        </div>

        <div class="chat-messages" #messagesEl>
          <!-- Welcome message -->
          <div class="message assistant" *ngIf="messages.length === 0">
            <div class="bubble">
              Hi! I'm the Indigo AI assistant. I can help you with Rust questions,
              course recommendations, or booking a consultant. How can I help?
            </div>
          </div>

          <div
            class="message"
            *ngFor="let m of messages"
            [class.user]="m.role === 'user'"
            [class.assistant]="m.role === 'assistant'"
          >
            <div class="bubble">{{ m.content }}</div>
          </div>

          <div class="message assistant" *ngIf="isLoading">
            <div class="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <input
            type="text"
            [(ngModel)]="inputText"
            placeholder="Ask about Rust..."
            (keyup.enter)="sendMessage()"
            [disabled]="isLoading"
          />
          <button
            class="send-btn"
            (click)="sendMessage()"
            [disabled]="!inputText.trim() || isLoading"
          >
            →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }
    .chat-toggle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #4f46e5;
      color: #fff;
      border: none;
      font-size: 22px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(79,70,229,0.4);
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chat-toggle:hover { background: #4338ca; transform: scale(1.05); }
    .chat-toggle.open  { background: #64748b; }

    .chat-window {
      position: absolute;
      bottom: 68px;
      right: 0;
      width: 340px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      max-height: 500px;
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
    }
    .chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .chat-name   { font-size: 15px; font-weight: 700; }
    .chat-status { font-size: 12px; opacity: 0.8; }

    .chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 280px;
      max-height: 320px;
    }
    .message { display: flex; }
    .message.user      { justify-content: flex-end; }
    .message.assistant { justify-content: flex-start; }
    .bubble {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
    }
    .message.user .bubble {
      background: #4f46e5;
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .message.assistant .bubble {
      background: #f1f5f9;
      color: #1e293b;
      border-bottom-left-radius: 4px;
    }

    /* Typing indicator */
    .typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 12px 14px;
    }
    .typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #94a3b8;
      animation: bounce 1.2s infinite;
    }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30%            { transform: translateY(-6px); }
    }

    .chat-input {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #e2e8f0;
    }
    .chat-input input {
      flex: 1;
      padding: 9px 14px;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .chat-input input:focus { border-color: #4f46e5; }
    .send-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #4f46e5;
      color: #fff;
      border: none;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .send-btn:hover:not(:disabled) { background: #4338ca; }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    @media (max-width: 480px) {
      .chat-window { width: calc(100vw - 48px); right: 0; }
    }
  `]
})
export class ChatWidgetComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesEl') messagesEl!: ElementRef;

  messages:  ChatMessage[] = [];
  isLoading  = false;
  isOpen     = false;
  inputText  = '';

  constructor(private aiChat: AiChatService) {}

  ngOnInit(): void {
    this.aiChat.messages$.subscribe(msgs => this.messages = msgs);
    this.aiChat.isLoading$.subscribe(loading => this.isLoading = loading);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.aiChat.endSession();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.aiChat.startSession('general').subscribe();
    }
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;
    this.inputText = '';
    this.aiChat.sendMessage(text).subscribe({
      error: () => {}
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesEl) {
        this.messagesEl.nativeElement.scrollTop =
          this.messagesEl.nativeElement.scrollHeight;
      }
    } catch {}
  }
}
