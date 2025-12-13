import { ICard } from '@interfaces/i-card';
export interface IList {
  id: number;
  title: string;
  position: number;
  cards: ICard[];
}
