import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading = signal(false);
  private requests = 0;

  show(): void {
    this.requests++;
    this.loading.set(true);
  }

  hide(): void {
    this.requests--;
    if (this.requests <= 0) {
      this.requests = 0;
      this.loading.set(false);
    }
  }
}
