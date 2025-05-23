import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" *ngIf="isOpen">
      <div class="dialog-content" role="dialog" aria-modal="true">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="dialog-actions">
          <button (click)="onCancel()" class="cancel-btn">Cancel</button>
          <button (click)="onConfirm()" class="confirm-btn" [class.danger]="isDangerous">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      max-width: 500px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin-top: 0;
      margin-bottom: 10px;
    }

    p {
      margin-bottom: 20px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .cancel-btn {
      background-color: #e0e0e0;
    }

    .confirm-btn {
      background-color: #2196F3;
      color: white;
    }

    .confirm-btn.danger {
      background-color: #f44336;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() isDangerous = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 