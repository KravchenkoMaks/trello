import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IBoard } from '../../interfaces/i-board';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { CreateBoardModal } from '../modals/create-board-modal/create-board-modal';
import { NgStyle } from '@angular/common';
import { delay, EMPTY, finalize, switchMap } from 'rxjs';
import { SBoards } from '../../services/s-boards';

@Component({
  selector: 'tr-home',
  imports: [RouterLink, RouterOutlet, NgStyle],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private route = inject(ActivatedRoute);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  private boardsService = inject(SBoards);

  protected title = 'Мої дошки';
  protected boards = signal<IBoard[]>([]);
  protected isLoading = signal(false);

  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ boards }) => {
      this.boards.set(boards);
    });
  }

  createBoard(): void {
    this.dialog
      .open<string>(CreateBoardModal)
      .closed.pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((title) => {
          if (!title) return EMPTY;
          this.isLoading.set(true);
          return this.boardsService.createBoard(title).pipe(
            switchMap(() => this.boardsService.getBoards()),
            finalize(() => this.isLoading.set(false))
          );
        })
      )
      .subscribe({
        next: (boards) => this.boards.set(boards),
        error: (err) => console.error('Error while creating board', err),
      });
  }
}
