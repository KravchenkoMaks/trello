import { IList } from './i-list';

export interface IBoard {
  id: number;
  title: string;
  lists: IList[];
  custom: {
    color: string;
  };
}
