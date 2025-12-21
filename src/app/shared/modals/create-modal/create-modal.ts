import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { IModalData } from '@models/interfaces/i-modal-data';
import { CreateTitleForm } from '@shared/forms/text-creating-form/text-creating-form';
import { MultiForm } from '@shared/forms/multi-form/multi-form';
import { TModal } from '@services/dialog-service';

@Component({
  selector: 'tr-create-modal',
  imports: [CreateTitleForm, MultiForm],
  templateUrl: './create-modal.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateModal {
  private dialogRef = inject(DialogRef<string>);
  private data = inject<IModalData>(DIALOG_DATA, { optional: true });

  readonly type = signal<TModal>(this.data?.type ?? 'element');

  private readonly typeMap: Record<TModal, [string, string]> = {
    board: ['дошку', 'дошки'],
    list: ['список', 'списку'],
    card: ['картку', 'картки'],
    element: ['елеммент', 'елемменту'],
  };

  private typeForms = computed<[string, string]>(() => this.typeMap[this.type()]);

  modalName = computed(() => `Створити ${this.typeForms()[0]}`);
  label = computed(() => `Назва ${this.typeForms()[1]}`);
  placeholder = computed(() => `Введіть назву ${this.typeForms()[1]}`);
  isMultiForm = computed(() => this.type() === 'card');

  protected submit(title: string): void {
    this.dialogRef.close(title);
  }

  protected closeModal = (): void => {
    this.dialogRef?.close();
  };
}
