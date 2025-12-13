import { Component, inject, signal } from '@angular/core';
import { IBoard } from '@interfaces/i-board';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Btn } from '@shared/btn/btn';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'tr-home',
  imports: [RouterLink, Btn, NgStyle],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private route = inject(ActivatedRoute);
  // private dialog = inject(Dialog);
  // private destroyRef = inject(DestroyRef);
  // private boardsService = inject(SBoards);

  protected title = 'My Boards';
  protected boards = signal<IBoard[]>([]);

  isCreateBoard = signal(false);

  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ boards }) => {
      this.boards.set(boards);
    });
  }

  createBoard = () => {
    console.log('Hello');
    this.isCreateBoard.set(true);
    setTimeout(() => {
      this.isCreateBoard.set(false);
    }, 2000);
  };
}
