import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IBoard } from '@interfaces/i-board';
import { BoardsService } from '@services/boards-service';

export const boardsResolver: ResolveFn<IBoard[]> = () => {
  const bs = inject(BoardsService);
  return bs.getBoards();
};
