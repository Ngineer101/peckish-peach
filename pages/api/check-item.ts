import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseClient } from '../../utils/supabaseClient';

export default async function CheckItemHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.token as string;
  const { user, error } = await supabaseClient.auth.api.getUser(token);
  if (error) {
    return res.status(401).json({ error: error.message });
  }

  if (!user) {
    return res.status(401).json({ error: 'user_not_found' });
  }

  supabaseClient.auth.setAuth(token);

  if (req.method == "POST") {
    const response = await supabaseClient.from('grocery_list_items')
      .update({
        is_checked: req.body.checked,
      })
      .match({
        id: req.body.id,
        user_id: user.id
      });

    if (!response.error) {
      return res.status(204).send('Updated grocery list item');
    }

    return res.status(400).send('An error occurred while processing the request');
  } else {
    return res.status(405).send('Method not allowed');
  }
}
