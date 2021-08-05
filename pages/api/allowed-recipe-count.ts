import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseClient } from '../../utils/supabaseClient';

export default async function AllowedRecipeCountHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.token as string;
  const { data: user, error } = await supabaseClient.auth.api.getUser(token);
  if (error) {
    return res.status(401).json({ error: error.message });
  }

  if (!user) {
    return res.status(401).json({ error: 'user_not_found' });
  }

  supabaseClient.auth.setAuth(token);

  if (req.method === 'GET') {
    const countResponse = await supabaseClient
      .from('recipes')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    const allowedRecipeCount = countResponse ? (5 - (countResponse as any).count) : 0;
    res.status(200).json({ allowedRecipeCount });
  } else {
    res.status(405).send('Method not allowed');
  }
}
