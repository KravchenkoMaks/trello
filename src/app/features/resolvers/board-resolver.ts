import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IBoard } from '@models/interfaces/i-board';
import { BoardService } from '@services/board-service';

export const boardResolver: ResolveFn<IBoard | null> = (route) => {
  const bs = inject(BoardService);
  const id = Number(route.paramMap.get('id'));

  return bs.getBoard(id);
};
