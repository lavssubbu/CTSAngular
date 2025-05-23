import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post, PostService } from '../services/post.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { ErrorDisplayComponent } from '../shared/components/error-display/error-display.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ErrorDisplayComponent,
    ConfirmDialogComponent
  ],
  template: `
    <div class="posts-container">
      <h2>Post List</h2>
      <div class="search-container">
        <input 
          [(ngModel)]="searchTerm" 
          (ngModelChange)="onSearchChange()" 
          placeholder="Search by title"
          class="search-input" 
        />
      </div>

      <div *ngIf="isLoading" class="loading">
        Loading posts...
      </div>

      <ul *ngIf="!isLoading" class="posts-list">
        <li *ngFor="let post of filteredPosts" class="post-item">
          <img [src]="post.imageUrl" [alt]="post.title" class="post-image"/>
          <div class="post-content">
            <h3>{{ post.title }}</h3>
            <p>{{ post.content }}</p>
            <div class="post-actions">
              <a [routerLink]="['/detail', post.id]" class="view-btn">View</a>
              <a [routerLink]="['/update', post.id]" class="edit-btn">Edit</a>
              <button (click)="confirmDelete(post)" class="delete-btn">Delete</button>
            </div>
          </div>
        </li>
      </ul>

      <div *ngIf="!isLoading && filteredPosts.length === 0" class="no-results">
        No posts found.
      </div>

      <a routerLink="/add" class="add-button">Add New Post</a>

      <app-confirm-dialog
        [isOpen]="showDeleteDialog"
        title="Confirm Delete"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        [isDangerous]="true"
        (confirm)="onDeleteConfirmed()"
        (cancel)="onDeleteCancelled()"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .posts-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .search-container {
      margin-bottom: 20px;
    }

    .search-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .no-results {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .posts-list {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .post-item {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .post-item:hover {
      transform: translateY(-2px);
    }

    .post-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .post-content {
      padding: 15px;
    }

    .post-content h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .post-content p {
      margin: 0 0 15px 0;
      color: #666;
      line-height: 1.5;
    }

    .post-actions {
      display: flex;
      gap: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }

    .view-btn, .edit-btn {
      padding: 5px 10px;
      text-decoration: none;
      border-radius: 4px;
      flex: 1;
      text-align: center;
    }

    .view-btn {
      background-color: #2196F3;
      color: white;
    }

    .edit-btn {
      background-color: #4CAF50;
      color: white;
    }

    .delete-btn {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      flex: 1;
    }

    .add-button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
      transition: background-color 0.2s;
    }

    .add-button:hover {
      background-color: #45a049;
    }
  `]
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchTerm: string = '';
  isLoading = false;
  showDeleteDialog = false;
  postToDelete?: Post;
  private destroy$ = new Subject<void>();

  constructor(
    private postService: PostService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.getPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.posts = data;
          this.updateFilteredPosts();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorService.handleHttpError(error);
          this.isLoading = false;
        }
      });
  }

  confirmDelete(post: Post): void {
    this.postToDelete = post;
    this.showDeleteDialog = true;
  }

  onDeleteConfirmed(): void {
    if (this.postToDelete) {
      this.postService.deletePost(this.postToDelete.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadPosts();
            this.errorService.showError('Post deleted successfully', 'info');
          },
          error: (error) => this.errorService.handleHttpError(error),
          complete: () => {
            this.showDeleteDialog = false;
            this.postToDelete = undefined;
          }
        });
    }
  }

  onDeleteCancelled(): void {
    this.showDeleteDialog = false;
    this.postToDelete = undefined;
  }

  updateFilteredPosts(): void {
    this.filteredPosts = this.posts.filter(p => 
      p.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearchChange(): void {
    this.updateFilteredPosts();
  }
}
