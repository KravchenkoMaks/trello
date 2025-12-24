import { Component, inject, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from '@services';

@Component({
  selector: 'tr-root',
  imports: [RouterOutlet, MatProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('trello');

  loading = inject(LoadingService);
}
