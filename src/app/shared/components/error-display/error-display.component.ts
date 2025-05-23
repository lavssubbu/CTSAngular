import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService, ErrorState } from '../../../services/error.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="error$ | async as error" 
         class="error-container" 
         [class]="error.type">
      <span class="message">{{ error.message }}</span>
      <button class="close-btn" (click)="clearError()">×</button>
    </div>
  `,
  styles: [`
    .error-container {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 40px 15px 15px;
      border-radius: 4px;
      color: white;
      animation: slideIn 0.3s ease-out;
      z-index: 1000;
    }

    .error {
      background-color: #f44336;
    }

    .warning {
      background-color: #ff9800;
    }

    .info {
      background-color: #2196F3;
    }

    .close-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0 5px;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ErrorDisplayComponent implements OnInit {
  error$: Observable<ErrorState | null>;

  constructor(private errorService: ErrorService) {
    this.error$ = this.errorService.error$;
  }

  ngOnInit(): void {}

  clearError(): void {
    this.errorService.clearError();
  }
} 