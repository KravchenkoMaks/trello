import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { TitleForm } from '../../forms/title-form/title-form';
import { CloseModalBtn } from '../../buttons/close-modal-btn/close-modal-btn';
import { ITitleModal } from '../../../interfaces/i-title-modal';

@Component({
  selector: 'tr-title-modal',
  imports: [TitleForm, CloseModalBtn],
  templateUrl: './title-modal.html',
  styleUrl: './title-modal.css',
})
export class TitleModal {
  private dialogRef = inject(DialogRef<string>);
  private data = inject<ITitleModal>(DIALOG_DATA, { optional: true });

  modalTitle = signal(this.data?.modalTitle ?? 'Title');
  label = signal(this.data?.label ?? 'Name');
  placeholder = signal(this.data?.placeholder ?? 'Enter name');

  protected onTitleSubmitted(title: string): void {
    this.dialogRef.close(title);
  }

  protected closeModal() {
    this.dialogRef?.close();
  }
}
