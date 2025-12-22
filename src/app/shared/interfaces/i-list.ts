import { ICard } from './i-card';

export interface IList {
  id: number;
  title: string;
  position: number;
  cards: ICard[];
}
