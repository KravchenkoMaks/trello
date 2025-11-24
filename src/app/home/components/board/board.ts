import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { List } from '../list/list';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { IBoard } from '../../interfaces/i-board';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBoards } from '../../services/s-boards';

@Component({
  selector: 'tr-board',
  imports: [RouterOutlet, List, RouterLink, ReactiveFormsModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  @ViewChild('inputRef') inputRef!: ElementRef;
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private boardsService = inject(SBoards);
  protected form: FormGroup;
  board?: IBoard;
  private boardId!: number;
  isEditing = signal<boolean>(false);
  private saveTriggered = false;

  constructor() {
    this.boardId = Number(this.route.snapshot.paramMap.get('id'));

    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ board }) => {
      this.board = { ...board, id: this.boardId };
    });
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
    });
  }

  protected enableEdit() {
    this.isEditing.set(true);
    const boardTitle = this.board?.title.trim() ?? '';
    this.form.patchValue({ title: boardTitle });
    setTimeout(() => this.inputRef?.nativeElement.focus());
  }

  protected saveEdit() {
    if (this.saveTriggered || this.form.invalid) {
      return;
    }
    this.saveTriggered = true;
    setTimeout(() => (this.saveTriggered = false), 500);

    const id = this.board?.id ?? this.boardId;
    const newTitle = this.form.value.title.trim();

    console.log('end: ');
    this.boardsService.updateBoard(id, { title: newTitle }).subscribe({
      next: () => {
        this.boardsService.getBoard(id).subscribe({
          next: (updatedBoard) => {
            this.board = { ...updatedBoard, id };
            this.isEditing.set(false);
          },
          error: (err) => {
            console.error('Помилка при отриманні оновленої дошки:', err);
            this.isEditing.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Помилка при оновленні назви:', err);
        this.isEditing.set(false);
      },
    });
  }
}
