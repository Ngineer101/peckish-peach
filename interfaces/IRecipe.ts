export interface IRecipe {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  image_url: string;
  instructions: string[];
  ingredients: string[];
  user_id: string;
}
