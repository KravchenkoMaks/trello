import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { TBtn } from '@models/types/t-btn';
import { TBtnRole } from '@models/types/t-btn-role';

@Component({
  selector: 'tr-btn',
  imports: [NgClass, CommonModule],
  templateUrl: './btn.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Btn {
  label = input<string>('');
  role = input<TBtnRole>();
  type = input<TBtn>('button');
  disabled = input<boolean>(false);
  action = input<() => void>();

  handleClick() {
    if (!this.disabled()) {
      this.action()?.();
    }
  }

  baseClasses =
    'cursor-pointer rounded-md px-2 py-1 font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center';

  private readonly btnClassMap: Record<TBtnRole, string> = {
    createBoard: 'bg-dark-2 board-size  hover:bg-dark-1',
    createList: 'bg-dark-2 list-w hover:bg-dark-1',
    createCard: 'bg-dark-3 hover:bg-dark-1',
    cancel: ' w-full text-primary hover:text-light hover:bg-primary',
    delete: 'text-unsuccess hover:text-light hover:bg-unsuccess',
    create: 'w-full bg-primary text-gray-1 disabled:bg-dark-1',
    changeTitle: 'text-3xl font-bold text-title hover:bg-dark-2',
  };

  btnClass = computed(() => {
    const btnName = this.role();
    return btnName ? `${this.baseClasses} ${this.btnClassMap[btnName]}` : this.baseClasses;
  });
}
