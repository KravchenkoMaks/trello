import { Component, DestroyRef, inject, signal } from '@angular/core';
import { IBoard } from '../../interfaces/i-board';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { CreateBoardModal } from '../modals/create-board-modal/create-board-modal';
import { NgStyle } from '@angular/common';

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

  protected title = 'Мої дошки';
  protected boards = signal<IBoard[]>([]);

  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ boards }) => {
      this.boards.set(boards);
    });
  }

  openModal(): void {
    this.dialog
      .open<IBoard[]>(CreateBoardModal)
      .closed.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updatedBoards) => {
        console.log(updatedBoards);
        if (updatedBoards) {
          this.boards.set(updatedBoards);
        }
      });
  }
}
