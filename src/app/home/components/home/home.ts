import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IBoard } from '../../interfaces/i-board';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { NgStyle } from '@angular/common';
import { EMPTY, finalize, switchMap } from 'rxjs';
import { SBoards } from '../../services/s-boards';
import { TitleModal } from '../modals/title-modal/title-modal';
import { ITitleModal } from '../../interfaces/i-title-modal';

@Component({
  selector: 'tr-home',
  imports: [RouterLink, RouterOutlet, NgStyle],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private route = inject(ActivatedRoute);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  private boardsService = inject(SBoards);

  protected title = 'Мої дошки';
  protected boards = signal<IBoard[]>([]);
  protected isLoading = signal(false); // I would make it more explicit and change the "loading" word to "pending", for ex. "isBoardPending" or "isBoardCreating"

  private titleModalData: ITitleModal = {
    modalTitle: 'Створити дошку',
    label: 'Назва дошки',
    placeholder: 'Введіть назву дошки',
  };

  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ boards }) => {
      this.boards.set(boards);
    });
  }

  createBoard(): void {
    this.dialog
      .open<string>(TitleModal, { data: this.titleModalData })
      .closed.pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((title) => {
          if (!title) return EMPTY;
          this.isLoading.set(true);
          // TODO I would move the the pipe to the parent pipe.
          return this.boardsService.createBoard(title);
        }),
        switchMap(() => this.boardsService.getBoards()),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (boards) => this.boards.set(boards),
        error: (err) => console.error('Error while creating board', err),
      });
  }
}
