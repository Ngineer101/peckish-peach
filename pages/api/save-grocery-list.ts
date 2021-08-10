import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { IGroceryListItem } from '../../interfaces/IGroceryListItem';
import { supabaseClient } from '../../utils/supabaseClient';

export default async function SaveGroceryListHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.token as string;
  const { user, error } = await supabaseClient.auth.api.getUser(token);
  if (error) {
    return res.status(401).json({ error: error.message });
  }

  if (!user) {
    return res.status(401).json({ error: 'user_not_found' });
  }

  supabaseClient.auth.setAuth(token);

  switch (req.method) {
    case "POST":
      const groceryListResponse = await supabaseClient
        .from('grocery_lists')
        .insert({
          name: req.body.name,
          user_id: user.id,
        });

      if (!groceryListResponse.error) {
        const groceryListItems = mapGroceryListItems(req.body.items, groceryListResponse.data[0].id, user.id);
        const groceryListItemResponse = await supabaseClient
          .from('grocery_list_items')
          .insert(groceryListItems);

        if (!groceryListItemResponse.error) {
          return res.status(201).json({ id: groceryListResponse.data[0].id });
        }
      }

      return res.status(400).send('An error occurred while saving grocery list.');
    case "PUT":
      const {
        id,
        name,
        items,
      } = req.body;

      await supabaseClient
        .from('grocery_list_items')
        .delete()
        .eq('grocery_list_id', id)
        .eq('user_id', user.id);

      const updateResponse = await supabaseClient
        .from('grocery_lists')
        .update({
          name: name
        })
        .match({
          id: id,
          user_id: user.id,
        });

      if (!updateResponse.error) {
        const groceryListItems = mapGroceryListItems(items, id, user.id);
        const itemsResponse = await supabaseClient
          .from('grocery_list_items')
          .insert(groceryListItems);

        if (!itemsResponse.error) {
          return res.status(201).json({ id: id });
        }
      }

      return res.status(400).send('Error updating grocery list');
    case "DELETE":
      await supabaseClient
        .from('grocery_list_items')
        .delete()
        .eq('grocery_list_id', req.query.id)
        .eq('user_id', user.id);

      await supabaseClient
        .from('grocery_lists')
        .delete()
        .eq('id', req.query.id)
        .eq('user_id', user.id);

      return res.status(204).send('Grocery list successfully deleted.');
    default:
      return res.status(405).send('Method not allowed');
  }
}

const mapGroceryListItems = (items: any[], groceryListId: number, userId: string): any[] => {
  return (items || []).map((i: IGroceryListItem) => {
    return {
      description: i.description,
      grocery_list_id: groceryListId,
      is_checked: false,
      user_id: userId,
    }
  });
}
