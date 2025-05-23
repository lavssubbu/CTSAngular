import { Component, OnDestroy } from '@angular/core';
import { Post, PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from '../services/error.service';
import { Subject, takeUntil } from 'rxjs';
import { ErrorDisplayComponent } from '../shared/components/error-display/error-display.component';

@Component({
  selector: 'app-post-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorDisplayComponent],
  template: `
    <div class="form-container">
      <h2>Add New Post</h2>
      <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" type="text" formControlName="title" placeholder="Enter title">
          <div *ngIf="postForm.get('title')?.invalid && postForm.get('title')?.touched" class="error-message">
            <span *ngIf="postForm.get('title')?.errors?.['required']">Title is required</span>
            <span *ngIf="postForm.get('title')?.errors?.['minlength']">Title must be at least 3 characters</span>
          </div>
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea id="content" formControlName="content" placeholder="Enter content"></textarea>
          <div *ngIf="postForm.get('content')?.invalid && postForm.get('content')?.touched" class="error-message">
            <span *ngIf="postForm.get('content')?.errors?.['required']">Content is required</span>
            <span *ngIf="postForm.get('content')?.errors?.['minlength']">Content must be at least 10 characters</span>
          </div>
        </div>

        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <input id="imageUrl" type="url" formControlName="imageUrl" placeholder="Enter image URL">
          <div *ngIf="postForm.get('imageUrl')?.invalid && postForm.get('imageUrl')?.touched" class="error-message">
            <span *ngIf="postForm.get('imageUrl')?.errors?.['required']">Image URL is required</span>
            <span *ngIf="postForm.get('imageUrl')?.errors?.['pattern']">Please enter a valid URL</span>
          </div>
        </div>

        <div class="button-group">
          <button type="submit" [disabled]="postForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save Post' }}
          </button>
          <button type="button" (click)="goBack()" [disabled]="isSubmitting">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }

    input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 5px;
    }

    textarea {
      min-height: 100px;
    }

    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 5px;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button[type="submit"] {
      background-color: #4CAF50;
      color: white;
    }

    button[type="submit"]:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    button[type="button"] {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class PostAddComponent implements OnDestroy {
  postForm: FormGroup;
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', [
        Validators.required,
        Validators.pattern('^https?://.*$')
      ]]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.postForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const post: Post = this.postForm.value;

      this.postService.addPost(post)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
            this.errorService.showError('Post created successfully!', 'info');
          },
          error: (error) => {
            this.errorService.handleHttpError(error);
            this.isSubmitting = false;
          }
        });
    } else {
      Object.keys(this.postForm.controls).forEach(key => {
        const control = this.postForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
