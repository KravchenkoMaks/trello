import { inject, Injectable, signal } from '@angular/core';
import { IBoard } from '@models/interfaces/i-board';
import { INewCard } from '@models/interfaces/new-card';
import { BoardsService } from '@services/boards-service';
import { catchError, EMPTY, finalize, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardStore {
  private boardsService = inject(BoardsService);

  private boardSignal = signal<IBoard | null>(null);
  readonly board = this.boardSignal.asReadonly();

  isBoardUpdating = signal(false);
  isListCreating = signal(false);
  isCardCreating = signal(false);

  setBoard(board: IBoard | null) {
    this.boardSignal.set(board);
  }

  private refreshBoard(boardId: number): Observable<IBoard> {
    return this.boardsService.getBoard(boardId).pipe(tap((board) => this.setBoard({ ...board, id: boardId })));
  }

  changeTitle(newTitle: string): Observable<IBoard> {
    const board = this.board();
    const title = newTitle.trim();

    if (!board || !title || this.isBoardUpdating()) {
      return EMPTY;
    }

    this.isBoardUpdating.set(true);
    const id = board.id;

    return this.boardsService.updateBoard(id, { title }).pipe(
      switchMap(() => this.refreshBoard(id)),
      catchError((err) => {
        console.error('Помилка при оновленні дошки:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isBoardUpdating.set(false))
    );
  }

  createList(title: string): Observable<IBoard> {
    const board = this.board();

    if (!title || !board) {
      return EMPTY;
    }

    this.isListCreating.set(true);

    const boardId = board.id;
    const position = board.lists.length + 1;

    return this.boardsService.createList(boardId, { title, position }).pipe(
      switchMap(() => this.refreshBoard(boardId)),
      catchError((err) => {
        console.error('Помилка при створенні списку:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isListCreating.set(false))
    );
  }

  addCard(listId: number, newTitle: string): Observable<IBoard> {
    const board = this.board();
    const title = newTitle.trim();

    if (!board || !title || this.isCardCreating()) {
      return EMPTY;
    }

    const list = board.lists.find((l) => l.id === listId);
    if (!list) {
      return EMPTY;
    }

    this.isCardCreating.set(true);

    const dto: INewCard = {
      title,
      list_id: listId,
      position: list.cards.length + 1,
    };

    return this.boardsService.createCard(board.id, dto).pipe(
      switchMap(() => this.refreshBoard(board.id)),
      catchError((err) => {
        console.error('Помилка при створенні картки:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isCardCreating.set(false))
    );
  }
}
