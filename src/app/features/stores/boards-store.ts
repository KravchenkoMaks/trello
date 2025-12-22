import { inject, Injectable, signal } from '@angular/core';
import { IBoard, INewBoard } from '@interfaces';
import { BoardsService } from '@services';
import { getRandomColor } from '@utils';
import { catchError, finalize, Observable, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardsStore {
  private boardsService = inject(BoardsService);

  private boardsSignal = signal<IBoard[]>([]);
  readonly boards = this.boardsSignal.asReadonly();

  isBoardCreating = signal(false);
  isBoardDeleting = signal(false);

  setBoards(boards: IBoard[]) {
    this.boardsSignal.set(boards);
  }

  addBoard(title: string): Observable<IBoard[]> {
    if (!title) return of(this.boards());

    this.isBoardCreating.set(true);

    const color = getRandomColor();
    const newBoard: INewBoard = { title, custom: { color } };

    return this.boardsService.createBoard(newBoard).pipe(
      switchMap(() => this.boardsService.getBoards()),
      tap((boards) => this.setBoards(boards)),
      catchError((err) => {
        console.error('Error creating board:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isBoardCreating.set(false))
    );
  }

  deleteBoard(boardId: number): Observable<IBoard[]> {
    if (!boardId) return of(this.boards());

    this.isBoardDeleting.set(true);

    return this.boardsService.deleteBoard(boardId).pipe(
      switchMap(() => this.boardsService.getBoards()),
      tap((boards) => this.setBoards(boards)),
      catchError((err) => {
        console.error('Error during board removal:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isBoardDeleting.set(false))
    );
  }
}
