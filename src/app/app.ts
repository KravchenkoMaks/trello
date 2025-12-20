import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from '@services/loading-service';
import { ProgressBar } from '@shared/loading/progress-bar/progress-bar';

@Component({
  selector: 'tr-root',
  imports: [RouterOutlet, ProgressBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('trello');

  loading = inject(LoadingService);
}
