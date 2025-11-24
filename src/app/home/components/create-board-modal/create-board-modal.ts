import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBoards } from '../../services/s-boards';
import { switchMap } from 'rxjs';
import { IBoard } from '../../interfaces/i-board';

@Component({
  selector: 'tr-create-board-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './create-board-modal.html',
  styleUrl: './create-board-modal.css',
})
export class CreateBoardModal {
  private dialogRef = inject(DialogRef<IBoard[]>);
  private fb = inject(FormBuilder);
  private boardsService = inject(SBoards);

  protected form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;

    const { title } = this.form.value;
    const trimmedTitle = title.trim();

    if (!trimmedTitle) return;

    this.boardsService
      .createBoard(trimmedTitle)
      .pipe(switchMap(() => this.boardsService.getBoards()))
      .subscribe({
        next: (boards) => {
          this.dialogRef.close(boards);
        },
        error: (err) => {
          console.error('Error while creating board', err);
        },
      });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  protected closeModal() {
    this.dialogRef?.close();
  }
}
