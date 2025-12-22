import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { IModalData } from '@models/interfaces/i-modal-data';
import { TModal } from '@services/dialog-service';
import { CardCreatingForm } from '@components/forms/card-creating-form/card-creating-form';
import { ListCreatingForm } from '@components/forms/list-creating-form/list-creating-form';
import { BoardCreatingForm } from '@components/forms/board-creating-form/board-creating-form';

@Component({
  selector: 'tr-create-modal',
  imports: [CardCreatingForm, ListCreatingForm, BoardCreatingForm],
  templateUrl: './create-modal.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateModal {
  private dialogRef = inject(DialogRef<string>);
  private data = inject<IModalData>(DIALOG_DATA, { optional: true });

  readonly modalName = computed(() => `Create ${this.type()}`);
  readonly type = signal<TModal>(this.data?.type ?? 'element');

  protected submit(title: string): void {
    this.dialogRef.close(title);
  }

  protected closeModal = (): void => {
    this.dialogRef?.close();
  };
}
