export interface INewCard {
  id?: number;
  title: string;
  list_id: number;
  position?: number;
  description?: string;
  custom?: Record<string, string | number>;
}
