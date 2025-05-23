import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post, PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-getbyid',
  imports: [CommonModule],
  templateUrl: './getbyid.component.html',
  styleUrl: './getbyid.component.css'
})
export class GetbyidComponent implements OnInit, OnDestroy {
  post?: Post;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute, 
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPost();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPost(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.isLoading = true;
    this.error = null;

    this.postService.getPost(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.post = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to load post. Please try again later.';
          this.isLoading = false;
          console.error('Error loading post:', error);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
