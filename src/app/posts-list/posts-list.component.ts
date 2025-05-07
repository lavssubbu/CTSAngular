import { Component } from '@angular/core';
import { Post, PostService } from '../services/post.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-posts-list',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsListComponent {
  posts: Post[] = [];
  searchTerm: string = '';

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(data => {
      this.posts = data;
    });
  }

  deletePost(id: number) {
    this.postService.deletePost(id).subscribe(() => this.loadPosts());
  }

  search(): Post[] {
    return this.posts.filter(p => 
      p.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
