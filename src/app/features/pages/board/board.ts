import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { List } from '@components';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { ToastService } from '@services';
import { DialogService } from '@services';
import { CustomLoadingOverlay } from '@loading';
import { BoardStore } from '@stores';
import { Btn } from '@buttons';
import { ListCreatingForm, TitleChangingForm } from '@forms';

@Component({
  selector: 'tr-board',
  imports: [List, RouterLink, Btn, CustomLoadingOverlay, ListCreatingForm, TitleChangingForm],
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

  isListAdding = signal<boolean>(false);

  constructor() {
    combineLatest([this.route.paramMap, this.route.data])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, { board }]) => {
        const id = Number(params.get('id'));
        this.store.setBoard({ ...board, id });
      });
  }

  changeTitle(newTitle: string): void {
    this.store.changeTitle(newTitle).subscribe({
      next: () => this.toast.showSuccess('The name of the board has been updated'),
      error: () => this.toast.showError('Error updating the board'),
    });
  }

  createList(title: string): void {
    this.store.createList(title).subscribe({
      next: () => this.toast.showSuccess('A new list has been created'),
      error: () => this.toast.showError('Error creating list'),
    });
  }

  openListAddingForm = (): void => {
    this.isListAdding.set(true);
  };

  closeListAddingForm = (): void => {
    this.isListAdding.set(false);
  };
}
