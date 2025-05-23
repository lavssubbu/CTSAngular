import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorDisplayComponent } from './shared/components/error-display/error-display.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorDisplayComponent],
  template: `
    <app-error-display></app-error-display>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'ang-crud-dbjson';
}
