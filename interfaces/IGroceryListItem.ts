export interface IGroceryListItem {
  id: number;
  created_at: Date;
  updated_at: Date;
  description: string;
  is_checked: boolean;
  grocery_list_id: number;
  user_id: string;
}
