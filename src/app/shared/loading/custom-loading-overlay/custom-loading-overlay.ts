import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tr-custom-loading-overlay',
  imports: [NgClass],
  templateUrl: './custom-loading-overlay.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomLoadingOverlay {
  message = input<string>('');
  size = input<'sm' | 'md' | 'lg'>();
  color = input<'primary' | 'success' | 'error' | 'gray'>();

  sizeClass() {
    switch (this.size()) {
      case 'sm':
        return 'h-6 w-6 border-2';
      case 'md':
        return 'h-10 w-10 border-4';
      case 'lg':
        return 'h-16 w-16 border-4';
      default:
        return '';
    }
  }

  colorClass() {
    switch (this.color()) {
      case 'primary':
        return 'border-primary';
      case 'success':
        return 'border-success';
      case 'error':
        return 'border-unsuccess';
      case 'gray':
        return 'border-gray';
      default:
        return '';
    }
  }
}
