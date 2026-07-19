import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="player-page">
      <div class="loading" *ngIf="loading">Loading course...</div>

      <ng-container *ngIf="!loading && course">
        <!-- Top bar -->
        <div class="player-topbar">
          <a [routerLink]="['/courses', course.slug]" class="back-link">← Back to course</a>
          <span class="course-title">{{ course.title }}</span>
          <span class="progress-text">{{ currentLesson + 1 }} / {{ lessonCount }}</span>
        </div>

        <div class="player-layout">
          <!-- Video area -->
          <div class="player-main">
            <div class="video-placeholder">
              <div class="video-icon">▶️</div>
              <h3>Lesson {{ currentLesson + 1 }}</h3>
              <p>Video content will appear here when lessons are added.</p>
            </div>

            <div class="lesson-controls">
              <button
                class="btn btn-outline"
                [disabled]="currentLesson === 0"
                (click)="prevLesson()"
              >
                ← Previous
              </button>
              <button class="btn btn-primary" (click)="markComplete()">
                {{ completed[currentLesson] ? '✓ Completed' : 'Mark complete' }}
              </button>
              <button
                class="btn btn-outline"
                [disabled]="currentLesson === lessonCount - 1"
                (click)="nextLesson()"
              >
                Next →
              </button>
            </div>
          </div>

          <!-- Lesson list sidebar -->
          <div class="player-sidebar">
            <h3>Course content</h3>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="getProgress()"></div>
            </div>
            <p class="progress-label">{{ getProgress() }}% complete</p>

            <div class="lesson-list">
              <button
                *ngFor="let l of lessons; let i = index"
                class="lesson-item"
                [class.active]="currentLesson === i"
                [class.done]="completed[i]"
                (click)="currentLesson = i"
              >
                <span class="lesson-check">
                  {{ completed[i] ? '✓' : (i + 1) }}
                </span>
                <span>{{ l }}</span>
              </button>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .player-page { background: #f8fafc; min-height: 100vh; }
    .loading { text-align: center; padding: 80px; color: #64748b; }

    .player-topbar {
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      padding: 0 24px;
      height: 56px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .back-link {
      color: #4f46e5;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      flex-shrink: 0;
    }
    .course-title { font-size: 15px; font-weight: 700; color: #0f172a; flex: 1; }
    .progress-text { font-size: 13px; color: #64748b; flex-shrink: 0; }

    .player-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      min-height: calc(100vh - 120px);
    }

    .player-main { padding: 32px; }
    .video-placeholder {
      background: #1e1e2e;
      border-radius: 12px;
      height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #fff;
      margin-bottom: 24px;
    }
    .video-icon { font-size: 56px; }
    .video-placeholder h3 { font-size: 20px; font-weight: 700; margin: 0; }
    .video-placeholder p  { font-size: 14px; opacity: 0.7; margin: 0; }

    .lesson-controls {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-outline {
      background: transparent;
      color: #4f46e5;
      border: 1.5px solid #4f46e5;
    }
    .btn-outline:hover:not(:disabled) { background: #ede9fe; }
    .btn-outline:disabled { opacity: 0.4; cursor: not-allowed; }

    .player-sidebar {
      background: #fff;
      border-left: 1px solid #e2e8f0;
      padding: 24px;
      overflow-y: auto;
    }
    .player-sidebar h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 14px; }
    .progress-bar {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4f46e5, #7c3aed);
      border-radius: 3px;
      transition: width 0.3s;
    }
    .progress-label { font-size: 12px; color: #64748b; margin: 0 0 16px; }

    .lesson-list { display: flex; flex-direction: column; gap: 2px; }
    .lesson-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      color: #475569;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      width: 100%;
    }
    .lesson-item:hover  { background: #f8fafc; }
    .lesson-item.active { background: #ede9fe; color: #4f46e5; font-weight: 600; }
    .lesson-item.done   { color: #15803d; }
    .lesson-check {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .lesson-item.active .lesson-check { background: #4f46e5; color: #fff; }
    .lesson-item.done   .lesson-check { background: #dcfce7; color: #15803d; }

    @media (max-width: 768px) {
      .player-layout { grid-template-columns: 1fr; }
      .player-sidebar { border-left: none; border-top: 1px solid #e2e8f0; }
    }
  `]
})
export class CoursePlayerComponent implements OnInit {
  course:        Course | null = null;
  loading        = true;
  currentLesson  = 0;
  completed:     boolean[] = [];

  lessons = [
    'Introduction to the course',
    'Setting up your Rust environment',
    'Hello World and cargo basics',
    'Variables and data types',
    'Ownership and borrowing',
    'Structs and enums',
    'Error handling with Result',
    'Traits and generics',
    'Building your first CLI tool',
    'Final project',
  ];

  get lessonCount(): number { return this.lessons.length; }

  constructor(
    private route:          ActivatedRoute,
    private coursesService: CoursesService,
  ) {}

  ngOnInit(): void {
    this.completed = new Array(this.lessons.length).fill(false);
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.coursesService.get(slug).subscribe({
      next: data => { this.course = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  markComplete(): void {
    this.completed[this.currentLesson] = true;
    if (this.currentLesson < this.lessonCount - 1) {
      this.currentLesson++;
    }
  }

  nextLesson(): void {
    if (this.currentLesson < this.lessonCount - 1) this.currentLesson++;
  }

  prevLesson(): void {
    if (this.currentLesson > 0) this.currentLesson--;
  }

  getProgress(): number {
    const done = this.completed.filter(Boolean).length;
    return Math.round((done / this.lessonCount) * 100);
  }
}