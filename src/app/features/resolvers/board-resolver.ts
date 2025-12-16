import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IBoard } from '@models/interfaces/i-board';
import { SBoards } from '@services/s-board';

export const boardResolver: ResolveFn<IBoard | null> = (route) => {
  const bs = inject(SBoards);
  const id = Number(route.paramMap.get('id'));

  return bs.getBoard(id);
};
