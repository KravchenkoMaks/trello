import { Component, inject, signal } from '@angular/core';
import { List } from '@components/list/list';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Btn } from '@shared/btn/btn';
import { SBoard } from '@services/s-board';
import { IBoard } from '@interfaces/i-board';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { Loader } from '@shared/loader/loader';

@Component({
  selector: 'tr-board',
  imports: [List, RouterLink, Btn, Loader],
  templateUrl: './board.html',
  styles: ``,
})
export class Board {
  private route = inject(ActivatedRoute);
  // private boardsService = inject(SBoard);

  board = signal<IBoard | null>(null);
  // private boardId?: number;

  constructor() {
    combineLatest([this.route.paramMap, this.route.data])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, { board }]) => {
        const id = Number(params.get('id'));
        this.board.set({ ...board, id });
      });
  }
}
