import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgStyle } from '@angular/common';
import { BoardsStore } from '@stores';
import { filter, switchMap } from 'rxjs';
import { DialogService, ToastService } from '@services';
import { Btn } from '@buttons';

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

  protected title = 'My Boards';

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
        next: () => this.toast.showSuccess('Board created'),
        error: () => this.toast.showError('Error creating board'),
      });
  };

  getDeleteBoardCallback(boardId: number, title: string): () => void {
    return () => this.deleteBoard(boardId, title);
  }

  deleteBoard = (boardId: number, title: string): void => {
    this.dialog
      .openDeleteModal('board', title)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((confirmed) => confirmed),
        switchMap(() => this.store.deleteBoard(boardId))
      )
      .subscribe({
        next: () => this.toast.showSuccess(`Board '${title}' deleted`),
        error: (err) => this.toast.showError('Error during board removal', err),
      });
  };
}
