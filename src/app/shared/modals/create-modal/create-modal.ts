import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IModalData } from '@models/interfaces/i-modal-data';
import { TModal } from '@models/types/t-modal';
import { CreateTitleForm } from '@shared/forms/text-creating-form/text-creating-form';

@Component({
  selector: 'tr-create-modal',
  imports: [CreateTitleForm],
  templateUrl: './create-modal.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateModal {
  private dialogRef = inject(DialogRef<string>);
  private data = inject<IModalData>(DIALOG_DATA, { optional: true });

  private readonly typeMap: Record<TModal, [string, string]> = {
    board: ['дошку', 'дошки'],
    list: ['список', 'списку'],
    card: ['картку', 'картки'],
    element: ['елеммент', 'елемменту'],
  };

  private get typeForms(): [string, string] {
    return this.typeMap[this.data?.type ?? 'element'];
  }

  get modalName(): string {
    return `Створити ${this.typeForms[0]}`;
  }

  get label(): string {
    return `Назва ${this.typeForms[1]}`;
  }

  get placeholder(): string {
    return `Введіть назву ${this.typeForms[1]}`;
  }

  protected submit(title: string): void {
    this.dialogRef.close(title);
  }

  protected closeModal = (): void => {
    console.log('CreateModal -> ', 'close');
    this.dialogRef?.close();
  };
}
