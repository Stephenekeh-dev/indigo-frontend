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

      <!-- Label + toggle -->
      <div class="chat-launcher" (click)="toggleChat()">
        <div class="chat-label" *ngIf="!isOpen">AI Chatbot</div>
        <button class="chat-toggle" [class.open]="isOpen">
          <span *ngIf="!isOpen">🤖</span>
          <span *ngIf="isOpen">✕</span>
        </button>
      </div>

      <!-- Chat window -->
      <div class="chat-window" [class.visible]="isOpen">
        <div class="chat-header">
          <div class="chat-avatar">🤖</div>
          <div class="chat-header-info">
            <div class="chat-name">Indigo AI Assistant</div>
            <div class="chat-status">
              <span class="online-dot"></span> Rust expert · Online
            </div>
          </div>
          <button class="close-btn" (click)="toggleChat()">✕</button>
        </div>

        <div class="chat-messages" #messagesEl>
          <div class="message assistant" *ngIf="messages.length === 0">
            <div class="bot-avatar">🤖</div>
            <div class="bubble">
              Hi! I'm the Indigo AI assistant. I can help you with
              <strong>Rust questions</strong>, course recommendations,
              or booking a consultant. How can I help you today?
            </div>
          </div>

          <div
            class="message"
            *ngFor="let m of messages"
            [class.user]="m.role === 'user'"
            [class.assistant]="m.role === 'assistant'"
          >
            <div class="bot-avatar" *ngIf="m.role === 'assistant'">🤖</div>
            <div class="bubble">{{ m.content }}</div>
          </div>

          <div class="message assistant" *ngIf="isLoading">
            <div class="bot-avatar">🤖</div>
            <div class="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Quick prompts -->
        <div class="quick-prompts" *ngIf="messages.length === 0">
          <button *ngFor="let p of quickPrompts" (click)="sendQuick(p)">
            {{ p }}
          </button>
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
            ➤
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-widget {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    /* ── Launcher ─────────────────────────────────── */
    .chat-launcher {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    .chat-label {
      background: #4f46e5;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      letter-spacing: 0.3px;
      box-shadow: 0 2px 8px rgba(79,70,229,0.4);
      animation: pulse-label 2.5s ease-in-out infinite;
    }
    @keyframes pulse-label {
      0%, 100% { transform: scale(1); }
      50%       { transform: scale(1.04); }
    }
    .chat-toggle {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
      border: none;
      font-size: 28px;
      cursor: pointer;
      box-shadow: 0 6px 24px rgba(79,70,229,0.45);
      transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chat-toggle:hover { transform: scale(1.1); }
    .chat-toggle.open  {
      background: #64748b;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transform: rotate(0deg);
    }

    /* ── Chat window ─────────────────────────────── */
    .chat-window {
      position: absolute;
      bottom: 120px;
      right: 0;
      width: 360px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      max-height: 520px;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    .chat-window.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* ── Header ──────────────────────────────────── */
    .chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 18px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
    }
    .chat-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .chat-header-info { flex: 1; }
    .chat-name   { font-size: 15px; font-weight: 700; }
    .chat-status { font-size: 12px; opacity: 0.85; display: flex; align-items: center; gap: 5px; margin-top: 1px; }
    .online-dot  {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #4ade80;
      display: inline-block;
    }
    .close-btn {
      background: rgba(255,255,255,0.15);
      border: none;
      color: #fff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .close-btn:hover { background: rgba(255,255,255,0.3); }

    /* ── Messages ────────────────────────────────── */
    .chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 240px;
      max-height: 280px;
    }
    .message {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }
    .message.user      { flex-direction: row-reverse; }
    .message.assistant { flex-direction: row; }
    .bot-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ede9fe;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }
    .bubble {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.5;
    }
    .message.user .bubble {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .message.assistant .bubble {
      background: #f1f5f9;
      color: #1e293b;
      border-bottom-left-radius: 4px;
    }

    /* Typing */
    .typing {
      display: flex;
      gap: 5px;
      align-items: center;
      padding: 14px;
    }
    .typing span {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #94a3b8;
      animation: bounce 1.3s infinite;
    }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30%            { transform: translateY(-7px); }
    }

    /* ── Quick prompts ───────────────────────────── */
    .quick-prompts {
      padding: 0 14px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .quick-prompts button {
      padding: 5px 12px;
      border-radius: 20px;
      border: 1.5px solid #c7d2fe;
      background: #fff;
      color: #4f46e5;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .quick-prompts button:hover {
      background: #ede9fe;
      border-color: #4f46e5;
    }

    /* ── Input ───────────────────────────────────── */
    .chat-input {
      display: flex;
      gap: 8px;
      padding: 12px 14px;
      border-top: 1px solid #e2e8f0;
      background: #fafafa;
    }
    .chat-input input {
      flex: 1;
      padding: 10px 14px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      background: #fff;
      transition: border-color 0.2s;
    }
    .chat-input input:focus { border-color: #4f46e5; }
    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #4f46e5;
      color: #fff;
      border: none;
      font-size: 16px;
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
      .chat-window { width: calc(100vw - 56px); }
    }
  `]
})
export class ChatWidgetComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesEl') messagesEl!: ElementRef;

  messages:  ChatMessage[] = [];
  isLoading  = false;
  isOpen     = false;
  inputText  = '';

  quickPrompts = [
    'What is Rust ownership?',
    'Help me with async Rust',
    'Book a consultant',
    'Recommend a course',
  ];

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

  sendQuick(prompt: string): void {
    this.inputText = prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;
    this.inputText = '';
    this.aiChat.sendMessage(text).subscribe({ error: () => {} });
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