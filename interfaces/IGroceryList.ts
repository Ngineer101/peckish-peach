import { IGroceryListItem } from './IGroceryListItem';

export interface IGroceryList {
  id: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  items: IGroceryListItem[];
}
