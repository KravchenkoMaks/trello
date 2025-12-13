import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IBoard } from '@interfaces/i-board';
import { SBoard } from '@services/s-board';

export const boardsResolver: ResolveFn<IBoard[]> = () => {
  const bs = inject(SBoard);
  return bs.getBoards();
};
