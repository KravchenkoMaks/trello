import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { CreateModal, DeleteModal } from '@modals';
import { TItem } from '@types';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(Dialog);

  openCreateModal(type: TItem): Observable<string | undefined> {
    return this.dialog.open<string>(CreateModal, {
      data: { type },
    }).closed;
  }

  openDeleteModal(itemType: TItem, itemName: string): Observable<boolean> {
    return this.dialog
      .open<boolean>(DeleteModal, {
        data: { itemType, itemName: itemName },
      })
      .closed.pipe(map((result) => !!result));
  }
}
