import { ICard } from './i-card';

export interface IList {
  id: number;
  title: string;
  cards: ICard[];
}
