import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Btn } from '@shared/btn/btn';
import { NgStyle } from '@angular/common';
import { BoardsStore } from '@stores/boards-store';

import { filter, switchMap } from 'rxjs';
import { DialogService } from '@services/dialog-service';
import { ToastService } from '@services/toast-service';
import { Loader } from '@shared/loader/loader';

@Component({
  selector: 'tr-home',
  imports: [RouterLink, Btn, NgStyle, Loader],
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

  createBoard = (): void => {
    this.dialog
      .openCreateModal('board')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(Boolean),
        switchMap((title) => this.store.createBoard(title))
      )
      .subscribe({
        error: (err) => console.error('Помилка при створенні дошки', err),
      });
  };

  getDeleteBoardCallback(boardId: number, boardTitle: string): () => void {
    return () => this.deleteBoard(boardId, boardTitle);
  }

  deleteBoard = (boardId: number, boardTitle: string): void => {
    this.dialog
      .openDeleteModal('board', boardTitle)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((confirmed) => confirmed),
        switchMap(() => this.store.deleteBoard(boardId))
      )
      .subscribe({
        next: () => this.toast.showSuccess(`Дошка '${boardTitle}' видалена`),
        error: (err) => this.toast.showError('Помилка при видаленні дошки', err),
      });
  };
}
