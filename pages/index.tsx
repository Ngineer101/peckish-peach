import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import axios from 'axios';
import Welcome from '../components/welcome';
import RecipeGenerator from '../components/recipe-generator';
import Footer from '../components/footer';

export default function Home(props: {
  recipeCount: number,
}) {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => {
    setSession(supabaseClient.auth.session())
    supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session)
      axios.post('/api/auth', { event, session }, {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
    })
  }, []);

  return (
    <>
      <div className="container">
        {
          !session ?
            <Welcome />
            :
            <RecipeGenerator session={session} recipeCount={props.recipeCount} />
        }
      </div>
      <Footer />
    </>
  )
}

export const getServerSideProps = async (context: any): Promise<any> => {
  supabaseClient.auth.setAuth(context.req.cookies["sb:token"]);
  const { user } = await supabaseClient.auth.api.getUserByCookie(context.req)
  const countResponse = await supabaseClient
    .from('recipes')
    .select('id', { count: 'exact' })
    .eq('user_id', user!.id);

  return {
    props: {
      recipeCount: countResponse.count,
    }
  }
}
