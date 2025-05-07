import { Component } from '@angular/core';
import { Post, PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-add',
  imports: [CommonModule,FormsModule],
  templateUrl: './post-add.component.html',
  styleUrl: './post-add.component.css'
})
export class PostAddComponent {
  post: Post = { id: 0, title: '', content: '', imageUrl: '' };

  constructor(private postService: PostService, private router: Router) {}

  onSubmit() {
    this.postService.addPost(this.post).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
