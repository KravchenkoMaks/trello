import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Btn } from '@shared/btn/btn';
import { NgStyle } from '@angular/common';
import { BoardStore } from '@stores/board-store';

import { filter, switchMap } from 'rxjs';
import { SDialog } from '@services/s-dialog';

@Component({
  selector: 'tr-home',
  imports: [RouterLink, Btn, NgStyle],
  templateUrl: './home.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private route = inject(ActivatedRoute);
  private dialog = inject(SDialog);
  private destroyRef = inject(DestroyRef);

  store = inject(BoardStore);

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
        error: (err) => console.error('Error creating board', err),
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
        error: (err) => console.error('Error deleting board', err),
      });
  };
}
