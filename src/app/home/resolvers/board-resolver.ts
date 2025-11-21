import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { IBoard } from '../interfaces/i-board';

export const boardResolver: ResolveFn<IBoard> = (route) => {
  const id = Number(route.paramMap.get('id'));

  const board: IBoard = {
    id: id,
    title: 'Моя тестова дошка',
    lists: [
      {
        id: 1,
        title: 'Планы',
        cards: [
          { id: 1, title: 'помити кота' },
          { id: 2, title: 'приготувати суп' },
          { id: 3, title: 'сходити до магазину' },
        ],
      },
      {
        id: 2,
        title: 'В процесі',
        cards: [{ id: 4, title: 'подивитися сериал' }],
      },
      {
        id: 3,
        title: 'Зроблено',
        cards: [
          { id: 5, title: 'зробити домашку' },
          { id: 6, title: 'погуляти з собакою' },
        ],
      },
    ],
  };

  return of(board);
};
