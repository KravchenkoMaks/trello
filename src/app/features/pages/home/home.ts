import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Btn } from '@shared/btn/btn';
import { NgStyle } from '@angular/common';
import { BoardsStore } from '@stores/boards-store';
import { filter, switchMap } from 'rxjs';
import { DialogService } from '@services/dialog-service';
import { ToastService } from '@services/toast-service';

@Component({
  selector: 'tr-home',
  imports: [RouterLink, Btn, NgStyle],
  templateUrl: './home.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private route = inject(ActivatedRoute);
  private dialog = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  store = inject(BoardsStore);
  toast = inject(ToastService);

  protected title = 'Мої дошки';

  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ boards }) => {
      this.store.setBoards(boards);
    });
  }

  addBoard = (): void => {
    this.dialog
      .openCreateModal('board')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean),
        switchMap((title) => this.store.addBoard(title))
      )
      .subscribe({
        error: (err) => console.error('Помилка при створенні дошки', err),
      });
  };

  getRemoveBoardCallback(boardId: number, boardTitle: string): () => void {
    return () => this.removeBoard(boardId, boardTitle);
  }

  removeBoard = (boardId: number, boardTitle: string): void => {
    this.dialog
      .openDeleteModal('board', boardTitle)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((confirmed) => confirmed),
        switchMap(() => this.store.removeBoard(boardId))
      )
      .subscribe({
        next: () => this.toast.showSuccess(`Дошка '${boardTitle}' видалена`),
        error: (err) => this.toast.showError('Помилка при видаленні дошки', err),
      });
  };
}
