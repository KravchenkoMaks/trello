import { IList } from './i-list';

export interface IBoard {
  id?: number;
  title: string;
  custom?: Record<string, string | number>;
  lists?: IList[];
}
