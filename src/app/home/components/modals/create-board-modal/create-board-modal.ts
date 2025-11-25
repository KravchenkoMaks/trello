import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SBoards } from '../../../services/s-boards';
import { switchMap } from 'rxjs';
import { IBoard } from '../../../interfaces/i-board';
import { TitleForm } from '../../forms/title-form/title-form';

@Component({
  selector: 'tr-create-board-modal',
  imports: [ReactiveFormsModule, TitleForm],
  templateUrl: './create-board-modal.html',
  styleUrl: './create-board-modal.css',
})
export class CreateBoardModal {
  private dialogRef = inject(DialogRef<IBoard[]>);
  private boardsService = inject(SBoards);

  protected onTitleSubmitted(title: string): void {
    this.boardsService
      .createBoard(title)
      .pipe(switchMap(() => this.boardsService.getBoards()))
      .subscribe({
        next: (boards) => this.dialogRef.close(boards),
        error: (err) => console.error('Error while creating board', err),
      });
  }

  protected closeModal() {
    this.dialogRef?.close();
  }
}
