import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { List } from '../list/list';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { IBoard } from '../../interfaces/i-board';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBoards } from '../../services/s-boards';
import { BoardHeaderForm } from '../forms/board-header-form/board-header-form';
import { Dialog } from '@angular/cdk/dialog';
import { CreateListModal } from '../modals/create-list-modal/create-list-modal';
import { delay, EMPTY, finalize, of, pipe, switchMap, tap } from 'rxjs';

@Component({
  selector: 'tr-board',
  imports: [RouterOutlet, List, RouterLink, ReactiveFormsModule, BoardHeaderForm],
  templateUrl: './board.html',
  styleUrl: './board.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  updateTitle(newTitle: string) {
    if (this.saveTriggered || this.form.invalid) {
      return;
    }
    this.saveTriggered = true;
    setTimeout(() => (this.saveTriggered = false), 500);

    const id = this.board()?.id ?? this.boardId;

    this.boardsService.updateBoard(id, { title: newTitle }).subscribe({
      next: () => {
        this.boardsService.getBoard(id).subscribe({
          next: (updatedBoard) => this.board.set({ ...updatedBoard, id }),
          error: (err) => console.error('Помилка при GET:', err),
        });
      },
      error: (err) => console.error('Помилка при PUT:', err),
    });
  }

  createList(): void {
    this.dialog
      .open<string>(CreateListModal)
      .closed.pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((t) => {
          if (!t) return EMPTY;
          this.isLoading.set(true);

          return of(55).pipe(
            tap(() => console.log('🔹 Діалог закрито, чекаємо 10 секунд...')),
            delay(10000),
            finalize(() => this.isLoading.set(false))
          );
        })
      )
      .subscribe((title) => {
        if (title) {
          console.log('Отримано назву:', title);
        }
      });
  }
}
