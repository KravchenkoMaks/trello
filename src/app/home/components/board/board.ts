import { Component, inject } from '@angular/core';
import { List } from '../list/list';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { IBoard } from '../../interfaces/i-board';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tr-board',
  imports: [RouterOutlet, List, RouterLink],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  board?: IBoard;
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ board }) => {
      this.board = board;
    });
  }
}
