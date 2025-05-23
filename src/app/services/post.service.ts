import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  addPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, {
      ...post,
      createdAt: new Date(),
      updatedAt: new Date()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${post.id}`, {
      ...post,
      updatedAt: new Date()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
