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
  action = input<() => void>();

  handleClick() {
    if (!this.disabled()) {
      this.action()?.();
    }
  }

  baseClasses =
    'text-t-12 cursor-pointer rounded-(--r6) px-2 py-1 font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center';

  private readonly btnClassMap: Record<TBtnAction, string> = {
    createBoard: 'bg-dark-2 board-size  hover:bg-dark-1',
    createList: 'bg-dark-2 list-w hover:bg-dark-1',
    createCard: 'bg-dark-3 hover:bg-dark-1',
    create: 'w-full bg-primary text-gray-1 disabled:bg-dark-1',
    cancel: 'rounded-(--r12) text-primary hover:py-0  hover:ring-1 focus:ring-primary',
    delete: 'rounded-(--r12) text-unsuccess hover:py-0  hover:ring-1 focus:ring-unsuccess',
    changeTitle: 'text-t-24  text-title hover:bg-dark-2',
  };

  btnClass = computed(() => {
    const btnName = this.role();
    return btnName ? `${this.baseClasses} ${this.btnClassMap[btnName]}` : this.baseClasses;
  });
}
