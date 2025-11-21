import { Component, inject } from '@angular/core';
import { List } from '../list/list';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { IBoard } from '../../interfaces/i-board';

@Component({
  selector: 'tr-board',
  imports: [RouterOutlet, List, RouterLink],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  private route = inject(ActivatedRoute);

  board: IBoard = this.route.snapshot.data['board'] as IBoard;
}
