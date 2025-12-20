import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { List } from '@components/list/list';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Btn } from '@shared/btn/btn';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, filter, switchMap } from 'rxjs';
import { BoardsStore } from '@stores/boards-store';
import { TextChangingForm } from '@shared/forms/text-changing-form/text-changing-form';
import { ToastService } from '@services/toast-service';
import { DialogService } from '@services/dialog-service';
import { CustomLoadingOverlay } from '@shared/loading/custom-loading-overlay/custom-loading-overlay';

@Component({
  selector: 'tr-board',
  imports: [List, RouterLink, Btn, TextChangingForm, CustomLoadingOverlay],
  templateUrl: './board.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  private route = inject(ActivatedRoute);
  dialog = inject(DialogService);
  destroyRef = inject(DestroyRef);
  store = inject(BoardsStore);
  toast = inject(ToastService);

  isListCreating = computed(() => this.store.isListCreating());

  constructor() {
    combineLatest([this.route.paramMap, this.route.data])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, { board }]) => {
        const id = Number(params.get('id'));
        this.store.setCurrentBoard({ ...board, id });
      });
  }

  changeBoardTitle(newTitle: string) {
    this.store.changeBoardTitle(newTitle).subscribe({
      next: () => this.toast.showSuccess('Назву дошки оновлено'),
      error: () => this.toast.showError('Помилка при оновленні дошки'),
    });
  }

  createList = (): void => {
    this.dialog
      .openCreateModal('list')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean),
        switchMap((title) => this.store.createList(title))
      )
      .subscribe({
        next: () => this.toast.showSuccess(`Створено новий список '.`),
        error: () => this.toast.showError('Помилка при створенні списку'),
      });
  };
}
