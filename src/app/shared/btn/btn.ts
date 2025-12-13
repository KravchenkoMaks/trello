import { Component, input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Loader } from '@shared/loader/loader';

type TBtn = 'newBoard' | 'newList' | 'newCard' | 'home' | 'boardLink';

@Component({
  selector: 'tr-btn',
  imports: [NgClass, CommonModule, Loader],
  templateUrl: './btn.html',
  styles: ``,
})
export class Btn {
  label = input<string>();
  type = input<TBtn>();
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  action = input<() => void>();

  handleClick() {
    if (!this.disabled() && !this.loading()) {
      this.action()?.();
    }
  }

  get btnClass(): string {
    switch (this.type()) {
      case 'newBoard':
        return 'bg-dark-2 board-size text-xl';
      case 'newList':
        return 'bg-dark-2 list-w card-h text-xl';
      case 'newCard':
        return 'bg-dark-3 w-full card-h';
      default:
        return '';
    }
  }
}
