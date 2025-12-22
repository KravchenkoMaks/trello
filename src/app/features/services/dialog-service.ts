import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { CreateModal } from '@shared/modals/create-modal/create-modal';
import { DeleteModal } from '@shared/modals/delete-modal/delete-modal';
import { map, Observable } from 'rxjs';

export type TModal = 'board' | 'list' | 'card' | 'element';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(Dialog);

  openCreateModal(type: TModal): Observable<string | undefined> {
    return this.dialog.open<string>(CreateModal, {
      data: { type },
    }).closed;
  }

  openDeleteModal(type: TModal, elementName: string): Observable<boolean> {
    return this.dialog
      .open<boolean>(DeleteModal, {
        data: { type, elementName },
      })
      .closed.pipe(map((result) => !!result));
  }
}
