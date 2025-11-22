import { ResolveFn } from '@angular/router';
import { IBoard } from '../interfaces/i-board';
import { inject } from '@angular/core';
import { SBoards } from '../services/s-boards';

export const boardsResolver: ResolveFn<IBoard[]> = () => {
  const boardsService = inject(SBoards);
  return boardsService.getBoards();
};
