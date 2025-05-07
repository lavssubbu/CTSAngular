import { Component } from '@angular/core';
import { Post, PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-update',
  imports: [CommonModule,FormsModule],
  templateUrl: './post-update.component.html',
  styleUrl: './post-update.component.css'
})
export class PostUpdateComponent {
  post!: Post;

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.postService.getPost(id).subscribe(data => {
      this.post = data;
    });
  }

  onSubmit() {
    this.postService.updatePost(this.post).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
