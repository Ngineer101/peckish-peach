import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import useSWR from 'swr';
import Mascot from './mascot';

export default function RecipeGenerator(props: {
  session: Session,
}) {
  const [ingredientText, setIngredientText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const fetcher = (url: string) => fetch(url, { headers: { 'token': `${props.session.access_token}` } }).then(res => res.json());
  const { data, error } = useSWR('/api/allowed-recipe-count', fetcher);
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
            Welcome! Enter{' '}
            <strong className='text-white bg-black px-1 text-3xl'>
              at least 4 ingredients
            </strong>{' '}
            you have at home and I will generate a delicious recipe for you <strong>🥗</strong>
          </h1>
          <textarea className='border border-solid border-black rounded-xl outline-none p-4 w-4/5' style={{ minHeight: 120 }}
            value={ingredientText} onChange={(evt) => setIngredientText(evt.target.value)}
            placeholder={'Cheese\nPasta\nTomatoes'}></textarea>
          {
            errorMessage &&
            <label className='text-red-500 text-center font-bold my-2'>{errorMessage}</label>
          }
          <button className='speech-bubble-button'
            disabled={data && data.allowedRecipeCount === 0}
            onClick={() => {
              if (ingredientText) {
                const ingredients = ingredientText.split('\n');
                if (ingredients.length < 4) {
                  setErrorMessage('Please enter at least 4 ingredients.');
                  return;
                }

                setLoading(true);
                axios.post('/api/generate-recipe', { ingredients },
                  { headers: { 'token': `${props.session.access_token}` } })
                  .then(response => {
                    setLoading(false);
                    setErrorMessage('');
                    router.push(`/recipe/${response.data.id}`);
                  })
                  .catch(error => {
                    setLoading(false);
                    setErrorMessage('An error occurred while generating a recipe. Please refresh the page and try again.');
                  });
              }
            }}>
            {
              loading ? 'Generating...' : 'Generate recipe'
            }
          </button>
          {
            !error && !data &&
            <div className='flex justify-center items-start my-2'>
              <span className="animate-bounce h-3 w-3 rounded-full bg-black"></span>
              <span className="animate-bounce h-3 w-3 rounded-full bg-black mx-1"></span>
              <span className="animate-bounce h-3 w-3 rounded-full bg-black"></span>
            </div>
          }
          {
            data &&
            <h2 className='text-center text-xl my-4'>You have <strong>{data.allowedRecipeCount}</strong> free recipes left.</h2>
          }
          {
            error &&
            <h2 className='text-center text-xl my-4'>You have <strong>0</strong> free recipes left.</h2>
          }
          <a className='text-center text-xl mb-4 bg-blue-500 text-white font-bold py-1 px-2 hover:bg-white hover:text-blue-500 border border-blue-500 border-solid'
            style={{ transform: 'rotate(-2deg)' }} href='https://expert-inventor-1708.ck.page/10840b7f37' target='_blank'>
            Get more recipes!
          </a>
        </div>
        <Mascot />
      </div>
    </>
  );
}
