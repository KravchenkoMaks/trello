import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { List } from '@components/list/list';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Btn } from '@shared/btn/btn';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, filter, switchMap } from 'rxjs';
import { ToastService } from '@services/toast-service';
import { DialogService } from '@services/dialog-service';
import { CustomLoadingOverlay } from '@shared/loading/custom-loading-overlay/custom-loading-overlay';
import { BoardStore } from '@stores/board-store';
import { TitleChangingForm } from '@components/forms/title-changing-form/title-changing-form';

@Component({
  selector: 'tr-board',
  imports: [List, RouterLink, Btn, CustomLoadingOverlay, TitleChangingForm],
  templateUrl: './board.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  private route = inject(ActivatedRoute);
  dialog = inject(DialogService);
  destroyRef = inject(DestroyRef);
  store = inject(BoardStore);
  toast = inject(ToastService);

  isListCreating = computed(() => this.store.isListCreating());

  constructor() {
    combineLatest([this.route.paramMap, this.route.data])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, { board }]) => {
        const id = Number(params.get('id'));
        this.store.setBoard({ ...board, id });
      });
  }

  changeTitle(newTitle: string) {
    this.store.changeTitle(newTitle).subscribe({
      next: () => this.toast.showSuccess('The name of the board has been updated'),
      error: () => this.toast.showError('Error updating the board'),
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
        next: () => this.toast.showSuccess('A new list has been created'),
        error: () => this.toast.showError('Error creating list'),
      });
  };
}
