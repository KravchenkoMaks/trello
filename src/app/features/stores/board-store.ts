import { computed, inject, Injectable, signal } from '@angular/core';
import { IBoard } from '@models/interfaces/i-board';
import { INewBoard } from '@models/interfaces/i-new-board';
import { SBoards } from '@services/s-board';
import { getRandomColor } from '@shared/utils/colors';
import { finalize, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardStore {
  private boardsService = inject(SBoards);
  private boardsSignal = signal<IBoard[]>([]);
  private currentBoardSignal = signal<IBoard | null>(null);

  private creatingCount = signal(0);
  private deletingCount = signal(0);

  readonly boards = this.boardsSignal.asReadonly();
  readonly currentBoard = this.currentBoardSignal.asReadonly();
  readonly boardCreating = computed(() => this.creatingCount() > 0);
  readonly boardDeleting = computed(() => this.deletingCount() > 0);

  setBoards(boards: IBoard[]) {
    this.boardsSignal.set(boards);
  }

  setCurrentBoard(board: IBoard | null) {
    this.currentBoardSignal.set(board);
  }

  createBoard(title: string): Observable<IBoard[]> {
    if (!title) return of(this.boards());

    this.creatingCount.update((c) => c + 1);

    const color = getRandomColor();
    const newBoard: INewBoard = { title, custom: { color } };

    return this.boardsService.createBoard(newBoard).pipe(
      switchMap(() => this.boardsService.getBoards()),
      tap((boards) => this.setBoards(boards)),
      finalize(() => this.creatingCount.update((c) => Math.max(0, c - 1)))
    );
  }

  deleteBoard(boardId: number): Observable<IBoard[]> {
    if (!boardId) return of(this.boards());

    this.deletingCount.update((c) => c + 1);

    return this.boardsService.deleteBoard(boardId).pipe(
      switchMap(() => this.boardsService.getBoards()),
      tap((boards) => this.setBoards(boards)),
      finalize(() => this.deletingCount.update((c) => Math.max(0, c - 1)))
    );
  }
}
