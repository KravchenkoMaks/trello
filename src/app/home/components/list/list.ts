import { Component, DestroyRef, inject, input } from '@angular/core';
import { ICard } from '../../interfaces/i-card';
import { Card } from '../card/card';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'tr-list',
  imports: [Card],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  id = input<number>();
  title = input<string>();
  cards = input<ICard[]>();

  createCard() {
    // this.dialog.open<string>(CardTitleModal)
    // .closed.pipe(
    //   takeUntilDestroyed(this.destroyRef)
    // )
  }
}
