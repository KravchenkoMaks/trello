export interface ICard {
  id: number;
  title: string;
  list_id: number;
  position: number;
  color: string;
  description: string;
  custom: Record<string, string | number>;
  created_at: number;
}
