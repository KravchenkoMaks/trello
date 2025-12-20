import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Card } from '@components/card/card';
import { DialogService } from '@services/dialog-service';
import { Btn } from '@shared/btn/btn';
import { BoardsStore } from '@stores/boards-store';
import { switchMap, filter } from 'rxjs';
import { ToastService } from '@services/toast-service';
import { IList } from '@models/interfaces/i-list';

@Component({
  selector: 'tr-list',
  imports: [Card, Btn],
  templateUrl: './list.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  store = inject(BoardsStore);
  dialog = inject(DialogService);
  destroyRef = inject(DestroyRef);
  toast = inject(ToastService);

  list = input.required<IList>();

  isCardCreating = computed(() => this.store.isCardCreating());

  createCard = (): void => {
    this.dialog
      .openCreateModal('card')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean),
        switchMap((title) => this.store.addCard(this.list().id, title))
      )
      .subscribe({
        next: () => this.toast.showSuccess(`Створено нова картка.`),
        error: () => this.toast.showError('Помилка при створенні картки'),
      });
  };
}
