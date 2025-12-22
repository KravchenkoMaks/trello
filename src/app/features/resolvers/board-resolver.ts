import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IBoard } from '@interfaces';
import { BoardsService } from '@services';

export const boardResolver: ResolveFn<IBoard | null> = (route) => {
  const bs = inject(BoardsService);
  const id = Number(route.paramMap.get('id'));

  return bs.getBoard(id);
};
