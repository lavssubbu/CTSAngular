import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post, PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-getbyid',
  imports: [CommonModule],
  templateUrl: './getbyid.component.html',
  styleUrl: './getbyid.component.css'
})
export class GetbyidComponent {
  post!: Post;

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.postService.getPost(id).subscribe(data => {
      this.post = data;
    });
  }
}
