import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IBoard } from '@interfaces/i-board';
import { SBoard } from '@services/s-board';

export const boardResolver: ResolveFn<IBoard | null> = (route) => {
  const boardService = inject(SBoard);
  const id = Number(route.paramMap.get('id'));

  return boardService.getBoard(id);
};
