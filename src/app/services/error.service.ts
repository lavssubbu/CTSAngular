import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<ErrorState | null>(null);
  error$: Observable<ErrorState | null> = this.errorSubject.asObservable();

  showError(message: string, type: ErrorState['type'] = 'error'): void {
    this.errorSubject.next({
      message,
      type,
      timestamp: new Date()
    });
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  handleHttpError(error: any): void {
    let message = 'An unexpected error occurred';
    
    if (error.status === 0) {
      message = 'Unable to connect to the server. Please check your connection.';
    } else if (error.status === 404) {
      message = 'The requested resource was not found.';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later.';
    } else if (error.error?.message) {
      message = error.error.message;
    }

    this.showError(message);
  }
} 