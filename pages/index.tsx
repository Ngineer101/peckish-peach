import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import axios from 'axios';
import Welcome from '../components/welcome';
import RecipeGenerator from '../components/recipe-generator';
import Footer from '../components/footer';
import Head from 'next/head';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => {
    setSession(supabaseClient.auth.session())
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session)
      axios.post('/api/auth', { event, session }, {
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
    })

    return () => {
      authListener?.unsubscribe();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="container">
        {
          !session ?
            <Welcome />
            :
            <RecipeGenerator session={session} />
        }
      </div>
      <Footer />
    </>
  )
}
