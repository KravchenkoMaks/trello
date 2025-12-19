import { inject, Injectable, signal } from '@angular/core';
import { IBoard } from '@models/interfaces/i-board';
import { INewBoard } from '@models/interfaces/i-new-board';
import { BoardService } from '@services/board-service';
import { getRandomColor } from '@shared/utils/colors';
import { catchError, EMPTY, finalize, Observable, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardStore {
  private boardService = inject(BoardService);

  private boardsSignal = signal<IBoard[]>([]);
  private currentBoardSignal = signal<IBoard | null>(null);

  readonly boards = this.boardsSignal.asReadonly();
  readonly currentBoard = this.currentBoardSignal.asReadonly();

  isBoardCreating = signal(false);
  isBoardDeleting = signal(false);
  isListCreating = signal(false);
  isBoardUpdating = signal(false);

  setBoards(boards: IBoard[]) {
    this.boardsSignal.set(boards);
  }

  setCurrentBoard(board: IBoard | null) {
    this.currentBoardSignal.set(board);
  }

  createBoard(title: string): Observable<IBoard[]> {
    if (!title) return of(this.boards());

    this.isBoardCreating.set(true);

    const color = getRandomColor();
    const newBoard: INewBoard = { title, custom: { color } };

    return this.boardService.createBoard(newBoard).pipe(
      switchMap(() => this.boardService.getBoards()),
      tap((boards) => this.setBoards(boards)),
      catchError((err) => {
        console.error('Помилка при створенні дошки:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isBoardCreating.set(false))
    );
  }

  deleteBoard(boardId: number): Observable<IBoard[]> {
    if (!boardId) return of(this.boards());

    this.isBoardDeleting.set(true);

    return this.boardService.deleteBoard(boardId).pipe(
      switchMap(() => this.boardService.getBoards()),
      tap((boards) => this.setBoards(boards)),
      catchError((err) => {
        console.error('Помилка при видаленні дошки:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isBoardDeleting.set(false))
    );
  }

  changeBoardTitle(newTitle: string): Observable<IBoard> {
    const board = this.currentBoard();
    const title = newTitle.trim();

    if (!board || !title || this.isBoardUpdating()) {
      return EMPTY;
    }

    this.isBoardUpdating.set(true);

    const id = board.id;
    return this.boardService.updateBoard(id, { title }).pipe(
      switchMap(() => this.boardService.getBoard(id)),
      tap((board) => this.refreshBoard(id, board)),
      catchError((err) => {
        console.error('Помилка при оновленні дошки:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isBoardUpdating.set(false))
    );
  }

  createList(title: string): Observable<IBoard> {
    const currentBoard = this.currentBoard();

    if (!title || !currentBoard) {
      return EMPTY;
    }

    this.isListCreating.set(true);

    const boardId = currentBoard.id;
    const position = currentBoard.lists.length + 1;

    return this.boardService.createList(boardId, { title, position }).pipe(
      switchMap(() => this.boardService.getBoard(boardId)),
      tap((board) => this.refreshBoard(boardId, board)),
      catchError((err) => {
        console.error('Помилка при створенні списку:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isListCreating.set(false))
    );
  }

  refreshBoard(id: number, board: IBoard) {
    this.setCurrentBoard({ ...board, id });
    this.setBoards(this.boards().map((b) => (b.id === id ? board : b)));
  }
}
