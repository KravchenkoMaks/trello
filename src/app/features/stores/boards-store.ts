import { inject, Injectable, signal } from '@angular/core';
import { IBoard } from '@models/interfaces/i-board';
import { INewBoard } from '@models/interfaces/i-new-board';
import { BoardsService } from '@services/boards-service';
import { getRandomColor } from '@shared/utils/colors';
import { catchError, finalize, Observable, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardsStore {
  private boardsService = inject(BoardsService);

  private boardsSignal = signal<IBoard[]>([]);
  readonly boards = this.boardsSignal.asReadonly();

  // private currentBoardSignal = signal<IBoard | null>(null);
  // readonly currentBoard = this.currentBoardSignal.asReadonly();

  isBoardCreating = signal(false);
  isBoardDeleting = signal(false);
  // isBoardUpdating = signal(false);
  // isListCreating = signal(false);
  // isCardCreating = signal(false);

  setBoards(boards: IBoard[]) {
    this.boardsSignal.set(boards);
  }

  // setCurrentBoard(board: IBoard | null) {
  //   this.currentBoardSignal.set(board);
  // }

  addBoard(title: string): Observable<IBoard[]> {
    if (!title) return of(this.boards());

    this.isBoardCreating.set(true);

    const color = getRandomColor();
    const newBoard: INewBoard = { title, custom: { color } };

    return this.boardsService.createBoard(newBoard).pipe(
      switchMap(() => this.boardsService.getBoards()),
      tap((boards) => this.setBoards(boards)),
      catchError((err) => {
        console.error('Помилка при створенні дошки:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isBoardCreating.set(false))
    );
  }

  removeBoard(boardId: number): Observable<IBoard[]> {
    if (!boardId) return of(this.boards());

    this.isBoardDeleting.set(true);

    return this.boardsService.deleteBoard(boardId).pipe(
      switchMap(() => this.boardsService.getBoards()),
      tap((boards) => this.setBoards(boards)),
      catchError((err) => {
        console.error('Помилка при видаленні дошки:', err);
        return throwError(() => err);
      }),
      finalize(() => this.isBoardDeleting.set(false))
    );
  }

  // changeBoardTitle(newTitle: string): Observable<IBoard> {
  //   const board = this.currentBoard();
  //   const title = newTitle.trim();

  //   if (!board || !title || this.isBoardUpdating()) {
  //     return EMPTY;
  //   }

  //   this.isBoardUpdating.set(true);

  //   const id = board.id;
  //   return this.boardsService.updateBoard(id, { title }).pipe(
  //     switchMap(() => this.boardsService.getBoard(id)),
  //     tap((board) => this.refreshBoard(id, board)),
  //     catchError((err) => {
  //       console.error('Помилка при оновленні дошки:', err);
  //       return throwError(() => err);
  //     }),
  //     finalize(() => this.isBoardUpdating.set(false))
  //   );
  // }

  // createList(title: string): Observable<IBoard> {
  //   const currentBoard = this.currentBoard();

  //   if (!title || !currentBoard) {
  //     return EMPTY;
  //   }

  //   this.isListCreating.set(true);

  //   const boardId = currentBoard.id;
  //   const position = currentBoard.lists.length + 1;

  //   return this.boardsService.createList(boardId, { title, position }).pipe(
  //     switchMap(() => this.boardsService.getBoard(boardId)),
  //     tap((board) => this.refreshBoard(boardId, board)),
  //     catchError((err) => {
  //       console.error('Помилка при створенні списку:', err);
  //       return throwError(() => err);
  //     }),
  //     finalize(() => this.isListCreating.set(false))
  //   );
  // }

  // addCard(listId: number, newTitle: string): Observable<IBoard> {
  //   const board = this.currentBoard();
  //   const title = newTitle.trim();

  //   console.group(`addCard(listId: ${listId})`);

  //   if (!board) {
  //     console.error('Не знайдено поточну дошку (currentBoard is null).');
  //     console.groupEnd();
  //     return EMPTY;
  //   }

  //   if (!title) {
  //     console.warn('Назва картки порожня — створення скасовано.');
  //     console.groupEnd();
  //     return EMPTY;
  //   }

  //   if (this.isCardCreating()) {
  //     console.warn('Створення картки вже триває, очікуємо завершення.');
  //     console.groupEnd();
  //     return EMPTY;
  //   }

  //   const list = board.lists.find((l) => l.id === listId);
  //   if (!list) {
  //     console.error(`Не знайдено список з ID #${listId}.`);
  //     console.groupEnd();
  //     return EMPTY;
  //   }

  //   this.isCardCreating.set(true);

  //   const boardId = board.id;
  //   const position = list.cards.length + 1;

  //   const dto: INewCard = {
  //     title,
  //     list_id: listId,
  //     position,
  //   };

  //   return this.boardsService.createCard(boardId, dto).pipe(
  //     tap(() => console.info('Картку успішно створено на сервері.')),
  //     switchMap(() => this.boardsService.getBoard(boardId)),
  //     tap((board) => this.refreshBoard(boardId, board)),
  //     catchError((err) => {
  //       console.error('Помилка при створенні картки:', err);
  //       return throwError(() => err);
  //     }),
  //     finalize(() => {
  //       this.isCardCreating.set(false);
  //       console.groupEnd();
  //       console.info('Завершено процес створення картки.');
  //     })
  //   );
  // }

  // refreshBoard(id: number, board: IBoard) {
  //   console.info('Оновлення даних дошки після створення картки.');
  //   this.setCurrentBoard({ ...board, id });
  //   this.setBoards(this.boards().map((b) => (b.id === id ? board : b)));
  // }
}
