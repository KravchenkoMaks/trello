import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { TBtnAction } from '@types';

@Component({
  selector: 'tr-btn',
  imports: [NgClass, CommonModule],
  templateUrl: './btn.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Btn {
  label = input<string>('');
  role = input<TBtnAction>();
  type = input<'button' | 'submit'>('button');
  disabled = input<boolean>(false);
  ariaLabel = input<string>('');
  action = input<() => void>();
  handleClick() {
    if (!this.disabled()) {
      this.action()?.();
    }
  }

  baseClasses =
    'text-t-12 cursor-pointer px-2 py-1 font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center';

  private readonly btnClassMap: Record<TBtnAction, string> = {
    createBoard: 'board-w board-h bg-dark-2 board-size rounded-(--r8) hover:bg-dark-1',
    createList: 'bg-dark-2 list-w hover:bg-dark-1 rounded-(--r8)',
    createCard: 'bg-dark-3 hover:bg-dark-1 rounded-(--r8)',
    create: 'w-full bg-primary text-gray-1 disabled:bg-dark-1 rounded-(--r8)',
    cancel: 'rounded-(--r12) text-primary hover:py-0  hover:ring-1 focus:ring-primary rounded-(--r8)',
    // deleteR: 'absolute top-1 right-1 z-20 text-dark-400 hover:text-red-500 disabled:opacity-30',
    delete: 'rounded-(--r12) text-unsuccess hover:py-0  hover:ring-1 focus:ring-unsuccess',
    changeTitle:
      'inline-block truncate  w-full max-w-150 px-1 py-0 text-t-16 text-dark-700 hover:rounded-(--r2)  hover:bg-dark-400',
  };

  btnClass = computed(() => {
    const btnName = this.role();
    if (btnName) {
      if (this.label() !== 'deleteR') {
        return `${this.baseClasses} ${this.btnClassMap[btnName]}`;
      } else {
        return '';
      }
    } else {
      return this.baseClasses;
    }
  });
}
