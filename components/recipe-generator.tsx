import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';

export default function RecipeGenerator(props: {
  recipeCount: number,
  session: Session,
}) {
  const [ingredientText, setIngredientText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <>
      <header>
        <Link href='/my-recipes'>
          <a className='default-button mr-4'>My recipes</a>
        </Link>
        <button className='default-button' onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      </header>
      <div className='flex items-center justify-center flex-col p-4 w-full mt-4'>
        <div className='speech-bubble sm:w-full md:w-full lg:w-2/3 xl:w-2/3 2xl:w-2/3'>
          <h1 className='text-center text-2xl my-4'>
            Welcome! Enter ingredients you have at home and I will generate a delicious recipe for you <strong>🥗</strong>
          </h1>
          <h2 className='text-center text-xl my-4'>You have <strong>{5 - props.recipeCount}</strong> free recipes left.</h2>
          {/* TODO: Add link to sign up page */}
          <textarea className='border border-solid border-black rounded-xl outline-none p-4 w-4/5'
            value={ingredientText} onChange={(evt) => setIngredientText(evt.target.value)}
            placeholder={'Cheese\nPasta\nTomatoes'}></textarea>
          <button className='speech-bubble-button'
            onClick={() => {
              if (ingredientText) {
                setLoading(true);
                const ingredients = ingredientText.split('\n');
                axios.post('/api/generate-recipe', { ingredients },
                  { headers: { 'token': `${props.session.access_token}` } })
                  .then(response => {
                    setLoading(false);
                    router.push(`/recipe/${response.data.id}`);
                  })
                  .catch(error => {
                    setLoading(false);
                    // TODO: Show nice error message
                  });
              }
            }}>
            {
              loading ? 'Generating...' : 'Generate recipe'
            }
          </button>
        </div>
        <img src='/assets/peach-green.gif' height={300} width={300} />
      </div>
    </>
  );
}
