import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TModal } from '@services';
import { Btn } from '@buttons';

@Component({
  selector: 'tr-delete-modal',
  imports: [Btn],
  templateUrl: './delete-modal.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteModal {
  private dialogRef = inject(DialogRef<boolean>);
  private data = inject(DIALOG_DATA) as { type: TModal; elementName: string };

  element = computed(() => this.data.type);
  elementName = computed(() => this.data.elementName);

  confirm = (): void => this.dialogRef.close(true);
  close = (): void => this.dialogRef.close(false);
}
