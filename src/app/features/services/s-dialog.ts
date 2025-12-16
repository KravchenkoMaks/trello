import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { TModal } from '@models/types/t-modal';
import { CreateModal } from '@shared/modals/create-modal/create-modal';
import { DeleteModal } from '@shared/modals/delete-modal/delete-modal';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SDialog {
  private dialog = inject(Dialog);

  openCreateModal(type: TModal): Observable<string | undefined> {
    return this.dialog.open<string>(CreateModal, {
      data: { type },
    }).closed;
  }

  openDeleteModal(type: TModal): Observable<boolean> {
    return this.dialog
      .open<boolean>(DeleteModal, {
        data: { type },
      })
      .closed.pipe(map((result) => !!result));
  }
}
