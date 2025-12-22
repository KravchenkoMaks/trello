import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IBoard } from '@interfaces';
import { BoardsService } from '@services';

export const boardsResolver: ResolveFn<IBoard[]> = () => {
  const bs = inject(BoardsService);
  return bs.getBoards();
};
