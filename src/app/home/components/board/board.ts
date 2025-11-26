import { Component, DestroyRef, inject, signal } from '@angular/core';
import { List } from '../list/list';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { IBoard } from '../../interfaces/i-board';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBoards } from '../../services/s-boards';
import { BoardHeaderForm } from '../forms/board-header-form/board-header-form';
import { Dialog } from '@angular/cdk/dialog';
import { EMPTY, finalize, switchMap, tap } from 'rxjs';
import { ICreateListDto } from '../../interfaces/i-create-list-dto';
import { TitleModal } from '../modals/title-modal/title-modal';
import { ITitleModal } from '../../interfaces/i-title-modal';

@Component({
  selector: 'tr-board',
  imports: [RouterOutlet, List, RouterLink, ReactiveFormsModule, BoardHeaderForm],
  import { TitleModal } from './../modals/title-modal/title-modal';
templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  private route = inject(ActivatedRoute);
  private boardsService = inject(SBoards);
  private fb = inject(FormBuilder);
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  form: FormGroup;
  board = signal<IBoard | undefined>(undefined);
  private boardId: number;
  private saveTriggered = false;
  protected isLoading = signal(false);

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
    });

    this.boardId = Number(this.route.snapshot.paramMap.get('id'));

    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ board }) => {
      this.board.set({ ...board, id: this.boardId });
    });
  }

  updateTitle(newTitle: string): void {
    if (this.saveTriggered || this.form.invalid) return;

    this.saveTriggered = true;
    setTimeout(() => (this.saveTriggered = false), 500);

    const boardId = this.boardId ?? this.board()?.id;
    if (!boardId) return;

    this.isLoading.set(true);

    this.boardsService
      .updateBoard(boardId, { title: newTitle })
      .pipe(
        switchMap(() => this.boardsService.getBoard(boardId)),
        tap((updatedBoard) => this.board.set({ ...updatedBoard, id: boardId })),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        error: (err) => console.error('Помилка при оновленні назви:', err),
      });
  }

  private titleModalData: ITitleModal = {
    modalTitle: 'Створити список',
    label: 'Назва списка',
    placeholder: 'Введіть назву списка',
  };

  createList(): void {
    this.dialog
      .open<string>(TitleModal, { data: this.titleModalData })
      .closed.pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((title) => {
          if (!title) return EMPTY;

          const boardId = this.boardId ?? this.board()?.id;
          if (!boardId) return EMPTY;

          const position = this.board()?.lists?.length ?? 0;
          const dto: ICreateListDto = { title, position };

          this.isLoading.set(true);

          return this.boardsService.createList(boardId, dto).pipe(
            switchMap(() => this.boardsService.getBoard(boardId)),
            tap((updatedBoard) => this.board.set({ ...updatedBoard, id: boardId })),
            finalize(() => this.isLoading.set(false))
          );
        })
      )
      .subscribe({
        error: (err) => console.error('Помилка при створенні списку:', err),
      });
  }
}
