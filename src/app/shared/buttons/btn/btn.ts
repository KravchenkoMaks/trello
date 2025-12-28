import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { TBtnName } from '@types';

@Component({
  selector: 'tr-btn',
  imports: [NgClass, CommonModule],
  templateUrl: './btn.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Btn {
  label = input<string>('');
  name = input<TBtnName>();
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
    'cursor-pointer px-2 py-1  transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center  rounded-(--r4)';

  private readonly btnClassMap: Record<TBtnName, string> = {
    createBoard: 'board-w board-h bg-zinc-800 text-zinc-500 font-medium rounded-(--r8) hover:bg-dark-1',
    createBoardConfirm: 'w-full bg-primary text-zinc-800 font-medium disabled:bg-zinc-700 hover:bg-primary-light',
    deleteBoardBtn: 'rounded-(--r12) text-unsuccess font-medium hover:py-0  hover:ring-1 focus:ring-unsuccess',
    deleteBoardSvg: 'text-zinc-400 font-medium hover:text-danger disabled:opacity-30',
    deleteBoardCancel: 'rounded-(--r12) text-primary font-medium hover:py-0  hover:ring-1 focus:ring-primary',
    addList: 'bg-zinc-300 text-zinc-700 font-medium list-w h-10 hover:bg-zinc-500 rounded-(--r8)',
    addCard: 'bg-dark-3 hover:bg-zinc-800 rounded-(--r8) font-medium',
    changeTitle:
      'inline-block truncate  w-full max-w-150 px-1 py-0  text-zinc-700 font-bold  hover:rounded-(--r2)  hover:bg-dark-400',
    confirm: 'h-7 bg-primary text-zinc-700 font-medium hover:bg-primary-light',
    closeSvg: 'h-7 font-medium hover:bg-zinc-800',
  };

  btnClass = computed(() => {
    const btnName = this.name();
    if (btnName) {
      if (btnName.endsWith('deleteBoardSvg')) {
        return `${this.btnClassMap[btnName]}`;
      } else {
        return `${this.baseClasses} ${this.btnClassMap[btnName]}`;
      }
    } else {
      return this.baseClasses;
    }
  });
}
