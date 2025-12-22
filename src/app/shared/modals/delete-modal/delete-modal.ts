import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Btn } from '@buttons';
import { TItem } from '@types';

@Component({
  selector: 'tr-delete-modal',
  imports: [Btn],
  templateUrl: './delete-modal.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteModal {
  private dialogRef = inject(DialogRef<boolean>);
  private data = inject(DIALOG_DATA) as { type: TItem; itemName: string };

  itemType = computed(() => this.data.type);
  itemName = computed(() => this.data.itemName);

  confirm = (): void => this.dialogRef.close(true);
  close = (): void => this.dialogRef.close(false);
}
