import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IBoard } from '@models/interfaces/i-board';
import { BoardService } from '@services/board-service';

export const boardsResolver: ResolveFn<IBoard[]> = () => {
  const bs = inject(BoardService);
  return bs.getBoards();
};
