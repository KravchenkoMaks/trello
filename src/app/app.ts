import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressBar } from '@loading';
import { LoadingService } from '@services';

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
