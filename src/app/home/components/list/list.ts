import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { Card } from '../card/card';
import { Dialog } from '@angular/cdk/dialog';
import { IList } from '../../interfaces/i-list';
import { ITitleModal } from '../../interfaces/i-title-modal';
import { TitleModal } from '../modals/title-modal/title-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, finalize, switchMap, tap } from 'rxjs';
import { SBoards } from '../../services/s-boards';
import { ICard } from '../../interfaces/i-card';
import { IBoard } from '../../interfaces/i-board';

@Component({
  selector: 'tr-list',
  imports: [Card],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  private boardsService = inject(SBoards);

  cardCreated = output<void>();
  board = input<IBoard>(); // TODO You don't need the whole board here, only board ID.
  list = input<IList>();
  isLoading = signal(false); // `isCardCreating`

  private titleModalData: ITitleModal = {
    modalTitle: 'Створити картку',
    label: 'Назва картки',
    placeholder: 'Введіть назву картки',
  };

  // TODO It is better to move the logic to the board component (this would simplify the list component and make this component reusable. Also it will remove the `board` prop.
  createCard() {
    this.dialog
      .open<string>(TitleModal, { data: this.titleModalData })
      .closed.pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((title) => {
          if (!title) return EMPTY; // TODO it is good practice to console.error in such places, as you did for the board id and list id below.

          const boardId = this.board()?.id;
          const listId = this.list()?.id;
          const position = this.list()?.cards?.length ?? 0;

          if (!boardId || !listId) {
            console.error('boardId або listId відсутній');
            return EMPTY;
          }

          this.isLoading.set(true);

          const dto: ICard = {
            title,
            list_id: listId,
            position,
          };

          return this.boardsService.createCard(boardId, dto).pipe(
            tap(() => {
              console.log('Картку створено');
              this.cardCreated.emit(); // TODO It is better to provide the logic in the service
            }),
            finalize(() => this.isLoading.set(false))
          );
        })
      )
      .subscribe({
        error: (err) => console.error('Помилка створення картки:', err),
      });
  }
}
