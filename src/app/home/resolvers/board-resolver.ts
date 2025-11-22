import { ResolveFn } from '@angular/router';
import { IBoard } from '../interfaces/i-board';
import { inject } from '@angular/core';
import { SBoards } from '../services/s-boards';

export const boardResolver: ResolveFn<IBoard> = (route) => {
  const boardService = inject(SBoards);
  const id = Number(route.paramMap.get('id'));

  return boardService.getBoard(id);
};
