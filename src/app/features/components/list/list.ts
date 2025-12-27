import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { Card } from '@components';
import { Btn } from '@buttons';
import { BoardStore } from '@stores';
import { DialogService, ToastService } from '@services';
import { IList } from '@interfaces';
import { CardCreatingForm } from '@forms';

@Component({
  selector: 'tr-list',
  imports: [Card, Btn, CardCreatingForm],
  templateUrl: './list.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  store = inject(BoardStore);
  dialog = inject(DialogService);
  destroyRef = inject(DestroyRef);
  toast = inject(ToastService);

  list = input.required<IList>();

  isCardAdding = signal<boolean>(false);

  addCard = (title: string): void => {
    this.store.addCard(this.list().id, title).subscribe({
      next: () => this.toast.showSuccess('New card created'),
      error: () => this.toast.showError('Error creating card'),
    });
  };

  openCardAddingForm = (): void => {
    this.isCardAdding.set(true);
  };

  closeCardAddingForm = (): void => {
    this.isCardAdding.set(false);
  };
}
