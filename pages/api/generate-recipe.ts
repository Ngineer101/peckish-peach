import {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { supabaseClient } from '../../utils/supabaseClient';
import OpenAI from 'openai-api';

export default async function GenerateRecipeHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.token as string;
  const { data: user, error } = await supabaseClient.auth.api.getUser(token);
  if (error) {
    return res.status(401).json({ error: error.message });
  }

  if (!user) {
    return res.status(401).json({ error: 'user_not_found' });
  }

  supabaseClient.auth.setAuth(token);

  if (req.method === "POST") {

    const countResponse = await supabaseClient
      .from('recipes')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    if ((countResponse as any).count >= 5) {
      return res.status(400).json({ error: 'max_free_recipes_reached' });
    }

    let {
      ingredients,
    } = req.body;

    ingredients = ingredients ?? [];
    const openai = new OpenAI(process.env.OPENAI_API_KEY || '');
    const prompt = `Write a recipe based on these ingredients:\n\nIngredients:\n${ingredients.join('\n')}`
    const response = await openai.complete({
      engine: "davinci-instruct-beta",
      prompt: prompt,
      temperature: 0,
      maxTokens: 500,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    });

    if (response.data.choices && response.data.choices.length > 0) {
      const choice = response.data.choices[0];
      let values = choice.text.split('\n');
      values = values.filter(v => v.trim() != '');
      const title = values[0];
      const instructions = values.slice(1, values.length - 1);
      const { data, error } = await supabaseClient
        .from('recipes')
        .insert([
          {
            title: title,
            image_url: null,
            ingredients: ingredients,
            instructions: instructions,
            user_id: user!.id,
          }
        ]);

      return res.status(200).json((data || [])[0]);
    }

    res.status(400).json({ error: 'unable_to_generate_recipe' });
  } else {
    res.status(405).send('Method not allowed');
  }
}
