import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IBoard } from '@models/interfaces/i-board';
import { SBoards } from '@services/s-board';

export const boardsResolver: ResolveFn<IBoard[]> = () => {
  const bs = inject(SBoards);
  return bs.getBoards();
};
