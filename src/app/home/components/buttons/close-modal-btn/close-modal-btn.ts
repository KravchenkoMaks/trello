import { Component, output } from '@angular/core';

@Component({
  selector: 'tr-close-modal-btn',
  imports: [],
  templateUrl: './close-modal-btn.html',
  styleUrl: './close-modal-btn.css',
})
export class CloseModalBtn {
  closed = output<void>();

  onClick(): void {
    this.closed.emit();
  }
}
