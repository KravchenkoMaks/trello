import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { BoardCreatingForm, CardCreatingForm, ListCreatingForm } from '@forms';
import { IModalData } from '@interfaces';
import { TItem } from '@types';

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
  readonly type = signal<TItem>(this.data?.type ?? 'item');

  protected submit(title: string): void {
    this.dialogRef.close(title);
  }

  protected closeModal = (): void => {
    this.dialogRef?.close();
  };
}
