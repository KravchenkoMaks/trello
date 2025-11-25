import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { List } from '../list/list';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { IBoard } from '../../interfaces/i-board';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBoards } from '../../services/s-boards';
import { BoardHeader } from '../board-header/board-header';

@Component({
  selector: 'tr-board',
  imports: [RouterOutlet, List, RouterLink, ReactiveFormsModule, BoardHeader],
  templateUrl: './board.html',
  styleUrl: './board.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  private route = inject(ActivatedRoute);
  private boardsService = inject(SBoards);
  private fb = inject(FormBuilder);

  form: FormGroup;
  board = signal<IBoard | undefined>(undefined);
  private boardId: number;
  private saveTriggered = false;

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
    });

    this.boardId = Number(this.route.snapshot.paramMap.get('id'));

    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ board }) => {
      console.log(board);
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
    console.log('gggg');
  }
}
