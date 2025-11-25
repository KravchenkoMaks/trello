import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { TitleForm } from '../../forms/title-form/title-form';
import { CloseModalBtn } from '../../buttons/close-modal-btn/close-modal-btn';

@Component({
  selector: 'tr-create-list-modal',
  imports: [TitleForm, CloseModalBtn],
  templateUrl: './create-list-modal.html',
  styleUrl: './create-list-modal.css',
})
export class CreateListModal {
  private dialogRef = inject(DialogRef<string>);

  modalTitle = signal('Створити список');
  label = signal('Назва списка');
  placeholder = signal('Bведіть назву списка');

  protected onTitleSubmitted(title: string): void {
    this.dialogRef.close(title);
  }

  protected closeModal() {
    this.dialogRef?.close();
  }
}
