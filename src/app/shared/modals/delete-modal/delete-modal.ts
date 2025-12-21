import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Btn } from '@shared/btn/btn';
import { TModal } from '@services/dialog-service';

@Component({
  selector: 'tr-delete-modal',
  imports: [Btn],
  templateUrl: './delete-modal.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteModal {
  private dialogRef = inject(DialogRef<boolean>);
  private data = inject(DIALOG_DATA) as { type: TModal; name: string };

  get typeText() {
    const map: Record<TModal, string> = {
      board: 'дошку',
      list: 'список',
      card: 'картку',
      element: 'елемент',
    };
    return map[this.data.type] ?? 'елемент';
  }

  get name() {
    return this.data.name;
  }

  confirm = (): void => this.dialogRef.close(true);
  close = (): void => this.dialogRef.close(false);
}
